import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, roadmaps, userProgress, resources, problems,
  userSolutions, communityPosts, communityChannels, channelMessages, projects, payments, studentAnalytics,
  liveClasses,
  type User, type InsertUser, type Roadmap, type UserProgress,
  type Resource, type Problem, type UserSolution,
  type CommunityPost, type InsertCommunityPost,
  type LiveClass as LiveClassSchema, type InsertLiveClass,
} from "@shared/schema";
import type { IStorage, LiveClass } from "./storage";

export class DbStorage implements IStorage {

  // ─── Users ──────────────────────────────────────────────────────────────

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db!.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db!.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db!.select().from(users).orderBy(desc(users.xp));
  }

  async deleteUser(id: number): Promise<void> {
    await db!.delete(users).where(eq(users.id, id));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users)
      .where(eq(users.passwordResetToken, token));
    return user;
  }

  async getUserByVerifyToken(token: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users)
      .where(eq(users.emailVerifyToken, token));
    return user;
  }

  async getUserByOtp(otp: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users)
      .where(eq(users.otp, otp));
    return user;
  }

  async getUserProjects(userId: number): Promise<any[]> {
    return db!.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async createProject(project: any): Promise<any> {
    const [created] = await db!.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, userId: number, updates: any): Promise<any | undefined> {
    const [updated] = await db!.update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return updated;
  }

  async deleteProject(id: number, userId: number): Promise<boolean> {
    const result = await db!.delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // ─── Payments ───────────────────────────────────────────────────────────

  async createPayment(payment: any): Promise<any> {
    const [created] = await db!.insert(payments).values(payment).returning();
    return created;
  }

  async updatePaymentByOrderId(orderId: string, updates: any): Promise<void> {
    await db!.update(payments).set(updates).where(eq(payments.orderId, orderId));
  }

  async getUserPayments(userId: number): Promise<any[]> {
    return db!.select().from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  // ─── Analytics ──────────────────────────────────────────────────────────

  async recordAnalytics(userId: number, data: {
    problemsAttempted?: number; problemsSolved?: number; xpEarned?: number;
    studyTimeMinutes?: number; videosWatched?: number; resourcesAccessed?: number;
  }): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await db!.select().from(studentAnalytics)
      .where(and(eq(studentAnalytics.studentId, userId)));

    const todayRecord = existing.find(r => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (todayRecord) {
      await db!.update(studentAnalytics).set({
        problemsAttempted: todayRecord.problemsAttempted + (data.problemsAttempted || 0),
        problemsSolved: todayRecord.problemsSolved + (data.problemsSolved || 0),
        xpEarned: todayRecord.xpEarned + (data.xpEarned || 0),
        studyTimeMinutes: todayRecord.studyTimeMinutes + (data.studyTimeMinutes || 0),
        videosWatched: todayRecord.videosWatched + (data.videosWatched || 0),
        resourcesAccessed: todayRecord.resourcesAccessed + (data.resourcesAccessed || 0),
      }).where(eq(studentAnalytics.id, todayRecord.id));
    } else {
      await db!.insert(studentAnalytics).values({
        studentId: userId,
        date: today,
        problemsAttempted: data.problemsAttempted || 0,
        problemsSolved: data.problemsSolved || 0,
        xpEarned: data.xpEarned || 0,
        studyTimeMinutes: data.studyTimeMinutes || 0,
        videosWatched: data.videosWatched || 0,
        resourcesAccessed: data.resourcesAccessed || 0,
      });
    }
  }

  async getAnalytics(userId: number): Promise<any[]> {
    return db!.select().from(studentAnalytics)
      .where(eq(studentAnalytics.studentId, userId))
      .orderBy(desc(studentAnalytics.date));
  }

  // ─── Channels ────────────────────────────────────────────────────────────

  async getAllChannels(): Promise<any[]> {
    return db!.select().from(communityChannels).orderBy(communityChannels.name);
  }

  async createChannel(channel: any): Promise<any> {
    const [created] = await db!.insert(communityChannels).values(channel).returning();
    return created;
  }

  async getChannelMessages(channelId: number, limit = 50): Promise<any[]> {
    const msgs = await db!.select({
      id: channelMessages.id,
      channelId: channelMessages.channelId,
      userId: channelMessages.userId,
      content: channelMessages.content,
      messageType: channelMessages.messageType,
      createdAt: channelMessages.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      profileImage: users.profileImage,
    })
    .from(channelMessages)
    .leftJoin(users, eq(channelMessages.userId, users.id))
    .where(eq(channelMessages.channelId, channelId))
    .orderBy(desc(channelMessages.createdAt))
    .limit(limit);
    return msgs.reverse().map(m => ({
      ...m,
      userName: m.firstName ? `${m.firstName} ${m.lastName}` : `User #${m.userId}`,
    }));
  }

  async createChannelMessage(msg: { channelId: number; userId: number; content: string; messageType?: string }): Promise<any> {
    const [created] = await db!.insert(channelMessages).values({
      channelId: msg.channelId,
      userId: msg.userId,
      content: msg.content,
      messageType: msg.messageType || 'text',
      attachments: [],
    }).returning();
    return created;
  }

  // ─── Roadmaps ───────────────────────────────────────────────────────────

  async getAllRoadmaps(): Promise<Roadmap[]> {
    return db!.select().from(roadmaps);
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const [roadmap] = await db!.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap;
  }

  async createRoadmap(roadmap: any): Promise<Roadmap> {
    const [created] = await db!.insert(roadmaps).values(roadmap).returning();
    return created;
  }

  // ─── User Progress ──────────────────────────────────────────────────────

  async getUserProgress(userId: number, roadmapId: number): Promise<UserProgress | undefined> {
    const [progress] = await db!.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.roadmapId, roadmapId)));
    return progress;
  }

  async updateUserProgress(userId: number, roadmapId: number, progress: Partial<UserProgress>): Promise<UserProgress> {
    const existing = await this.getUserProgress(userId, roadmapId);
    if (existing) {
      const [updated] = await db!.update(userProgress)
        .set({ ...progress, lastAccessed: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.roadmapId, roadmapId)))
        .returning();
      return updated;
    }
    const [created] = await db!.insert(userProgress).values({
      userId,
      roadmapId,
      completedModules: [],
      progressPercentage: 0,
      ...progress,
    }).returning();
    return created;
  }

  // ─── Resources ──────────────────────────────────────────────────────────

  async getAllResources(): Promise<Resource[]> {
    return db!.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return db!.select().from(resources).where(eq(resources.category, category));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db!.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: any): Promise<Resource> {
    const [created] = await db!.insert(resources).values(resource).returning();
    return created;
  }

  async updateResource(id: number, updates: any): Promise<Resource | undefined> {
    const [updated] = await db!.update(resources).set(updates).where(eq(resources.id, id)).returning();
    return updated;
  }

  // ─── Problems ───────────────────────────────────────────────────────────

  async getAllProblems(): Promise<Problem[]> {
    return db!.select().from(problems);
  }

  async getDailyProblem(date: Date): Promise<Problem | undefined> {
    const [problem] = await db!.select().from(problems).where(eq(problems.isDaily, true)).limit(1);
    return problem;
  }

  async getProblemsByDifficulty(difficulty: string): Promise<Problem[]> {
    return db!.select().from(problems).where(eq(problems.difficulty, difficulty));
  }

  async createProblem(problem: any): Promise<Problem> {
    const [created] = await db!.insert(problems).values(problem).returning();
    return created;
  }

  // ─── Solutions ──────────────────────────────────────────────────────────

  async getUserSolutions(userId: number): Promise<UserSolution[]> {
    return db!.select().from(userSolutions).where(eq(userSolutions.userId, userId));
  }

  async submitSolution(userId: number, problemId: number, solution: string, isCorrect: boolean, xpEarned: number): Promise<UserSolution> {
    const [sol] = await db!.insert(userSolutions).values({
      userId, problemId, solution, isCorrect, xpEarned,
    }).returning();
    return sol;
  }

  // ─── Community ──────────────────────────────────────────────────────────

  async getAllPosts(): Promise<CommunityPost[]> {
    return db!.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
  }

  async getPostsByCategory(category: string): Promise<CommunityPost[]> {
    return db!.select().from(communityPosts)
      .where(eq(communityPosts.category, category))
      .orderBy(desc(communityPosts.createdAt));
  }

  async createPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [created] = await db!.insert(communityPosts).values(post).returning();
    return created;
  }

  // ─── Live Classes ───────────────────────────────────────────────────────

  async getAllLiveClasses(): Promise<LiveClass[]> {
    const rows = await db!.select().from(liveClasses);
    return rows.map(r => ({ ...r, tags: r.tags as string[], startTime: r.startTime.toISOString(), endTime: r.endTime.toISOString(), createdAt: r.createdAt.toISOString() }));
  }

  async getLiveClass(id: number): Promise<LiveClass | undefined> {
    const [row] = await db!.select().from(liveClasses).where(eq(liveClasses.id, id));
    if (!row) return undefined;
    return { ...row, tags: row.tags as string[], startTime: row.startTime.toISOString(), endTime: row.endTime.toISOString(), createdAt: row.createdAt.toISOString() };
  }

  async getLiveClassesByStatus(status: string): Promise<LiveClass[]> {
    const rows = await db!.select().from(liveClasses).where(eq(liveClasses.status, status));
    return rows.map(r => ({ ...r, tags: r.tags as string[], startTime: r.startTime.toISOString(), endTime: r.endTime.toISOString(), createdAt: r.createdAt.toISOString() }));
  }

  async getLiveClassesByInstructor(instructorId: string): Promise<LiveClass[]> {
    const rows = await db!.select().from(liveClasses).where(eq(liveClasses.instructorId, instructorId));
    return rows.map(r => ({ ...r, tags: r.tags as string[], startTime: r.startTime.toISOString(), endTime: r.endTime.toISOString(), createdAt: r.createdAt.toISOString() }));
  }

  async createLiveClass(insert: InsertLiveClass): Promise<LiveClass> {
    const [row] = await db!.insert(liveClasses).values({
      ...insert,
      startTime: new Date(insert.startTime),
      endTime: new Date(insert.endTime),
    }).returning();
    return { ...row, tags: row.tags as string[], startTime: row.startTime.toISOString(), endTime: row.endTime.toISOString(), createdAt: row.createdAt.toISOString() };
  }

  async updateLiveClass(id: number, updates: Partial<LiveClass>): Promise<LiveClass | undefined> {
    const [row] = await db!.update(liveClasses)
      .set({
        ...updates as any,
        startTime: updates.startTime ? new Date(updates.startTime) : undefined,
        endTime: updates.endTime ? new Date(updates.endTime) : undefined,
      })
      .where(eq(liveClasses.id, id))
      .returning();
    if (!row) return undefined;
    return { ...row, tags: row.tags as string[], startTime: row.startTime.toISOString(), endTime: row.endTime.toISOString(), createdAt: row.createdAt.toISOString() };
  }

  async deleteLiveClass(id: number): Promise<boolean> {
    const [row] = await db!.delete(liveClasses).where(eq(liveClasses.id, id)).returning();
    return !!row;
  }

  async joinLiveClass(classId: number, userId: number, userName: string): Promise<{ success: boolean; roomId?: string }> {
    const [cls] = await db!.select().from(liveClasses).where(eq(liveClasses.id, classId));
    if (!cls || cls.currentParticipants >= cls.maxParticipants) return { success: false };
    await db!.update(liveClasses).set({ currentParticipants: cls.currentParticipants + 1 }).where(eq(liveClasses.id, classId));
    return { success: true, roomId: cls.roomId };
  }

  async leaveLiveClass(classId: number, userId: number): Promise<void> {
    const [cls] = await db!.select().from(liveClasses).where(eq(liveClasses.id, classId));
    if (cls && cls.currentParticipants > 0) {
      await db!.update(liveClasses).set({ currentParticipants: cls.currentParticipants - 1 }).where(eq(liveClasses.id, classId));
    }
  }
}
