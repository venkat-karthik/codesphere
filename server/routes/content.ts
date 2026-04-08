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

// ─── PROBLEMS ────────────────────────────────────────────────────────────

router.get("/problems", async (req, res) => {
  try {
    const { difficulty, daily } = req.query;
    let problems;
    if (daily === 'true') {
      const dp = await storage.getDailyProblem(new Date());
      problems = dp ? [dp] : [];
    } else if (difficulty) {
      problems = await storage.getProblemsByDifficulty(difficulty as string);
    } else {
      problems = await storage.getAllProblems();
    }
    return res.json(problems);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get problems" });
  }
});

export default router;
