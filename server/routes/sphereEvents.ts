import { Router } from "express";
import { db } from "../db";
import { requireAdmin } from "../middleware";

const router = Router();

// In-memory fallback when DB not available
let memEvents: any[] = [];
let nextId = 1;

async function getAll() {
  if (!db) return memEvents;
  try {
    const result = await db.execute(`
      SELECT id, title, description, latitude, longitude, date, category, created_at
      FROM sphere_events ORDER BY date ASC
    `);
    return (result as any).rows || [];
  } catch {
    return memEvents;
  }
}

async function ensureTable() {
  if (!db) return;
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS sphere_events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        latitude DECIMAL(10,6) NOT NULL,
        longitude DECIMAL(10,6) NOT NULL,
        date DATE NOT NULL,
        category TEXT NOT NULL DEFAULT 'event',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
  } catch {}
}

ensureTable();

router.get("/", async (_req, res) => {
  try {
    return res.json(await getAll());
  } catch {
    return res.json([]);
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { title, description, latitude, longitude, date, category } = req.body;
  if (!title || !latitude || !longitude || !date) {
    return res.status(400).json({ message: "title, latitude, longitude, date are required" });
  }
  try {
    if (db) {
      const result = await db.execute(
        `INSERT INTO sphere_events (title, description, latitude, longitude, date, category)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, description || '', latitude, longitude, date, category || 'event']
      );
      return res.status(201).json((result as any).rows[0]);
    } else {
      const event = { id: nextId++, title, description: description || '', latitude, longitude, date, category: category || 'event' };
      memEvents.push(event);
      return res.status(201).json(event);
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, latitude, longitude, date, category } = req.body;
  try {
    if (db) {
      const result = await db.execute(
        `UPDATE sphere_events SET title=$1, description=$2, latitude=$3, longitude=$4, date=$5, category=$6
         WHERE id=$7 RETURNING *`,
        [title, description || '', latitude, longitude, date, category || 'event', id]
      );
      const rows = (result as any).rows;
      if (!rows?.length) return res.status(404).json({ message: "Not found" });
      return res.json(rows[0]);
    } else {
      const idx = memEvents.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ message: "Not found" });
      memEvents[idx] = { ...memEvents[idx], title, description, latitude, longitude, date, category };
      return res.json(memEvents[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (db) {
      await db.execute(`DELETE FROM sphere_events WHERE id=$1`, [id]);
    } else {
      memEvents = memEvents.filter(e => e.id !== id);
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
