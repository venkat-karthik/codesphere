import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PDFResource {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  fileSize: string | null;
  pageCount: number | null;
  downloadCount: number;
  url: string | null;
  createdAt: string;
}

const CATEGORIES = ['javascript', 'react', 'nodejs', 'css', 'html', 'typescript', 'python', 'general'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function AdminPDFResources() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'javascript', difficulty: 'beginner' });

  // Fetch PDFs from Neon via /api/pdfs (which now uses resources table)
  const { data: pdfs = [], isLoading } = useQuery<PDFResource[]>({
    queryKey: ['/api/pdfs'],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        // Update metadata only
        const res = await fetch(`/api/pdfs/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      }
      // Upload new PDF
      if (!file) throw new Error('No file selected');
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', form.title || file.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('difficulty', form.difficulty);
      const res = await fetch('/api/pdfs', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/pdfs'] });
      qc.invalidateQueries({ queryKey: ['/api/resources'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', category: 'javascript', difficulty: 'beginner' });
      setFile(null);
      setEditId(null);
      toast({ title: editId ? 'PDF updated' : 'PDF uploaded successfully' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/pdfs/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/pdfs'] });
      qc.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({ title: 'PDF deleted' });
    },
  });

  const openEdit = (pdf: PDFResource) => {
    setEditId(pdf.id);
    setForm({ title: pdf.title, description: pdf.description, category: pdf.category, difficulty: pdf.difficulty });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Admin PDF Resources</h1>
      <p className="mb-4 text-muted-foreground">Upload and manage PDF resources stored in Neon DB. (Admin only)</p>
      <Button className="mb-4" onClick={() => { setEditId(null); setForm({ title: '', description: '', category: 'javascript', difficulty: 'beginner' }); setFile(null); setIsModalOpen(true); }}>
        Upload PDF
      </Button>

      <div className="border rounded p-4 bg-card">
        <h2 className="text-xl font-semibold mb-4">PDFs ({(pdfs as PDFResource[]).length})</h2>
        {isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (pdfs as PDFResource[]).length === 0 ? (
          <p className="text-muted-foreground">No PDFs uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Difficulty</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Downloads</th>
                <th className="py-2 pr-4">Actions</th>
              </tr></thead>
              <tbody>
                {(pdfs as PDFResource[]).map(pdf => (
                  <tr key={pdf.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 pr-4 font-semibold max-w-xs truncate">{pdf.title}</td>
                    <td className="py-2 pr-4"><Badge variant="outline">{pdf.category}</Badge></td>
                    <td className="py-2 pr-4"><Badge variant="secondary">{pdf.difficulty}</Badge></td>
                    <td className="py-2 pr-4 text-xs">{pdf.fileSize || '—'}</td>
                    <td className="py-2 pr-4">{pdf.downloadCount}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(pdf)}>Edit</Button>
                      {pdf.url && (
                        <Button size="sm" variant="ghost" onClick={() => window.open(pdf.url!, '_blank')}>View</Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(pdf.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit PDF' : 'Upload PDF'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Title</label>
              <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={file?.name || 'PDF title'} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-sm">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Difficulty</label>
                <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {!editId && (
              <div>
                <label className="block mb-1 font-medium text-sm">PDF File</label>
                <input type="file" accept=".pdf" className="w-full text-sm"
                  onChange={e => setFile(e.target.files?.[0] || null)} />
                {file && <p className="text-xs text-muted-foreground mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || (!editId && !file)}>
              {saveMutation.isPending ? 'Saving...' : editId ? 'Save' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
