/**
 * AdminRoute Component
 * Protected route that only allows admin users
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isAdmin } from '../../../shared/hooks/useAuth';
import { Loading } from '../Loading';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { role, roleFromAPI } = useAuth();
  
  console.log('=== ADMIN ROUTE DEBUG ===');
  console.log('role:', role);
  console.log('roleFromAPI:', roleFromAPI);
  console.log('isAdmin(role):', isAdmin(role));
  console.log('=== END ADMIN ROUTE DEBUG ===');
  
  // Show loading while fetching role from API
  if (!roleFromAPI) {
    return <Loading fullScreen />;
  }
  
  // Once role is determined, check if user is admin
  if (!isAdmin(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
