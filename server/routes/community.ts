import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";
import { insertCommunityPostSchema } from "@shared/schema";

const router = Router();

// Get all channels
router.get("/channels", async (_req, res) => {
  try {
    const channels = await storage.getAllChannels();
    return res.json(channels);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get channels" });
  }
});

// Create new channel
router.post("/channels", requireAuth, async (req, res) => {
  try {
    const { name, description, type } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Channel name is required" });
    const channel = await storage.createChannel({
      name: name.trim(),
      description: description || null,
      type: type || 'text',
      creatorId: req.session.userId!,
      isPrivate: false,
      memberCount: 1,
    });
    return res.status(201).json(channel);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create channel" });
  }
});

// Get message history for a channel
router.get("/channels/:channelId/messages", async (req, res) => {
  try {
    const channelId = parseInt(req.params.channelId);
    const limit = parseInt(req.query.limit as string) || 50;
    const messages = await storage.getChannelMessages(channelId, limit);
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get messages" });
  }
});

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const { category } = req.query;
    const posts = category
      ? await storage.getPostsByCategory(category as string)
      : await storage.getAllPosts();
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get posts" });
  }
});

// Create new post
router.post("/posts", requireAuth, async (req, res) => {
  try {
    const postData = insertCommunityPostSchema.parse({
      ...req.body,
      userId: req.session.userId,
    });
    const post = await storage.createPost(postData);
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ message: "Invalid post data" });
  }
});

export default router;
