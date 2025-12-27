/**
 * App Component
 * Main application component with routing
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/shared/Toast';
import { Layout } from './components/shared/Layout';
import { Button } from './components/shared';
import { LoginForm, RegisterForm } from './components/auth';
import { UserList } from './components/users';
import { FishSpecyList } from './components/nomenclatures';
import { FishingTripList } from './components/fishing';
import './App.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('iara_auth_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Component
const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>IARA Dashboard</h1>
      <p>Welcome to the Fisheries Information System</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Fish Species</h3>
          <p className="stat-number">42</p>
        </div>
        <div className="stat-card">
          <h3>Fishing Trips</h3>
          <p className="stat-number">128</p>
        </div>
        <div className="stat-card">
          <h3>Inspections</h3>
          <p className="stat-number">37</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number">15</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Users */}
                    <Route path="/users" element={<UserList />} />
                    
                    {/* Nomenclatures */}
                    <Route path="/nomenclatures/fish-species" element={<FishSpecyList />} />
                    
                    {/* Fishing */}
                    <Route path="/fishing/trips" element={<FishingTripList />} />
                    
                    {/* Catch-all */}
                    <Route path="*" element={
                      <div className="not-found-page">
                        <div className="not-found-content">
                          <h1 className="not-found-title">404</h1>
                          <h2 className="not-found-subtitle">Page Not Found</h2>
                          <p className="not-found-text">The page you're looking for doesn't exist or hasn't been implemented yet.</p>
                          <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
                        </div>
                      </div>
                    } />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
