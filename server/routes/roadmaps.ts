import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// Get all roadmaps
router.get("/", async (_req, res) => {
  try {
    const roadmaps = await storage.getAllRoadmaps();
    return res.json(roadmaps);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get roadmaps" });
  }
});

// Get specific roadmap
router.get("/:id", async (req, res) => {
  try {
    const roadmapId = parseInt(req.params.id);
    const roadmap = await storage.getRoadmap(roadmapId);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });
    return res.json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get roadmap" });
  }
});

// Get user progress for a roadmap
router.get("/:roadmapId/progress/:userId", requireAuth, async (req, res) => {
  try {
    const progress = await storage.getUserProgress(
      parseInt(req.params.userId),
      parseInt(req.params.roadmapId)
    );
    return res.json(progress || null);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get progress" });
  }
});

// Update user progress for a roadmap
router.post("/:roadmapId/progress/:userId", requireAuth, async (req, res) => {
  try {
    if (req.session.userId !== parseInt(req.params.userId) && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const progress = await storage.updateUserProgress(
      parseInt(req.params.userId),
      parseInt(req.params.roadmapId),
      req.body
    );
    return res.json(progress);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update progress" });
  }
});

export default router;
