import { pgTable, text, serial, integer, boolean, timestamp, json, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // 'admin', 'sub_admin', or 'student'
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  theme: text("theme").notNull().default("dark"), // 'dark' or 'light'
  profileImage: text("profile_image"),
  bio: text("bio"),
  subscriptionType: text("subscription_type").notNull().default("free"), // 'free', 'premium', 'pro'
  subscriptionExpiry: timestamp("subscription_expiry"),
  studyPattern: json("study_pattern"), // Track daily study patterns
  totalStudyTime: integer("total_study_time").notNull().default(0), // in minutes
  codeCoins: integer("code_coins").notNull().default(0),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  preferences: json("preferences"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerifyToken: text("email_verify_token"),
  otp: text("otp"),
  otpExpiry: timestamp("otp_expiry"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  modules: json("modules").notNull(),
  estimatedTime: text("estimated_time"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roadmapId: integer("roadmap_id").notNull(),
  completedModules: json("completed_modules").notNull().default([]),
  currentModule: text("current_module"),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // 'pdf', 'video', 'article'
  url: text("url"),
  difficulty: text("difficulty").notNull(),
  tags: json("tags").notNull().default([]),
  downloadCount: integer("download_count").notNull().default(0),
  fileSize: text("file_size"),
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  tags: json("tags").notNull().default([]),
  solution: text("solution"),
  hints: json("hints").notNull().default([]),
  xpReward: integer("xp_reward").notNull().default(100),
  isDaily: boolean("is_daily").notNull().default(false),
  date: timestamp("date"),
});

export const userSolutions = pgTable("user_solutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  problemId: integer("problem_id").notNull(),
  solution: text("solution").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  xpEarned: integer("xp_earned").notNull().default(0),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: json("tags").notNull().default([]),
  likes: integer("likes").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const communityChannels = pgTable("community_channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("text"), // 'text', 'voice', 'general'
  creatorId: integer("creator_id").notNull(),
  isPrivate: boolean("is_private").notNull().default(false),
  memberCount: integer("member_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const channelMessages = pgTable("channel_messages", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // 'text', 'file', 'image'
  attachments: json("attachments").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  subscriptionType: text("subscription_type").notNull(),
  paymentMethod: text("payment_method").notNull().default("razorpay"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  transactionId: text("transaction_id"),   // razorpay payment_id
  orderId: text("order_id"),               // razorpay order_id
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'custom', 'template', 'ai-generated'
  language: text("language").notNull(),
  framework: text("framework"),
  sourceCode: json("source_code"), // Store HTML, CSS, JS
  isPublic: boolean("is_public").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const studentAnalytics = pgTable("student_analytics", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  studyTimeMinutes: integer("study_time_minutes").notNull().default(0),
  problemsAttempted: integer("problems_attempted").notNull().default(0),
  problemsSolved: integer("problems_solved").notNull().default(0),
  videosWatched: integer("videos_watched").notNull().default(0),
  resourcesAccessed: integer("resources_accessed").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
});

export const liveClasses = pgTable("live_classes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: text("instructor_id").notNull(),
  instructorName: text("instructor_name").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("scheduled"), // 'scheduled', 'live', 'ended'
  maxParticipants: integer("max_participants").notNull().default(50),
  currentParticipants: integer("current_participants").notNull().default(0),
  roomId: text("room_id").notNull(),
  isRecording: boolean("is_recording").notNull().default(false),
  tags: json("tags").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinDate: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  likes: true,
  replies: true,
});

export const insertLiveClassSchema = createInsertSchema(liveClasses).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type UserSolution = typeof userSolutions.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type LiveClass = typeof liveClasses.$inferSelect;
export type InsertLiveClass = z.infer<typeof insertLiveClassSchema>;
