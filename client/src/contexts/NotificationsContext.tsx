import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'assignment' | 'message' | 'ai-mentor' | 'achievement' | 'reminder' | 'system' | 'live-class';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  sender?: string;
  icon?: any;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  highPriorityCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'welcome',
      type: 'system',
      title: 'Welcome to CodeSphere!',
      message: 'Start your learning journey — explore roadmaps, solve problems, and join live classes.',
      timestamp: new Date(),
      read: false,
      priority: 'medium',
    },
    {
      id: 'daily-problem',
      type: 'reminder',
      title: 'Daily Problem Available',
      message: 'A new daily coding challenge is ready. Solve it to earn XP and maintain your streak!',
      timestamp: new Date(),
      read: false,
      priority: 'high',
      actionUrl: '/problems',
    },
    {
      id: 'live-class',
      type: 'live-class',
      title: 'Live Classes This Week',
      message: 'JavaScript Fundamentals and React Hooks Deep Dive sessions are scheduled. Check the schedule!',
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      actionUrl: '/live-classes',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-mark old notifications as read after 7 days
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.timestamp < sevenDaysAgo && !notification.read
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    highPriorityCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
} 