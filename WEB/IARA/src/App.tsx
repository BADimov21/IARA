/**
 * App Component
 * Main application component with routing
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/shared/Toast';
import { Layout, AdminRoute, PersonalInfoGuard } from './components/shared';
import { Button } from './components/shared';
import { LoginForm, RegisterForm, PersonalInfoForm } from './components/auth';
import { UserList } from './components/users';
import { ProfilePage } from './components/profile';
import { HelpPage } from './components/help/HelpPage';
import { Unauthorized } from './pages/Unauthorized';
import { UserDashboard } from './components/dashboard';
import { FishSpecyList, EngineTypeList, FishingGearTypeList, TicketTypeList } from './components/nomenclatures';
import { FishingTripList, CatchList, FishingGearList, FishingOperationList, FishingPermitList } from './components/fishing';
import { VesselList } from './components/registry/VesselList';
import { PersonList } from './components/registry/PersonList';
import { TELKDecisionList } from './components/registry/TELKDecisionList';
import { InspectionList } from './components/inspections/InspectionList';
import { InspectorList } from './components/inspections/InspectorList';
import { ViolationList } from './components/inspections/ViolationList';
import { FishBatchList, LandingList, BatchLocationList } from './components/batches';
import { RecreationalCatchList, TicketPurchaseList } from './components/recreational';
import { ExpiringPermitsReport, FishermenRankingReport, VesselStatisticsReport, CarbonFootprintReport } from './components/reports';
import { useAuth } from './shared/hooks/useAuth';
import { isAdmin } from './shared/utils/permissions';
import logo from './assets/logo.png';
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

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    fishSpecies: 0,
    fishingTrips: 0,
    inspections: 0,
    vessels: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // Import the API services from shared/api
        const { fishSpecyApi, fishingTripApi, inspectionApi, vesselApi } = await import('./shared/api');

        // Fetch data from APIs
        const [species, trips, inspections, vessels] = await Promise.all([
          fishSpecyApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
          fishingTripApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
          inspectionApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
          vesselApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
        ]);

        setStats({
          fishSpecies: Array.isArray(species) ? species.length : 0,
          fishingTrips: Array.isArray(trips) ? trips.length : 0,
          inspections: Array.isArray(inspections) ? inspections.length : 0,
          vessels: Array.isArray(vessels) ? vessels.length : 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <img src={logo} alt="IARA Logo" className="dashboard-logo" />
      <h1>Executive Agency for Fisheries and Aquaculture</h1>
      <h2>EAFA (IARA) Admin Dashboard</h2>
      <p>Welcome to the Fisheries Information System</p>
      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Fish Species</h3>
            <p className="stat-number">{stats.fishSpecies}</p>
          </div>
          <div className="stat-card">
            <h3>Fishing Trips</h3>
            <p className="stat-number">{stats.fishingTrips}</p>
          </div>
          <div className="stat-card">
            <h3>Inspections</h3>
            <p className="stat-number">{stats.inspections}</p>
          </div>
          <div className="stat-card">
            <h3>Vessels</h3>
            <p className="stat-number">{stats.vessels}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard Router Component
const Dashboard: React.FC = () => {
  const { role } = useAuth();
  
  // Show different dashboard based on role
  if (isAdmin(role)) {
    return <AdminDashboard />;
  }
  
  return <UserDashboard />;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Personal Info Form - Protected but outside Layout */}
          <Route path="/personal-info" element={
            <ProtectedRoute>
              <PersonalInfoForm />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <PersonalInfoGuard>
                  <Layout>
                    <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/help" element={<HelpPage />} />
                    
                    {/* Profile */}
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Unauthorized */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Users - Admin Only */}
                    <Route path="/users" element={<AdminRoute><UserList /></AdminRoute>} />
                    
                    {/* Nomenclatures */}
                    <Route path="/nomenclatures/fish-species" element={<FishSpecyList />} />
                    <Route path="/nomenclatures/engine-types" element={<EngineTypeList />} />
                    <Route path="/nomenclatures/fishing-gear-types" element={<FishingGearTypeList />} />
                    <Route path="/nomenclatures/ticket-types" element={<TicketTypeList />} />
                    
                    {/* Fishing */}
                    <Route path="/fishing/trips" element={<FishingTripList />} />
                    <Route path="/fishing/catches" element={<CatchList />} />
                    <Route path="/fishing/gear" element={<FishingGearList />} />
                    <Route path="/fishing/operations" element={<FishingOperationList />} />
                    <Route path="/fishing/permits" element={<FishingPermitList />} />
                    
                    {/* Batches */}
                    <Route path="/batches/fish-batches" element={<FishBatchList />} />
                    <Route path="/batches/landings" element={<LandingList />} />
                    <Route path="/batches/locations" element={<BatchLocationList />} />
                    
                    {/* Registry */}
                    <Route path="/registry/persons" element={<AdminRoute><PersonList /></AdminRoute>} />
                    <Route path="/registry/vessels" element={<VesselList />} />
                    <Route path="/registry/telk-decisions" element={<TELKDecisionList />} />
                    
                    {/* Inspections */}
                    <Route path="/inspections" element={<InspectionList />} />
                    <Route path="/inspections/inspectors" element={<InspectorList />} />
                    <Route path="/inspections/violations" element={<ViolationList />} />
                    
                    {/* Recreational Fishing */}
                    <Route path="/recreational/catches" element={<RecreationalCatchList />} />
                    <Route path="/recreational/tickets" element={<TicketPurchaseList />} />
                    
                    {/* Reports */}
                    <Route path="/reports/expiring-permits" element={<ExpiringPermitsReport />} />
                    <Route path="/reports/fishermen-ranking" element={<FishermenRankingReport />} />
                    <Route path="/reports/vessel-statistics" element={<VesselStatisticsReport />} />
                    <Route path="/reports/carbon-footprint" element={<CarbonFootprintReport />} />
                    
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
                </PersonalInfoGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
