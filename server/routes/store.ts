import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// Get store items
router.get("/items", async (_req, res) => {
  return res.json([
    { id: 'css-cheatsheet', title: 'Advanced CSS Cheatsheet', description: 'Quick reference for modern CSS properties and techniques.', price: 30, type: 'pdf' },
    { id: 'react-template', title: 'React Project Template', description: 'Production-ready React starter with TypeScript and Tailwind.', price: 100, type: 'template' },
    { id: 'nodejs-notes', title: 'Node.js API Notes', description: 'In-depth notes on building scalable REST APIs.', price: 50, type: 'notes' },
    { id: 'algo-guide', title: 'Algorithm Interview Guide', description: 'Comprehensive guide to common coding interview patterns.', price: 150, type: 'pdf' },
    { id: 'system-design', title: 'System Design Primer', description: 'Learn how to design large-scale distributed systems.', price: 200, type: 'pdf' },
    { id: 'ds-cheatsheet', title: 'Data Structures Cheatsheet', description: 'Visual reference for all major data structures.', price: 40, type: 'pdf' },
  ]);
});

// Purchase item
router.post("/purchase/:itemId", requireAuth, async (req, res) => {
  try {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.email === 'admin@codesphere.com' || user.email === 'student@codesphere.com') {
      return res.status(400).json({ message: "Demo accounts cannot make purchases" });
    }

    const PRICES: Record<string, number> = {
      'css-cheatsheet': 30, 'react-template': 100, 'nodejs-notes': 50,
      'algo-guide': 150, 'system-design': 200, 'ds-cheatsheet': 40,
    };
    const price = PRICES[req.params.itemId];
    if (!price) return res.status(404).json({ message: "Item not found" });

    const currentCoins = (user as any).codeCoins || 0;
    if (currentCoins < price) {
      return res.status(400).json({ message: "Insufficient CodeCoins" });
    }

    await storage.updateUser(user.id, { codeCoins: currentCoins - price } as any);
    return res.json({ message: "Purchase successful", remainingCoins: currentCoins - price });
  } catch (error) {
    return res.status(500).json({ message: "Purchase failed" });
  }
});

export default router;
