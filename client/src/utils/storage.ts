import { User, UserPreferences, Course, PDFResource, CommunityPost, Problem, Project, Achievement, ActivityItem } from '@/types';

const STORAGE_KEYS = {
  USER: 'codesphere_user',
  USERS: 'codesphere_users',
  IS_AUTHENTICATED: 'codesphere_auth',
  USER_PROGRESS: 'codesphere_progress',
  USER_ACHIEVEMENTS: 'codesphere_achievements',
  USER_ACTIVITIES: 'codesphere_activities',
  ROADMAP_PROGRESS: 'codesphere_roadmap_progress',
} as const;

export class StorageService {
  // User Authentication
  static isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
  }

  static setAuthenticated(isAuth: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, String(isAuth));
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getAllUsers(): User[] {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  static addUser(user: User): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static findUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  static updateUser(updatedUser: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(updatedUser);
  }

  // User Progress
  static getUserProgress(): Record<string, any> {
    const progressStr = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return progressStr ? JSON.parse(progressStr) : {};
  }

  static setUserProgress(progress: Record<string, any>): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  }

  static updateCourseProgress(courseId: string, moduleId: string, isCompleted: boolean): void {
    const progress = this.getUserProgress();
    if (!progress.courses) progress.courses = {};
    if (!progress.courses[courseId]) progress.courses[courseId] = {};
    
    progress.courses[courseId][moduleId] = isCompleted;
    this.setUserProgress(progress);
  }

  // Achievements
  static getUserAchievements(): Achievement[] {
    const achievementsStr = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
    return achievementsStr ? JSON.parse(achievementsStr) : [];
  }

  static addAchievement(achievement: Achievement): void {
    const achievements = this.getUserAchievements();
    achievements.push(achievement);
    localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(achievements));
  }

  // Activity Log
  static getUserActivities(): ActivityItem[] {
    const activitiesStr = localStorage.getItem(STORAGE_KEYS.USER_ACTIVITIES);
    return activitiesStr ? JSON.parse(activitiesStr) : [];
  }

  static addActivity(activity: ActivityItem): void {
    const activities = this.getUserActivities();
    activities.unshift(activity); // Add to beginning
    // Keep only last 50 activities
    if (activities.length > 50) {
      activities.splice(50);
    }
    localStorage.setItem(STORAGE_KEYS.USER_ACTIVITIES, JSON.stringify(activities));
  }

  // Roadmap Progress
  static getRoadmapProgress(): Record<string, any> {
    const progressStr = localStorage.getItem(STORAGE_KEYS.ROADMAP_PROGRESS);
    return progressStr ? JSON.parse(progressStr) : {
      frontend: { progress: 65, currentModule: 'ES6+ Features', completedModules: 6 },
      backend: { progress: 0, currentModule: null, completedModules: 0 },
      fullstack: { progress: 0, currentModule: null, completedModules: 0 },
      datascience: { progress: 0, currentModule: null, completedModules: 0 },
      mobile: { progress: 0, currentModule: null, completedModules: 0 },
      devops: { progress: 0, currentModule: null, completedModules: 0 }
    };
  }

  static updateRoadmapProgress(roadmapId: string, progress: any): void {
    const allProgress = this.getRoadmapProgress();
    allProgress[roadmapId] = progress;
    localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(allProgress));
  }

  // Clear all data
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export/Import data
  static exportUserData(): string {
    const data = {
      user: this.getCurrentUser(),
      progress: this.getUserProgress(),
      achievements: this.getUserAchievements(),
      activities: this.getUserActivities(),
      roadmapProgress: this.getRoadmapProgress(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importUserData(dataStr: string): boolean {
    try {
      const data = JSON.parse(dataStr);
      if (data.user) this.setCurrentUser(data.user);
      if (data.progress) this.setUserProgress(data.progress);
      if (data.achievements) localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(data.achievements));
      if (data.activities) localStorage.setItem(STORAGE_KEYS.USER_ACTIVITIES, JSON.stringify(data.activities));
      if (data.roadmapProgress) localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(data.roadmapProgress));
      return true;
    } catch {
      return false;
    }
  }
}
