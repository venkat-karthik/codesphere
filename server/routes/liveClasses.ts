import { Router } from "express";
import { storage } from "../storage";
import { requireAuth, requireAdmin } from "../middleware";

const router = Router();

// Get all live classes
router.get("/", async (req, res) => {
  try {
    const { status, instructorId } = req.query;
    let classes;
    if (status) classes = await storage.getLiveClassesByStatus(status as string);
    else if (instructorId) classes = await storage.getLiveClassesByInstructor(instructorId as string);
    else classes = await storage.getAllLiveClasses();
    return res.json(classes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get live classes" });
  }
});

// Get specific live class
router.get("/:id", async (req, res) => {
  try {
    const liveClass = await storage.getLiveClass(req.params.id);
    if (!liveClass) return res.status(404).json({ message: "Live class not found" });
    return res.json(liveClass);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get live class" });
  }
});

// Create live class (Admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, description, instructorId, instructorName, startTime, endTime, maxParticipants, tags } = req.body;
    const liveClass = await storage.createLiveClass({
      title, description, instructorId, instructorName,
      startTime, endTime,
      maxParticipants: maxParticipants || 50,
      tags: tags || [],
      status: 'scheduled',
      roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
    return res.status(201).json(liveClass);
  } catch (error) {
    return res.status(400).json({ message: "Invalid live class data" });
  }
});

// Update live class (Admin)
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await storage.updateLiveClass(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Live class not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update live class" });
  }
});

// Delete live class (Admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await storage.deleteLiveClass(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Live class not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete live class" });
  }
});

// Join live class
router.post("/:id/join", requireAuth, async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const result = await storage.joinLiveClass(req.params.id, userId, userName);
    if (!result.success) return res.status(400).json({ message: result.message });
    return res.json({ message: "Joined successfully", roomId: result.roomId });
  } catch (error) {
    return res.status(500).json({ message: "Failed to join live class" });
  }
});

// Leave live class
router.post("/:id/leave", requireAuth, async (req, res) => {
  try {
    await storage.leaveLiveClass(req.params.id, req.body.userId);
    return res.json({ message: "Left successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to leave live class" });
  }
});

export default router;
