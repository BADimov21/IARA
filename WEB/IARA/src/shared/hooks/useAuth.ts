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
  roleFromAPI?: boolean;
}

export const useAuth = (): AuthUser => {
  const [user, setUser] = useState<AuthUser>({
    username: '',
    userId: undefined,
    role: 'User',
    isAuthenticated: false,
    roleFromAPI: false,
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
        let role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || payload.role 
          || 'User';
        
        // Handle role as array (JWT can have multiple roles as array)
        if (Array.isArray(role)) {
          console.log('Role is an array:', role);
          // Check if Admin is in the roles array
          role = role.includes('Admin') ? 'Admin' : (role[0] || 'User');
        }
        
        console.log('=== AUTH DEBUG ===');
        console.log('Full JWT Payload:', payload);
        console.log('Extracted userId:', userId);
        console.log('Extracted username:', username);
        console.log('Extracted role:', role);
        console.log('Role type:', typeof role);
        console.log('Is role === "Admin"?', role === 'Admin');
        console.log('Is role.toLowerCase() === "admin"?', typeof role === 'string' && role.toLowerCase() === 'admin');
        console.log('=== END AUTH DEBUG ===');
        
        // Normalize role to handle case sensitivity
        const normalizedRole = typeof role === 'string' && role.toLowerCase() === 'admin' ? 'Admin' : 'User';
        
        setUser({
          userId: userId || undefined,
          username: username || '',
          role: normalizedRole as UserRole,
          isAuthenticated: true,
          roleFromAPI: false,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        // If token is invalid, default to User role
        setUser({
          username: '',
          userId: undefined,
          role: 'User',
          isAuthenticated: true,
          roleFromAPI: false,
        });
      }
    }
  }, []);

  // Fetch actual UserType from API to determine admin rights
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user.userId && !user.roleFromAPI) {
        try {
          const { userApi } = await import('../api');
          const users = await userApi.getAll({ page: 1, pageSize: 100, filters: {} });
          const currentUser = users.find((u: any) => u.userId === user.userId);
          
          if (currentUser && currentUser.userType) {
            const apiRole = currentUser.userType === 'Admin' ? 'Admin' : 'User';
            console.log('Updated role from API:', apiRole, '(was:', user.role, ')');
            
            setUser(prev => ({
              ...prev,
              role: apiRole,
              roleFromAPI: true,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user role from API:', error);
        }
      }
    };
    
    fetchUserRole();
  }, [user.userId, user.roleFromAPI]);

  return user;
};

export const isAdmin = (role: UserRole): boolean => role === 'Admin';
export const canEdit = (role: UserRole): boolean => role === 'Admin';
export const canDelete = (role: UserRole): boolean => role === 'Admin';
// Everyone can view content
export const canView = (_role: UserRole): boolean => true;
