import { Router } from "express";
import { storage } from "../storage";
import { requireAdmin, requireSubAdmin } from "../middleware";

const router = Router();

// Get all users (Admin only)
router.get("/users", requireAdmin, async (_req, res) => {
  try {
    const users = await storage.getAllUsers();
    return res.json(users.map(({ password: _, ...u }) => u));
  } catch (error) {
    return res.status(500).json({ message: "Failed to get users" });
  }
});

// Delete user (Admin only)
router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId <= 0) return res.status(400).json({ message: "Cannot delete demo accounts" });
    await storage.deleteUser(userId);
    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

// Create problem (Admin or Sub-Admin)
router.post("/problems", requireSubAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, category, tags, xpReward, hints, solution, isDaily } = req.body;
    if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and description required" });
    const problem = await storage.createProblem({
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty || 'Easy',
      category: category || 'Arrays',
      tags: tags || [],
      xpReward: xpReward || 100,
      hints: hints || [],
      solution: solution || null,
      isDaily: isDaily || false,
    });
    return res.status(201).json(problem);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create problem" });
  }
});

// Create roadmap (Admin or Sub-Admin)
router.post("/roadmaps", requireSubAdmin, async (req, res) => {
  try {
    const { title, description, category, difficulty, estimatedTime, modules } = req.body;
    if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and description required" });
    const roadmap = await storage.createRoadmap({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Web Development',
      difficulty: difficulty || 'Beginner',
      estimatedTime: estimatedTime || null,
      modules: modules || [],
    });
    return res.status(201).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create roadmap" });
  }
});

export default router;
