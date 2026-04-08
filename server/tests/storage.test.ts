import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../storage';

// ── Unit tests for MemStorage (no DB required) ────────────────────────────

describe('MemStorage - Users', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('creates a user and retrieves by email', async () => {
    const user = await storage.createUser({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'student',
      level: 1,
      xp: 0,
      streak: 0,
      theme: 'dark',
      subscriptionType: 'free',
      totalStudyTime: 0,
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('Test');

    const found = await storage.getUserByEmail('test@example.com');
    expect(found).toBeDefined();
    expect(found?.id).toBe(user.id);
  });

  it('returns undefined for non-existent email', async () => {
    const found = await storage.getUserByEmail('nobody@example.com');
    expect(found).toBeUndefined();
  });

  it('updates a user', async () => {
    const user = await storage.createUser({
      firstName: 'Test', lastName: 'User', email: 'update@example.com',
      password: 'hash', role: 'student', level: 1, xp: 0, streak: 0,
      theme: 'dark', subscriptionType: 'free', totalStudyTime: 0,
    });

    const updated = await storage.updateUser(user.id, { xp: 500, level: 2 });
    expect(updated?.xp).toBe(500);
    expect(updated?.level).toBe(2);
  });

  it('getAllUsers returns all created users', async () => {
    await storage.createUser({ firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'h', role: 'student', level: 1, xp: 0, streak: 0, theme: 'dark', subscriptionType: 'free', totalStudyTime: 0 });
    await storage.createUser({ firstName: 'C', lastName: 'D', email: 'c@d.com', password: 'h', role: 'student', level: 1, xp: 0, streak: 0, theme: 'dark', subscriptionType: 'free', totalStudyTime: 0 });
    const all = await storage.getAllUsers();
    expect(all.length).toBe(2);
  });
});

describe('MemStorage - Roadmaps', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('returns seeded roadmap', async () => {
    const roadmaps = await storage.getAllRoadmaps();
    expect(roadmaps.length).toBeGreaterThan(0);
    expect(roadmaps[0].title).toBe('Frontend Developer');
  });

  it('gets roadmap by id', async () => {
    const all = await storage.getAllRoadmaps();
    const first = all[0];
    const found = await storage.getRoadmap(first.id);
    expect(found?.id).toBe(first.id);
  });
});

describe('MemStorage - Problems', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('returns seeded problems', async () => {
    const problems = await storage.getAllProblems();
    expect(problems.length).toBeGreaterThan(0);
  });

  it('submits a solution and retrieves it', async () => {
    const user = await storage.createUser({ firstName: 'T', lastName: 'U', email: 't@u.com', password: 'h', role: 'student', level: 1, xp: 0, streak: 0, theme: 'dark', subscriptionType: 'free', totalStudyTime: 0 });
    const problems = await storage.getAllProblems();
    const sol = await storage.submitSolution(user.id, problems[0].id, 'my code', true, 100);
    expect(sol.isCorrect).toBe(true);
    expect(sol.xpEarned).toBe(100);

    const solutions = await storage.getUserSolutions(user.id);
    expect(solutions.length).toBe(1);
  });
});

describe('MemStorage - Community Posts', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('creates and retrieves a post', async () => {
    const post = await storage.createPost({
      userId: 1,
      title: 'Test Post',
      content: 'Hello world',
      category: 'general',
      tags: [],
    });
    expect(post.id).toBeDefined();
    expect(post.title).toBe('Test Post');
    expect(post.likes).toBe(0);

    const all = await storage.getAllPosts();
    expect(all.length).toBe(1);
  });

  it('filters posts by category', async () => {
    await storage.createPost({ userId: 1, title: 'JS Post', content: 'js', category: 'javascript', tags: [] });
    await storage.createPost({ userId: 1, title: 'React Post', content: 'react', category: 'react', tags: [] });

    const jsPosts = await storage.getPostsByCategory('javascript');
    expect(jsPosts.length).toBe(1);
    expect(jsPosts[0].title).toBe('JS Post');
  });
});

describe('MemStorage - Live Classes', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('returns seeded live classes', async () => {
    const classes = await storage.getAllLiveClasses();
    expect(classes.length).toBe(2);
  });

  it('creates a live class', async () => {
    const cls = await storage.createLiveClass({
      title: 'New Class',
      description: 'Test',
      instructorId: '1',
      instructorName: 'Instructor',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      maxParticipants: 20,
      tags: [],
      status: 'scheduled',
      roomId: 'room_test',
    });
    expect(cls.id).toBeDefined();
    expect(cls.title).toBe('New Class');
    expect(cls.currentParticipants).toBe(0);
  });

  it('join and leave a class updates participant count', async () => {
    const classes = await storage.getAllLiveClasses();
    const cls = classes[0];
    const initial = cls.currentParticipants;

    await storage.joinLiveClass(cls.id, 'user1', 'User One');
    const after = await storage.getLiveClass(cls.id);
    expect(after?.currentParticipants).toBe(initial + 1);

    await storage.leaveLiveClass(cls.id, 'user1');
    const afterLeave = await storage.getLiveClass(cls.id);
    expect(afterLeave?.currentParticipants).toBe(initial);
  });
});
