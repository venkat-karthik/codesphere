import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";
import { cache } from "../lib/redis";

const router = Router();

// Get leaderboard
router.get("/", async (_req, res) => {
  const CACHE_KEY = "leaderboard:top20";
  try {
    const cachedData = await cache.get(CACHE_KEY);
    if (cachedData) return res.json(cachedData);

    const allUsers = await storage.getAllUsers();
    const leaderboard = allUsers
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 20)
      .map((u, idx) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        level: u.level,
        xp: u.xp,
        streak: u.streak,
        rank: idx + 1,
      }));

    await cache.set(CACHE_KEY, leaderboard, 60); // Cache for 60 seconds
    return res.json(leaderboard);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get leaderboard" });
  }
});

// Get user analytics
router.get("/users/:userId", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const CACHE_KEY = `analytics:user:${userId}`;

  try {
    if (req.session.userId !== userId && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (userId <= 0) return res.json([]); 

    const cachedData = await cache.get(CACHE_KEY);
    if (cachedData) return res.json(cachedData);

    const data = await storage.getAnalytics(userId);
    await cache.set(CACHE_KEY, data, 300); // Cache for 5 minutes

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get analytics" });
  }
});

export default router;
