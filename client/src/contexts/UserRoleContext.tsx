import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type UserRole = 'admin' | 'sub_admin' | 'student';

interface UserRoleContextType {
  role: UserRole;
  isAdmin: boolean;
  isSubAdmin: boolean;
  isStudent: boolean;
  canUploadContent: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const role: UserRole = (user?.role as UserRole) || 'student';
  const isAdmin = role === 'admin';
  const isSubAdmin = role === 'sub_admin';
  const hasAdminAccess = isAdmin || isSubAdmin;

  return (
    <UserRoleContext.Provider value={{
      role,
      isAdmin,
      isSubAdmin,
      isStudent: role === 'student',
      canUploadContent: hasAdminAccess,
      canManageUsers: isAdmin, // Only full admin
      canViewAnalytics: hasAdminAccess,
    }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) throw new Error('useUserRole must be used within a UserRoleProvider');
  return context;
}