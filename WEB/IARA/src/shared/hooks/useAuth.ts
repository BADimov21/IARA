/**
 * Authentication Hook
 * Hook for managing user authentication and roles
 */

import { useState, useEffect } from 'react';
import { tokenStorage } from '../api/httpClient';

export type UserRole = 'Admin' | 'User';

interface AuthUser {
  username: string;
  userId?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthUser => {
  const [user, setUser] = useState<AuthUser>({
    username: '',
    userId: undefined,
    role: 'User',
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Token Payload:', payload);
        
        // Extract userId from NameIdentifier claim
        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          || payload.nameid
          || payload.sub
          || '';
        
        // Extract username from Name claim
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          || payload.unique_name 
          || payload.name 
          || payload.username 
          || payload.userName
          || payload.email
          || '';
          
        // Extract role from Role claim
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || payload.role 
          || 'User';
        
        console.log('Extracted userId:', userId);
        console.log('Extracted username:', username);
        console.log('Extracted role:', role);
        
        setUser({
          userId: userId || undefined,
          username: username || '',
          role: role,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        // If token is invalid, default to User role
        setUser({
          username: '',
          userId: undefined,
          role: 'User',
          isAuthenticated: true,
        });
      }
    }
  }, []);

  return user;
};

export const isAdmin = (role: UserRole): boolean => role === 'Admin';
export const canEdit = (role: UserRole): boolean => role === 'Admin';
export const canDelete = (role: UserRole): boolean => role === 'Admin';
// Everyone can view content
export const canView = (_role: UserRole): boolean => true;
