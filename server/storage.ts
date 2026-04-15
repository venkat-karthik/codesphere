import { 
  users, roadmaps, userProgress, resources, problems, userSolutions, communityPosts,
  type User, type InsertUser, type Roadmap, type UserProgress, type Resource, 
  type Problem, type UserSolution, type CommunityPost, type InsertCommunityPost
} from "@shared/schema";

export interface LiveClass {
  id: number;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended';
  maxParticipants: number;
  currentParticipants: number;
  roomId: string;
  isRecording: boolean;
  tags: string[];
  createdAt: string;
}

export interface InsertLiveClass {
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  tags: string[];
  status: 'scheduled' | 'live' | 'ended';
  roomId: string;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  getUserByVerifyToken(token: string): Promise<User | undefined>;
  getUserByOtp(otp: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  
  // Roadmaps
  getAllRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: any): Promise<Roadmap>;
  
  // User Progress
  getUserProgress(userId: number, roadmapId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, roadmapId: number, progress: Partial<UserProgress>): Promise<UserProgress>;
  
  // Resources
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: any): Promise<Resource>;
  updateResource(id: number, updates: any): Promise<Resource | undefined>;
  
  // Problems
  getAllProblems(): Promise<Problem[]>;
  getDailyProblem(date: Date): Promise<Problem | undefined>;
  getProblemsByDifficulty(difficulty: string): Promise<Problem[]>;
  createProblem(problem: any): Promise<Problem>;
  
  // User Solutions
  getUserSolutions(userId: number): Promise<UserSolution[]>;
  submitSolution(userId: number, problemId: number, solution: string, isCorrect: boolean, xpEarned: number): Promise<UserSolution>;
  
  // Community
  getAllPosts(): Promise<CommunityPost[]>;
  getPostsByCategory(category: string): Promise<CommunityPost[]>;
  createPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getAllChannels(): Promise<any[]>;
  createChannel(channel: any): Promise<any>;
  
  // Live Classes
  getAllLiveClasses(): Promise<LiveClass[]>;
  getLiveClass(id: number): Promise<LiveClass | undefined>;
  getLiveClassesByStatus(status: string): Promise<LiveClass[]>;
  getLiveClassesByInstructor(instructorId: string): Promise<LiveClass[]>;
  createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass>;
  updateLiveClass(id: number, updates: Partial<LiveClass>): Promise<LiveClass | undefined>;
  deleteLiveClass(id: number): Promise<boolean>;
  joinLiveClass(classId: number, userId: number, userName: string): Promise<{ success: boolean; message?: string; roomId?: string }>;
  leaveLiveClass(classId: number, userId: number): Promise<void>;

  // Projects
  getUserProjects(userId: number): Promise<any[]>;
  createProject(project: any): Promise<any>;
  updateProject(id: number, userId: number, updates: any): Promise<any | undefined>;
  deleteProject(id: number, userId: number): Promise<boolean>;

  // Payments
  createPayment(payment: any): Promise<any>;
  updatePaymentByOrderId(orderId: string, updates: any): Promise<void>;
  getUserPayments(userId: number): Promise<any[]>;

  // Analytics
  recordAnalytics(userId: number, data: { problemsAttempted?: number; problemsSolved?: number; xpEarned?: number; studyTimeMinutes?: number; videosWatched?: number; resourcesAccessed?: number }): Promise<void>;
  getAnalytics(userId: number): Promise<any[]>;

  // Channel Messages
  getChannelMessages(channelId: number, limit?: number): Promise<any[]>;
  createChannelMessage(msg: { channelId: number; userId: number; content: string; messageType?: string }): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roadmaps: Map<number, Roadmap>;
  private userProgress: Map<string, UserProgress>;
  private resources: Map<number, Resource>;
  private problems: Map<number, Problem>;
  private userSolutions: Map<number, UserSolution>;
  private communityPosts: Map<number, CommunityPost>;
  private liveClasses: Map<number, LiveClass>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.roadmaps = new Map();
    this.userProgress = new Map();
    this.resources = new Map();
    this.problems = new Map();
    this.userSolutions = new Map();
    this.communityPosts = new Map();
    this.liveClasses = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Roadmaps...
    const frontendRoadmap: Roadmap = {
      id: this.currentId++,
      title: "Frontend Developer",
      description: "Master modern frontend technologies including React, Vue, and advanced CSS",
      category: "Frontend",
      difficulty: "Beginner to Advanced",
      estimatedTime: "3-4 months",
      modules: []
    };
    this.roadmaps.set(frontendRoadmap.id, frontendRoadmap);

    // Sample Live Classes
    const sampleClass: LiveClass = {
      id: this.currentId++,
      title: "Introduction to React",
      description: "Learn the basics of React",
      instructorId: "1",
      instructorName: "John Doe",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      status: 'scheduled',
      maxParticipants: 50,
      currentParticipants: 0,
      roomId: "room1",
      isRecording: false,
      tags: ["React"],
      createdAt: new Date().toISOString()
    };
    this.liveClasses.set(sampleClass.id, sampleClass);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "student",
      level: 1,
      xp: 0,
      streak: 0,
      theme: "dark",
      profileImage: null,
      bio: null,
      subscriptionType: "free",
      subscriptionExpiry: null,
      studyPattern: null,
      totalStudyTime: 0,
      codeCoins: 0,
      joinDate: new Date(),
      preferences: null,
      emailVerified: false,
      emailVerifyToken: null,
      otp: null,
      otpExpiry: null,
      passwordResetToken: null,
      passwordResetExpiry: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async getUserByResetToken(_token: string): Promise<User | undefined> { return undefined; }
  async getUserByVerifyToken(_token: string): Promise<User | undefined> { return undefined; }
  async getUserByOtp(_otp: string): Promise<User | undefined> { return undefined; }

  async getUserProjects(userId: number): Promise<any[]> { return []; }
  async createProject(p: any): Promise<any> { return { ...p, id: Date.now() }; }
  async updateProject(id: number, userId: number, u: any): Promise<any> { return null; }
  async deleteProject(id: number, userId: number): Promise<boolean> { return false; }

  async createPayment(p: any): Promise<any> { return { ...p, id: Date.now() }; }
  async updatePaymentByOrderId(o: string, u: any): Promise<void> {}
  async getUserPayments(userId: number): Promise<any[]> { return []; }
  async recordAnalytics(u: number, d: any): Promise<void> {}
  async getAnalytics(u: number): Promise<any[]> { return []; }

  async getAllRoadmaps(): Promise<Roadmap[]> { return Array.from(this.roadmaps.values()); }
  async getRoadmap(id: number): Promise<Roadmap | undefined> { return this.roadmaps.get(id); }
  async createRoadmap(r: any): Promise<Roadmap> { const id = this.currentId++; const road = { ...r, id }; this.roadmaps.set(id, road); return road; }

  async getUserProgress(userId: number, roadmapId: number): Promise<UserProgress | undefined> { return undefined; }
  async updateUserProgress(userId: number, roadmapId: number, progress: any): Promise<UserProgress> { return {} as any; }

  async getAllResources(): Promise<Resource[]> { return []; }
  async getResourcesByCategory(c: string): Promise<Resource[]> { return []; }
  async getResource(id: number): Promise<Resource | undefined> { return undefined; }
  async createResource(r: any): Promise<Resource> { return {} as any; }
  async updateResource(id: number, updates: any): Promise<Resource | undefined> { return undefined; }

  async getAllProblems(): Promise<Problem[]> { return []; }
  async getDailyProblem(date: Date): Promise<Problem | undefined> { return undefined; }
  async getProblemsByDifficulty(d: string): Promise<Problem[]> { return []; }
  async createProblem(p: any): Promise<Problem> { return {} as any; }
  async getUserSolutions(userId: number): Promise<UserSolution[]> { return []; }
  async submitSolution(u: number, p: number, s: string, c: boolean, x: number): Promise<UserSolution> { return {} as any; }

  async getAllPosts(): Promise<CommunityPost[]> { return []; }
  async getPostsByCategory(c: string): Promise<CommunityPost[]> { return []; }
  async createPost(p: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentId++;
    const post: CommunityPost = { 
      ...p, id, likes: 0, replies: 0, isResolved: false, createdAt: new Date(),
      tags: p.tags || []
    };
    return post;
  }
  async getAllChannels(): Promise<any[]> { return []; }
  async createChannel(c: any): Promise<any> { return {}; }
  async getChannelMessages(c: number, l?: number): Promise<any[]> { return []; }
  async createChannelMessage(m: any): Promise<any> { return {}; }

  async getAllLiveClasses(): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values());
  }

  async getLiveClass(id: number): Promise<LiveClass | undefined> {
    return this.liveClasses.get(id);
  }

  async getLiveClassesByStatus(status: string): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values()).filter(c => c.status === status);
  }

  async getLiveClassesByInstructor(id: string): Promise<LiveClass[]> {
    return Array.from(this.liveClasses.values()).filter(c => c.instructorId === id);
  }

  async createLiveClass(lc: InsertLiveClass): Promise<LiveClass> {
    const id = this.currentId++;
    const live: LiveClass = { ...lc, id, currentParticipants: 0, isRecording: false, createdAt: new Date().toISOString() };
    this.liveClasses.set(id, live);
    return live;
  }

  async updateLiveClass(id: number, updates: Partial<LiveClass>): Promise<LiveClass | undefined> {
    const live = this.liveClasses.get(id);
    if (!live) return undefined;
    const updated = { ...live, ...updates };
    this.liveClasses.set(id, updated);
    return updated;
  }

  async deleteLiveClass(id: number): Promise<boolean> {
    return this.liveClasses.delete(id);
  }

  async joinLiveClass(id: number, userId: number, userName: string): Promise<{ success: boolean; roomId?: string }> {
    const live = this.liveClasses.get(id);
    if (!live) return { success: false };
    live.currentParticipants++;
    return { success: true, roomId: live.roomId };
  }

  async leaveLiveClass(id: number, userId: number): Promise<void> {
    const live = this.liveClasses.get(id);
    if (live && live.currentParticipants > 0) live.currentParticipants--;
  }
}

import { db } from "./db";
import { DbStorage } from "./dbStorage";

export const storage: IStorage = db ? new DbStorage() : new MemStorage();
