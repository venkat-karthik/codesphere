import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { storage } from '../storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Local fallback upload dir
const uploadDir = path.resolve(__dirname, '../uploads/pdfs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const multerStorage = multer.memoryStorage(); // use memory so we can stream to R2 or Drive

const upload = multer({
  storage: multerStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

// ── Cloudflare R2 upload helper ────────────────────────────────────────────

async function uploadToR2(buffer: Buffer, fileName: string, mimeType: string): Promise<string | null> {
  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) return null;

  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    });

    const key = `pdfs/${Date.now()}_${fileName}`;
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }));

    const publicBase = R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    return `${publicBase}/${key}`;
  } catch (err) {
    console.error('[R2] Upload failed:', err);
    return null;
  }
}

// ── Google Drive upload helper ─────────────────────────────────────────────

async function uploadToGoogleDrive(buffer: Buffer, fileName: string, mimeType: string): Promise<string | null> {
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!FOLDER_ID || !SERVICE_ACCOUNT_KEY) return null;

  try {
    const { google } = await import('googleapis');
    const { Readable } = await import('stream');
    const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: { name: fileName, parents: [FOLDER_ID] },
      media: { mimeType, body: Readable.from(buffer) },
      fields: 'id',
    });

    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return `https://drive.google.com/uc?export=download&id=${response.data.id}`;
  } catch (err) {
    console.error('[Google Drive] Upload failed:', err);
    return null;
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

// GET all PDFs
router.get('/', async (_req, res) => {
  try {
    const all = await storage.getAllResources();
    return res.json(all.filter(r => r.type === 'pdf'));
  } catch {
    return res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// POST upload a new PDF
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { title, description, category, difficulty } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const buffer = req.file.buffer;
    const originalName = req.file.originalname;
    const fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Priority: R2 → Google Drive → local disk
    let fileUrl: string | null = await uploadToR2(buffer, originalName, 'application/pdf');

    if (fileUrl) {
      console.log(`[PDF] Uploaded to R2: ${fileUrl}`);
    } else {
      fileUrl = await uploadToGoogleDrive(buffer, originalName, 'application/pdf');
      if (fileUrl) {
        console.log(`[PDF] Uploaded to Google Drive: ${fileUrl}`);
      } else {
        // Fall back to local disk
        const fileName = `${Date.now()}_${originalName}`;
        const localPath = path.resolve(uploadDir, fileName);
        fs.writeFileSync(localPath, buffer);
        fileUrl = `/api/pdfs/download/${fileName}`;
        console.log(`[PDF] Stored locally (no cloud config): ${fileUrl}`);
      }
    }

    const resource = await storage.createResource({
      title: title || originalName,
      description: description || '',
      category: category || 'general',
      type: 'pdf',
      difficulty: difficulty || 'beginner',
      tags: [],
      downloadCount: 0,
      fileSize,
      pageCount: null,
      url: fileUrl,
    });

    return res.status(201).json(resource);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// PUT update PDF metadata
router.put('/:id', async (req, res) => {
  try {
    const updated = await storage.updateResource(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch {
    return res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE PDF
router.delete('/:id', async (req, res) => {
  try {
    const resource = await storage.getResource(parseInt(req.params.id));
    if (!resource) return res.status(404).json({ error: 'Not found' });

    // Delete local file if it's a local URL
    if (resource.url?.startsWith('/api/pdfs/download/')) {
      const fileName = resource.url.split('/').pop();
      if (fileName) {
        const filePath = path.resolve(uploadDir, fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    // Note: Google Drive files are not deleted (intentional — admin can manage from Drive)

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Delete failed' });
  }
});

// Serve local PDF file
router.get('/download/:fileName', (req, res) => {
  const filePath = path.resolve(uploadDir, req.params.fileName);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;
