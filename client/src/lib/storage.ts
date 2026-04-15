import { User, Course, PDFResource, Problem, Post } from '../types';

const STORAGE_KEYS = {
  AUTH: 'codesphere_auth',
  USER: 'codesphere_user',
  USERS: 'codesphere_users',
  COURSES: 'codesphere_courses',
  PDFS: 'codesphere_pdfs',
  PROBLEMS: 'codesphere_problems',
  POSTS: 'codesphere_posts'
};

// User Management
export const storage = {
  // Auth
  getAuthState: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  setAuthState: (isAuthenticated: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated.toString());
  },

  // Current User
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // All Users
  getAllUsers: (): User[] => {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  addUser: (user: User): void => {
    const users = storage.getAllUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (updatedUser: User): void => {
    const users = storage.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      // Update current user if it's the same user
      const currentUser = storage.getCurrentUser();
      if (currentUser?.id === updatedUser.id) {
        storage.setCurrentUser(updatedUser);
      }
    }
  },

  // Courses
  getCourses: (): Course[] => {
    const coursesStr = localStorage.getItem(STORAGE_KEYS.COURSES);
    return coursesStr ? JSON.parse(coursesStr) : getDefaultCourses();
  },

  updateCourse: (courseId: string, updates: Partial<Course>): void => {
    const courses = storage.getCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
  },

  // PDF Resources
  getPDFs: (): PDFResource[] => {
    const pdfsStr = localStorage.getItem(STORAGE_KEYS.PDFS);
    return pdfsStr ? JSON.parse(pdfsStr) : getDefaultPDFs();
  },

  // Problems
  getProblems: (): Problem[] => {
    const problemsStr = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    return problemsStr ? JSON.parse(problemsStr) : getDefaultProblems();
  },

  updateProblem: (problemId: string, updates: Partial<Problem>): void => {
    const problems = storage.getProblems();
    const index = problems.findIndex(p => p.id === problemId);
    if (index !== -1) {
      problems[index] = { ...problems[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    }
  },

  // Posts
  getPosts: (): Post[] => {
    const postsStr = localStorage.getItem(STORAGE_KEYS.POSTS);
    return postsStr ? JSON.parse(postsStr) : getDefaultPosts();
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Default data
function getDefaultCourses(): Course[] {
  return [
    {
      id: 'frontend-dev',
      title: 'Frontend Developer Roadmap',
      description: 'Master modern frontend technologies including React, Vue, and advanced CSS',
      category: 'Frontend',
      difficulty: 'beginner',
      progress: 65,
      completed: false,
      modules: [
        { id: '1', title: 'HTML Fundamentals', completed: true },
        { id: '2', title: 'CSS Basics', completed: true },
        { id: '3', title: 'JavaScript Essentials', completed: true },
        { id: '4', title: 'Responsive Design', completed: true },
        { id: '5', title: 'CSS Frameworks', completed: true },
        { id: '6', title: 'JavaScript DOM Manipulation', completed: true },
        { id: '7', title: 'ES6+ Features', completed: false, current: true },
        { id: '8', title: 'Frontend Build Tools', completed: false },
        { id: '9', title: 'React Framework', completed: false }
      ]
    }
  ];
}

function getDefaultPDFs(): PDFResource[] {
  return [
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals Handbook',
      description: 'A comprehensive guide to JavaScript basics including variables, functions, and objects',
      category: 'javascript',
      difficulty: 'beginner',
      pages: 42,
      size: '2.4 MB',
      downloads: 1245,
      uploadDate: '2024-11-26',
      tags: ['fundamentals', 'beginner']
    },
    {
      id: 'react-hooks',
      title: 'React Hooks Explained',
      description: 'Deep dive into React hooks with practical examples and best practices',
      category: 'react',
      difficulty: 'intermediate',
      pages: 36,
      size: '1.8 MB',
      downloads: 887,
      uploadDate: '2024-12-05',
      tags: ['hooks', 'intermediate']
    },
    {
      id: 'css-grid-flexbox',
      title: 'CSS Grid and Flexbox Mastery',
      description: 'Master modern CSS layout techniques with detailed examples',
      category: 'css',
      difficulty: 'intermediate',
      pages: 28,
      size: '3.2 MB',
      downloads: 756,
      uploadDate: '2024-11-15',
      tags: ['layout', 'intermediate']
    },
    {
      id: 'nodejs-api',
      title: 'Building RESTful APIs with Node.js',
      description: 'Learn to create robust APIs using Node.js, Express, and MongoDB',
      category: 'nodejs',
      difficulty: 'advanced',
      pages: 54,
      size: '4.1 MB',
      downloads: 632,
      uploadDate: '2024-12-10',
      tags: ['backend', 'advanced']
    },
    {
      id: 'typescript-react',
      title: 'TypeScript for React Developers',
      description: 'Practical guide to using TypeScript with React for type-safe applications',
      category: 'typescript',
      difficulty: 'intermediate',
      pages: 48,
      size: '2.7 MB',
      downloads: 543,
      uploadDate: '2024-12-19',
      tags: ['types', 'intermediate']
    },
    {
      id: 'html5-semantic',
      title: 'HTML5 Semantic Elements Guide',
      description: 'Comprehensive guide to semantic HTML for better accessibility and SEO',
      category: 'html',
      difficulty: 'beginner',
      pages: 32,
      size: '1.5 MB',
      downloads: 421,
      uploadDate: '2024-12-23',
      tags: ['accessibility', 'beginner']
    }
  ];
}

function getDefaultProblems(): Problem[] {
  return [
    {
      id: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      difficulty: 'easy',
      category: 'Arrays',
      tags: ['Hash Table', 'Arrays'],
      xpReward: 100,
      completed: false,
      attempts: 0
    },
    {
      id: 'reverse-string',
      title: 'Reverse String',
      description: 'Write a function that reverses a string using different approaches.',
      difficulty: 'easy',
      category: 'Strings',
      tags: ['Strings', 'Two Pointers'],
      xpReward: 100,
      completed: true,
      attempts: 1
    },
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      description: 'Determine if the input string has valid parentheses combinations.',
      difficulty: 'easy',
      category: 'Strings',
      tags: ['Stack', 'Strings'],
      xpReward: 150,
      completed: false,
      attempts: 0
    },
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray',
      description: 'Find the contiguous subarray with the largest sum.',
      difficulty: 'medium',
      category: 'Arrays',
      tags: ['Dynamic Programming', 'Arrays'],
      xpReward: 250,
      completed: true,
      attempts: 2
    }
  ];
}

function getDefaultPosts(): Post[] {
  return [
    {
      id: 'react-performance',
      author: {
        name: 'Alex Smith',
        avatar: 'AS',
        level: 8
      },
      title: 'How to optimize React component re-renders?',
      content: "I'm working on a complex React app and noticing performance issues. The components seem to re-render more often than necessary. What are the best practices for optimizing this?",
      category: 'React',
      tags: ['React', 'Performance'],
      likes: 24,
      replies: 8,
      timestamp: '2 hours ago'
    },
    {
      id: 'senior-journey',
      author: {
        name: 'Maria Johnson',
        avatar: 'MJ',
        level: 12
      },
      title: 'My journey from junior to senior developer',
      content: "Just hit my 5-year mark as a developer! Thought I'd share some insights and lessons learned along the way. Here's what I wish I knew when starting out...",
      category: 'Career',
      tags: ['Career', 'Experience'],
      likes: 87,
      replies: 23,
      timestamp: '5 hours ago'
    },
    {
      id: 'chat-app-showcase',
      author: {
        name: 'David Kim',
        avatar: 'DK',
        level: 6
      },
      title: 'Built a real-time chat app with Socket.io!',
      content: "Finally completed my first real-time application! It's a chat app built with Node.js, Express, and Socket.io. Would love to get some feedback from the community.",
      category: 'Showcase',
      tags: ['Node.js', 'Socket.io'],
      likes: 45,
      replies: 12,
      timestamp: '1 day ago'
    }
  ];
}
