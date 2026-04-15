import { User } from '@/types';
import { storage } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Demo accounts for easy testing
    let user: User | null = null;
    
    if (email === 'admin@codesphere.com' && password === 'admin123') {
      user = {
        id: 'admin1',
        firstName: 'Admin',
        lastName: 'User',
        email,
        role: 'admin',
        joinDate: new Date().toISOString(),
        level: 10,
        xp: 5000,
        nextLevelXP: 10000,
        streak: 30,
        completedCourses: 15,
        problemsSolved: 200
      };
    } else if (email === 'student@codesphere.com' && password === 'student123') {
      user = {
        id: 'student1',
        firstName: 'Student',
        lastName: 'User',
        email,
        role: 'student',
        joinDate: new Date().toISOString(),
        level: 5,
        xp: 1250,
        nextLevelXP: 2000,
        streak: 7,
        completedCourses: 3,
        problemsSolved: 45
      };
    } else {
      // Check existing users
      const users = storage.getAllUsers();
      user = users.find(u => u.email === email) || null;
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }

    storage.setCurrentUser(user);
    storage.setAuthState(true);
    return user;
  }

  static async register(data: RegisterData): Promise<User> {
    const { firstName, lastName, email, password } = data;
    
    if (!firstName || !lastName || !email || !password) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const users = storage.getAllUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      role: 'student',
      joinDate: new Date().toISOString(),
      level: 1,
      xp: 0,
      nextLevelXP: 100,
      streak: 0,
      completedCourses: 0,
      problemsSolved: 0
    };

    storage.addUser(newUser);
    storage.setCurrentUser(newUser);
    storage.setAuthState(true);
    return newUser;
  }

  static logout(): void {
    storage.setAuthState(false);
    localStorage.removeItem('codesphere_user');
  }

  static getCurrentUser(): User | null {
    return storage.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return storage.getAuthState();
  }

  static async updateUserProgress(xpGained: number): Promise<User | null> {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return null;

    const newXP = currentUser.xp + xpGained;
    const newLevel = Math.floor(newXP / 1000) + 1;
    const newNextLevelXP = newLevel * 1000;
    
    const updatedUser: User = {
      ...currentUser,
      xp: newXP,
      level: newLevel,
      nextLevelXP: newNextLevelXP,
    };

    storage.updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementStreak(): Promise<User | null> {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      streak: currentUser.streak + 1,
    };

    storage.updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementProblemsSolved(): Promise<User | null> {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      problemsSolved: currentUser.problemsSolved + 1,
    };

    storage.updateUser(updatedUser);
    return updatedUser;
  }

  static async incrementCoursesCompleted(): Promise<User | null> {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      completedCourses: currentUser.completedCourses + 1,
    };

    storage.updateUser(updatedUser);
    return updatedUser;
  }
}
