import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// Per-user rate limit: 20 messages per hour for free users
const mentorRateLimit = new Map<number, { count: number; resetAt: number }>();

// AI Mentor chat
router.post("/chat", requireAuth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    const isFreeUser = !user || (user.subscriptionType === 'free' && userId > 0);

    // Rate-limit free users: 20 messages/hour
    if (isFreeUser) {
      const now = Date.now();
      const entry = mentorRateLimit.get(userId) || { count: 0, resetAt: now + 60 * 60 * 1000 };
      if (now > entry.resetAt) { 
        entry.count = 0; 
        entry.resetAt = now + 60 * 60 * 1000; 
      }
      if (entry.count >= 20) {
        return res.status(429).json({ message: "You've used your 20 free AI messages this hour. Upgrade to Pro for unlimited access." });
      }
      entry.count++;
      mentorRateLimit.set(userId, entry);
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(503).json({ message: "AI Mentor is not configured. Add OPENAI_API_KEY to your .env file." });
    }

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: process.env.XAI_BASE_URL || 'https://api.x.ai/v1',
    });

    const systemPrompt = `You are CodeSphere's AI coding mentor. You help students learn programming.
Be concise, practical, and encouraging. Use code examples when helpful.
Focus on: JavaScript, TypeScript, React, Node.js, Python, CSS, algorithms, and data structures.
Keep responses under 300 words unless a detailed explanation is truly needed.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10), // last 10 messages for context
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'grok-3-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("AI Mentor error:", error);
    return res.status(500).json({ message: "AI Mentor failed. Please try again." });
  }
});

export default router;
