import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// Get user projects
router.get("/", requireAuth, async (req, res) => {
  try {
    const projects = await storage.getUserProjects(req.session.userId!);
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get projects" });
  }
});

// Create new project
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, description, language, framework, type } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Project name is required" });
    const project = await storage.createProject({
      userId: req.session.userId!,
      name: name.trim(),
      description: description || '',
      language: language || 'JavaScript',
      framework: framework || null,
      type: type || 'custom',
      isPublic: false,
      sourceCode: null,
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create project" });
  }
});

// Update project
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const project = await storage.updateProject(parseInt(req.params.id), req.session.userId!, req.body);
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete project
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await storage.deleteProject(parseInt(req.params.id), req.session.userId!);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;
