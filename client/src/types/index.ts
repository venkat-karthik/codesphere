export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student';
  level: number;
  xp: number;
  nextLevelXP: number;
  streak: number;
  joinDate: string;
  completedCourses: string[];
  problemsSolved: number;
  learningPath?: string;
  avatar?: string;
  name?: string;
  codeCoins?: number;
  codeCoinsHistory?: {
    type: 'earn' | 'spend';
    amount: number;
    reason: string;
    date: string;
  }[];
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinDate'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  completeCourse: (courseId: string) => void;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  completed: boolean;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface PDFResource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pages: number;
  size: string;
  downloads: number;
  uploadDate: string;
  tags: string[];
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  xpReward: number;
  completed: boolean;
  attempts: number;
  solved?: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string;
  liked?: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  skills: RoadmapSkill[];
  estimatedHours: number;
  demand: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSkill {
  id: string;
  title: string;
  description: string;
  weeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
  projects: string[];
  estimatedHours: number;
  completed: boolean;
  current: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'article' | 'pdf' | 'interactive';
  url: string;
  tags: string[];
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  category: string;
  tags: unknown;
  createdAt: string;
  content: string;
  replies: number;
  userId: string;
  likes: number;
  isResolved: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showActivity: boolean;
  };
  learning: {
    preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
    dailyGoal: number;
    reminderTime: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  dueDate: string;
  tags: string[];
  technologies: string[];
  repository?: string;
  liveUrl?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'streak' | 'special';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'problem_solved' | 'streak_milestone' | 'achievement_unlocked' | 'level_up';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
  metadata?: Record<string, any>;
}

export type Section = 
  | 'dashboard' 
  | 'roadmaps' 
  | 'resources' 
  | 'videos' 
  | 'problems' 
  | 'community' 
  | 'studio' 
  | 'sandbox' 
  | 'mentor' 
  | 'sphere-map' 
  | 'platform-analytics'
  | 'profile' 
  | 'settings'
  | 'live-classes'
  | 'analytics'
  | 'store'
  | 'tutorials'
  | 'admin-pdf-resources'
  | 'admin-video-resources'
  | 'admin-live-classes'
  | 'admin-sphere-map';

// Live Video Conferencing Types
export interface LiveClass {
  id: string;
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

export interface VideoRoom {
  id: string;
  name: string;
  participants: Participant[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Participant {
  id: string;
  userId: string;
  name: string;
  role: 'host' | 'participant';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  joinedAt: string;
  stream?: MediaStream;
  peerId?: string;
}

export interface VideoCallState {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  participants: Participant[];
  messages: ChatMessage[];
  roomId: string | null;
  isHost: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system';
}

export interface VideoCallSettings {
  videoQuality: 'low' | 'medium' | 'high';
  audioQuality: 'low' | 'medium' | 'high';
  enableRecording: boolean;
  enableChat: boolean;
  enableScreenShare: boolean;
  maxParticipants: number;
}

// Assignment types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'assignment' | 'test';
  difficulty: 'easy' | 'medium' | 'hard';
  dueDate: string;
  maxPoints: number;
  instructions: string;
  attachments: AssignmentAttachment[];
  questions?: TestQuestion[];
  createdAt: string;
  createdBy: string;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size: number;
}

export interface TestQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  textResponse?: string;
  attachments: SubmissionAttachment[];
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface SubmissionAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'document' | 'other';
  size: number;
}
