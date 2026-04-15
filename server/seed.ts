import dotenv from 'dotenv';
dotenv.config();

import { db } from './db';
import { roadmaps, resources, problems, users, communityChannels, liveClasses } from '@shared/schema';
import bcrypt from 'bcryptjs';
async function seed() {
  if (!db) {
    console.error('No DATABASE_URL set — cannot seed.');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  // Clear existing seeded data to prevent duplicates on re-run
  await db.delete(resources);
  await db.delete(roadmaps);
  await db.delete(problems);
  await db.delete(communityChannels);
  await db.delete(liveClasses);
  // Keep users — don't wipe real registered accounts, just upsert demo ones

  // ─── Demo Users ───────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123', 12);
  const studentHash = await bcrypt.hash('student123', 12);

  // Upsert admin account — always ensure correct password & role
  await db.insert(users).values({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@codesphere.com',
    password: adminHash,
    role: 'admin',
    level: 10,
    xp: 5000,
    streak: 30,
    theme: 'dark',
    subscriptionType: 'pro',
    totalStudyTime: 0,
  }).onConflictDoUpdate({
    target: users.email,
    set: { password: adminHash, role: 'admin' },
  });

  // Upsert student account — always ensure correct password & role
  await db.insert(users).values({
    firstName: 'Student',
    lastName: 'User',
    email: 'student@codesphere.com',
    password: studentHash,
    role: 'student',
    level: 5,
    xp: 1250,
    streak: 7,
    theme: 'dark',
    subscriptionType: 'free',
    totalStudyTime: 0,
  }).onConflictDoUpdate({
    target: users.email,
    set: { password: studentHash, role: 'student' },
  });

  // ─── Roadmaps ─────────────────────────────────────────────────────────
  await db.insert(roadmaps).values([
    {
      title: 'Frontend Developer',
      description: 'Master modern frontend technologies including React, Vue, and advanced CSS',
      category: 'Web Development',
      difficulty: 'Beginner',
      estimatedTime: '3-4 months',
      modules: [
        { id: 'html', title: 'HTML Fundamentals', completed: false },
        { id: 'css', title: 'CSS Basics', completed: false },
        { id: 'js', title: 'JavaScript Essentials', completed: false },
        { id: 'responsive', title: 'Responsive Design', completed: false },
        { id: 'es6', title: 'ES6+ Features', completed: false },
        { id: 'react', title: 'React Fundamentals', completed: false },
        { id: 'state', title: 'State Management', completed: false },
      ],
    },
    {
      title: 'Backend Developer',
      description: 'Learn server-side development with Node.js, databases, and REST APIs',
      category: 'Web Development',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 months',
      modules: [
        { id: 'node', title: 'Node.js Basics', completed: false },
        { id: 'express', title: 'Express Framework', completed: false },
        { id: 'sql', title: 'SQL & PostgreSQL', completed: false },
        { id: 'rest', title: 'REST API Design', completed: false },
        { id: 'auth', title: 'Authentication & Security', completed: false },
        { id: 'deploy', title: 'Deployment & DevOps', completed: false },
      ],
    },
    {
      title: 'Full Stack Developer',
      description: 'Complete path covering both frontend and backend development',
      category: 'Web Development',
      difficulty: 'Advanced',
      estimatedTime: '6-8 months',
      modules: [
        { id: 'html', title: 'HTML & CSS', completed: false },
        { id: 'js', title: 'JavaScript', completed: false },
        { id: 'react', title: 'React', completed: false },
        { id: 'node', title: 'Node.js & Express', completed: false },
        { id: 'db', title: 'Databases', completed: false },
        { id: 'deploy', title: 'Full Stack Deployment', completed: false },
      ],
    },
    {
      title: 'Data Science',
      description: 'Master Python, machine learning, data analysis, and visualization',
      category: 'Data Science',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 months',
      modules: [
        { id: 'python', title: 'Python Basics', completed: false },
        { id: 'numpy', title: 'NumPy & Pandas', completed: false },
        { id: 'viz', title: 'Data Visualization', completed: false },
        { id: 'ml', title: 'Machine Learning', completed: false },
        { id: 'dl', title: 'Deep Learning Intro', completed: false },
      ],
    },
    {
      title: 'DevOps Engineer',
      description: 'Learn CI/CD, Docker, Kubernetes, and cloud platforms',
      category: 'DevOps',
      difficulty: 'Advanced',
      estimatedTime: '5-6 months',
      modules: [
        { id: 'linux', title: 'Linux Fundamentals', completed: false },
        { id: 'docker', title: 'Docker & Containers', completed: false },
        { id: 'k8s', title: 'Kubernetes', completed: false },
        { id: 'cicd', title: 'CI/CD Pipelines', completed: false },
        { id: 'cloud', title: 'Cloud Platforms (AWS/GCP)', completed: false },
      ],
    },
  ]).onConflictDoNothing();

  // ─── Resources ────────────────────────────────────────────────────────
  await db.insert(resources).values([
    {
      title: 'JavaScript Fundamentals Handbook',
      description: 'A comprehensive guide to JavaScript basics including variables, functions, and objects',
      category: 'javascript',
      type: 'pdf',
      difficulty: 'beginner',
      tags: ['fundamentals', 'basics'],
      downloadCount: 1245,
      fileSize: '2.4 MB',
      pageCount: 42,
      url: null,
    },
    {
      title: 'React Hooks Explained',
      description: 'Deep dive into React hooks with practical examples and best practices',
      category: 'react',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['hooks', 'react'],
      downloadCount: 887,
      fileSize: '1.8 MB',
      pageCount: 36,
      url: null,
    },
    {
      title: 'CSS Grid and Flexbox Mastery',
      description: 'Master modern CSS layout techniques with detailed examples',
      category: 'css',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['layout', 'css'],
      downloadCount: 756,
      fileSize: '3.2 MB',
      pageCount: 28,
      url: null,
    },
    {
      title: 'Building RESTful APIs with Node.js',
      description: 'Learn to create robust APIs using Node.js, Express, and PostgreSQL',
      category: 'nodejs',
      type: 'pdf',
      difficulty: 'advanced',
      tags: ['backend', 'api'],
      downloadCount: 632,
      fileSize: '4.1 MB',
      pageCount: 54,
      url: null,
    },
    {
      title: 'TypeScript for React Developers',
      description: 'Practical guide to using TypeScript with React for type-safe applications',
      category: 'typescript',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['typescript', 'react'],
      downloadCount: 543,
      fileSize: '2.7 MB',
      pageCount: 48,
      url: null,
    },
    {
      title: 'HTML5 Semantic Elements Guide',
      description: 'Comprehensive guide to semantic HTML for better accessibility and SEO',
      category: 'html',
      type: 'pdf',
      difficulty: 'beginner',
      tags: ['html', 'accessibility'],
      downloadCount: 421,
      fileSize: '1.5 MB',
      pageCount: 32,
      url: null,
    },
  ]).onConflictDoNothing();

  // ─── Problems ─────────────────────────────────────────────────────────
  await db.insert(problems).values([
    {
      title: 'Two Sum',
      description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Array', 'Hash Table'],
      xpReward: 100,
      isDaily: true,
      hints: ['Try using a hash map', 'One pass solution is possible'],
      solution: 'Use a hash map to store each number and its index. For each number, check if target - number exists in the map.',
    },
    {
      title: 'Valid Parentheses',
      description: 'Determine if the input string containing just the characters (, ), {, }, [ and ] is valid.',
      difficulty: 'Easy',
      category: 'Strings',
      tags: ['Stack', 'String'],
      xpReward: 100,
      isDaily: false,
      hints: ['Use a stack', 'Push opening brackets, pop on closing'],
      solution: 'Use a stack. Push opening brackets. For closing brackets, check if top of stack matches.',
    },
    {
      title: 'Maximum Subarray',
      description: 'Find the contiguous subarray which has the largest sum and return its sum.',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      tags: ['Dynamic Programming', 'Array'],
      xpReward: 250,
      isDaily: false,
      hints: ["Kadane's algorithm", 'Track current sum and max sum'],
      solution: "Kadane's algorithm: keep a running sum, reset to 0 if negative, track the maximum.",
    },
    {
      title: 'Reverse Linked List',
      description: 'Reverse a singly linked list.',
      difficulty: 'Easy',
      category: 'Linked Lists',
      tags: ['Linked List', 'Recursion'],
      xpReward: 150,
      isDaily: false,
      hints: ['Use three pointers', 'Can also be done recursively'],
      solution: 'Iterative: use prev, curr, next pointers. Recursive: reverse rest of list, fix head.',
    },
    {
      title: 'Binary Tree Level Order Traversal',
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
      difficulty: 'Medium',
      category: 'Trees',
      tags: ['Tree', 'BFS', 'Queue'],
      xpReward: 250,
      isDaily: false,
      hints: ['Use a queue (BFS)', 'Track level size'],
      solution: 'BFS with a queue. At each level, process all nodes in the queue and add their children.',
    },
    {
      title: 'Merge Two Sorted Lists',
      description: 'Merge two sorted linked lists and return it as a sorted list.',
      difficulty: 'Easy',
      category: 'Linked Lists',
      tags: ['Linked List', 'Recursion'],
      xpReward: 100,
      isDaily: false,
      hints: ['Compare heads', 'Recursion works cleanly here'],
      solution: 'Compare the heads of both lists, take the smaller one, and recursively merge the rest.',
    },
    {
      title: 'Climbing Stairs',
      description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      tags: ['Dynamic Programming', 'Math'],
      xpReward: 100,
      isDaily: false,
      hints: ['This is Fibonacci', 'dp[i] = dp[i-1] + dp[i-2]'],
      solution: 'dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[1]=1, dp[2]=2.',
    },
    {
      title: 'LRU Cache',
      description: 'Design a data structure that follows the Least Recently Used cache constraint.',
      difficulty: 'Hard',
      category: 'Design',
      tags: ['Hash Table', 'Linked List', 'Design'],
      xpReward: 400,
      isDaily: false,
      hints: ['Use a HashMap + Doubly Linked List', 'O(1) get and put'],
      solution: 'Combine a HashMap for O(1) lookup with a doubly linked list to track usage order.',
    },
  ]).onConflictDoNothing();

  // ─── Video Resources ──────────────────────────────────────────────────
  await db.insert(resources).values([
    {
      title: 'React Hooks Complete Guide',
      description: 'Master React Hooks with practical examples — useState, useEffect, useContext, and custom hooks.',
      category: 'react',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      downloadCount: 12500,
      fileSize: '45:30',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
    },
    {
      title: 'JavaScript ES6+ Features',
      description: 'Learn modern JavaScript features every developer should know — arrow functions, destructuring, promises, async/await.',
      category: 'javascript',
      type: 'video',
      difficulty: 'beginner',
      tags: ['JavaScript', 'ES6', 'Arrow Functions', 'Destructuring'],
      downloadCount: 8900,
      fileSize: '32:15',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=WZQc7RUAg18',
    },
    {
      title: 'CSS Grid Layout Mastery',
      description: 'Build complex layouts with CSS Grid from basics to advanced techniques.',
      category: 'css',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive'],
      downloadCount: 7200,
      fileSize: '28:45',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
    },
    {
      title: 'Node.js REST API from Scratch',
      description: 'Build a production-ready REST API with Node.js, Express, and PostgreSQL.',
      category: 'nodejs',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['Node.js', 'Express', 'REST API', 'PostgreSQL'],
      downloadCount: 6400,
      fileSize: '52:10',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=l8WPWK9mS5M',
    },
    {
      title: 'TypeScript for Beginners',
      description: 'Get started with TypeScript — types, interfaces, generics, and integrating with React.',
      category: 'typescript',
      type: 'video',
      difficulty: 'beginner',
      tags: ['TypeScript', 'Types', 'Interfaces', 'React'],
      downloadCount: 5800,
      fileSize: '38:20',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python fundamentals for data science — NumPy, Pandas, and Matplotlib.',
      category: 'python',
      type: 'video',
      difficulty: 'beginner',
      tags: ['Python', 'NumPy', 'Pandas', 'Data Science'],
      downloadCount: 9100,
      fileSize: '61:45',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    },
  ]).onConflictDoNothing();

  // ─── Community Channels ───────────────────────────────────────────────
  await db.insert(communityChannels).values([
    { name: 'general',       description: 'General discussions',          type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'help',          description: 'Get help with coding problems', type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'announcements', description: 'Important updates and news',    type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'javascript',    description: 'JavaScript discussions',        type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'python',        description: 'Python programming help',       type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'react',         description: 'React development',             type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'study-group',   description: 'Voice chat for study sessions', type: 'voice', creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'office-hours',  description: 'Live help with instructors',    type: 'voice', creatorId: 1, isPrivate: false, memberCount: 0 },
  ]).onConflictDoNothing();

  // ─── Live Classes ───────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(10, 0, 0, 0);

  await db.insert(liveClasses).values([
    {
      title: 'JavaScript Fundamentals Live Session',
      description: 'Interactive session covering JavaScript basics, ES6 features, and modern development practices.',
      instructorId: '1',
      instructorName: 'Sarah Chen',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      status: 'scheduled',
      maxParticipants: 30,
      currentParticipants: 12,
      roomId: 'room_sample_1',
      isRecording: false,
      tags: ['JavaScript', 'Beginner', 'ES6'],
    },
    {
      title: 'React Hooks Deep Dive',
      description: 'Advanced React concepts including custom hooks, context API, and performance optimization.',
      instructorId: '2',
      instructorName: 'Mike Rodriguez',
      startTime: dayAfter,
      endTime: new Date(dayAfter.getTime() + 1.5 * 60 * 60 * 1000),
      status: 'scheduled',
      maxParticipants: 25,
      currentParticipants: 8,
      roomId: 'room_sample_2',
      isRecording: false,
      tags: ['React', 'Advanced', 'Hooks'],
    },
  ]).onConflictDoNothing();

  console.log('✅ Seed complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
