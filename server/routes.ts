import type { Express } from "express";
import { createServer, type Server } from "http";
import { sanitizeBody } from "./middleware";

// Import sub-routers
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import roadmapRouter from "./routes/roadmaps";
import contentRouter from "./routes/content";
import communityRouter from "./routes/community";
import paymentsRouter from "./routes/payments";
import executeRouter from "./routes/execute";
import storeRouter from "./routes/store";
import mentorRouter from "./routes/mentor";
import liveClassRouter from "./routes/liveClasses";
import analyticsRouter from "./routes/analytics";
import adminRouter from "./routes/admin";
import projectsRouter from "./routes/projects";
import sphereEventsRouter from "./routes/sphereEvents";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply global sanitization to all API routes
  app.use('/api', sanitizeBody);

  // Mount Feature-Specific Routers
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/roadmaps", roadmapRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/community", communityRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/execute", executeRouter);
  app.use("/api/store", storeRouter);
  app.use("/api/mentor", mentorRouter);
  app.use("/api/live-classes", liveClassRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/sphere-events", sphereEventsRouter);

  const httpServer = createServer(app);
  return httpServer;
}
