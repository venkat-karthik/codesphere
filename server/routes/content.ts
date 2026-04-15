import { Router } from "express";
import { storage } from "../storage";
import { requireAdmin } from "../middleware";

const router = Router();

// ─── RESOURCES ───────────────────────────────────────────────────────────

router.get("/resources", async (req, res) => {
  try {
    const { category } = req.query;
    const resources = category
      ? await storage.getResourcesByCategory(category as string)
      : await storage.getAllResources();
    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get resources" });
  }
});

router.post("/resources", requireAdmin, async (req, res) => {
  try {
    const resource = await storage.createResource(req.body);
    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create resource" });
  }
});

router.patch("/resources/:id", requireAdmin, async (req, res) => {
  try {
    const resource = await storage.updateResource(parseInt(req.params.id), req.body);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update resource" });
  }
});

// ─── VIDEOS (resources with type='video') ────────────────────────────────

router.get("/videos", async (req, res) => {
  try {
    const all = await storage.getAllResources();
    const videos = all.filter((r: any) => r.type === 'video');
    return res.json(videos);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get videos" });
  }
});

router.post("/videos", requireAdmin, async (req, res) => {
  try {
    const resource = await storage.createResource({ ...req.body, type: 'video' });
    return res.status(201).json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create video" });
  }
});

router.patch("/videos/:id", requireAdmin, async (req, res) => {
  try {
    const resource = await storage.updateResource(parseInt(req.params.id), req.body);
    if (!resource) return res.status(404).json({ message: "Video not found" });
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update video" });
  }
});

// ─── PROBLEMS ────────────────────────────────────────────────────────────

router.get("/problems", async (req, res) => {
  try {
    const { difficulty, daily, category, search } = req.query;
    let allProblems = await storage.getAllProblems();

    if (daily === 'true') {
      allProblems = allProblems.filter((p: any) => p.isDaily);
    }
    if (difficulty && difficulty !== 'all') {
      allProblems = allProblems.filter((p: any) =>
        p.difficulty.toLowerCase() === (difficulty as string).toLowerCase()
      );
    }
    if (category && category !== 'all') {
      allProblems = allProblems.filter((p: any) =>
        p.category.toLowerCase() === (category as string).toLowerCase()
      );
    }
    if (search) {
      const q = (search as string).toLowerCase();
      allProblems = allProblems.filter((p: any) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags as string[]).some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return res.json(allProblems);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get problems" });
  }
});

export default router;
