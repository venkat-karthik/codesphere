import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";
import { cache } from "../lib/redis";

const router = Router();

// Get specific user
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get user" });
  }
});

// Update user profile
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    // Users can only update themselves; admins can update anyone
    if (req.session.userId !== userId && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedUser = await storage.updateUser(userId, req.body);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
    // Invalidate analytics and leaderboard cache
    await cache.del(`analytics:user:${userId}`);
    await cache.del("leaderboard:top20");

    const { password: _, ...safeUser } = updatedUser;
    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
});

// Study time tracking
router.post("/:id/study-time", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.session.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (userId <= 0) return res.json({ ok: true }); // demo accounts

    const { minutes } = req.body;
    if (!minutes || minutes <= 0) return res.json({ ok: true });

    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update total study time on user
    await storage.updateUser(userId, {
      totalStudyTime: user.totalStudyTime + minutes,
    });

    // Record in analytics
    await storage.recordAnalytics(userId, { studyTimeMinutes: minutes });

    // Invalidate user analytics cache
    await cache.del(`analytics:user:${userId}`);

    return res.json({ ok: true, totalStudyTime: user.totalStudyTime + minutes });
  } catch (error) {
    return res.status(500).json({ message: "Failed to record study time" });
  }
});

// Avatar upload
router.post("/:id/avatar", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.session.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (userId <= 0) return res.status(400).json({ message: "Demo accounts cannot upload avatars" });

    const { imageData, mimeType } = req.body;
    if (!imageData || !mimeType) return res.status(400).json({ message: "imageData and mimeType required" });

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(mimeType)) return res.status(400).json({ message: "Only JPEG, PNG, WebP, GIF allowed" });

    if (imageData.length > 2.8 * 1024 * 1024) return res.status(400).json({ message: "Image too large. Max 2MB." });

    const dataUrl = `data:${mimeType};base64,${imageData}`;
    await storage.updateUser(userId, { profileImage: dataUrl });

    return res.json({ profileImage: dataUrl });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload avatar" });
  }
});

// ─── SOLUTIONS ───────────────────────────────────────────────────────────

router.get("/:userId/solutions", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (req.session.userId !== userId && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const solutions = await storage.getUserSolutions(userId);
    return res.json(solutions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get solutions" });
  }
});

router.post("/:userId/solutions", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (req.session.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    const { problemId, solution, isCorrect, xpEarned } = req.body;
    const userSolution = await storage.submitSolution(userId, problemId, solution, isCorrect, xpEarned);

    if (isCorrect && xpEarned > 0) {
      const user = await storage.getUser(userId);
      if (user) {
        const newXp = user.xp + xpEarned;
        const newLevel = Math.floor(newXp / 1000) + 1;
        const coinsEarned = 10;
        const currentCoins = (user as any).codeCoins || 0;
        await storage.updateUser(userId, {
          xp: newXp,
          level: newLevel,
          codeCoins: currentCoins + coinsEarned,
        } as any);

        // Invalidate leaderboard cache since XP changed
        await cache.del("leaderboard:top20");
      }
    }

    // Track analytics
    await storage.recordAnalytics(userId, {
      problemsAttempted: 1,
      problemsSolved: isCorrect ? 1 : 0,
      xpEarned: isCorrect ? xpEarned : 0,
    });

    // Invalidate user analytics cache
    await cache.del(`analytics:user:${userId}`);

    // Broadcast leaderboard update to all clients
    if (isCorrect) {
      const vs = (req.app as any).videoServer;
      if (vs) vs.broadcastLeaderboardUpdate();
    }

    return res.status(201).json(userSolution);
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit solution" });
  }
});

// Update theme (called by ThemeContext on every theme change)
router.patch("/theme", requireAuth, async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) return res.status(400).json({ message: "Theme is required" });
    await storage.updateUser(req.session.userId!, { theme } as any);
    return res.json({ message: "Theme updated" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update theme" });
  }
});

export default router;
