/**
 * AdminRoute Component
 * Protected route that only allows admin users
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { role } = useAuth();
  
  if (role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
