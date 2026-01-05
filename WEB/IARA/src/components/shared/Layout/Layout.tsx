/**
 * Layout Component
 * Main application layout with navigation
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { useAuth } from '../../../shared/hooks/useAuth';
import { isAdmin } from '../../../shared/utils/permissions';
import type { UserRole } from '../../../shared/utils/permissions';
import { Footer } from '../Footer';
import logo from '../../../assets/logo.png';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
  adminOnly?: boolean;
}

// Define navigation structure with role-based access
const getNavigationItems = (role: UserRole): NavItem[] => {
  const adminItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    {
      label: 'Nomenclatures',
      path: '/nomenclatures',
      children: [
        { label: 'Fish Species', path: '/nomenclatures/fish-species' },
        { label: 'Engine Types', path: '/nomenclatures/engine-types' },
        { label: 'Fishing Gear Types', path: '/nomenclatures/fishing-gear-types' },
        { label: 'Ticket Types', path: '/nomenclatures/ticket-types' },
      ],
    },
    {
      label: 'Fishing',
      path: '/fishing',
      children: [
        { label: 'Fishing Trips', path: '/fishing/trips' },
        { label: 'Fishing Operations', path: '/fishing/operations' },
        { label: 'Catches', path: '/fishing/catches' },
        { label: 'Fishing Permits', path: '/fishing/permits' },
        { label: 'Fishing Gear', path: '/fishing/gear' },
      ],
    },
    {
      label: 'Batches',
      path: '/batches',
      children: [
        { label: 'Landings', path: '/batches/landings' },
        { label: 'Fish Batches', path: '/batches/fish-batches' },
        { label: 'Batch Locations', path: '/batches/locations' },
      ],
    },
    {
      label: 'Inspections',
      path: '/inspections',
      children: [
        { label: 'Inspections', path: '/inspections' },
        { label: 'Inspectors', path: '/inspections/inspectors' },
        { label: 'Violations', path: '/inspections/violations' },
      ],
    },
    {
      label: 'Registry',
      path: '/registry',
      children: [
        { label: 'Persons', path: '/registry/persons' },
        { label: 'Vessels', path: '/registry/vessels' },
        { label: 'TELK Decisions', path: '/registry/telk-decisions' },
      ],
    },
    {
      label: 'Recreational Fishing',
      path: '/recreational',
      children: [
        { label: 'All Ticket Purchases', path: '/recreational/tickets' },
        { label: 'All Recreational Catches', path: '/recreational/catches' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
      children: [
        { label: 'Expiring Permits', path: '/reports/expiring-permits' },
        { label: 'Fishermen Ranking', path: '/reports/fishermen-ranking' },
        { label: 'Vessel Statistics', path: '/reports/vessel-statistics' },
        { label: 'Carbon Footprint', path: '/reports/carbon-footprint' },
      ],
    },
    { label: 'Users', path: '/users', adminOnly: true },
  ];

  const userItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    {
      label: 'My Tickets',
      path: '/recreational/tickets',
    },
    {
      label: 'My Catches',
      path: '/recreational/catches',
    },
    {
      label: 'Fishing',
      path: '/fishing',
      children: [
        { label: 'View Permits', path: '/fishing/permits' },
        { label: 'Record Operation', path: '/fishing/operations' },
        { label: 'Record Catch', path: '/fishing/catches' },
      ],
    },
    {
      label: 'View Information',
      path: '/view',
      children: [
        { label: 'Fish Species', path: '/nomenclatures/fish-species' },
        { label: 'Vessels', path: '/registry/vessels' },
        { label: 'Inspections', path: '/inspections' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
      children: [
        { label: 'Expiring Permits', path: '/reports/expiring-permits' },
        { label: 'Fishermen Ranking', path: '/reports/fishermen-ranking' },
        { label: 'Vessel Statistics', path: '/reports/vessel-statistics' },
        { label: 'Carbon Footprint', path: '/reports/carbon-footprint' },
      ],
    },
    { label: '📚 Help & Guide', path: '/help' },
  ];

  const inspectorItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    {
      label: '🔍 Inspections',
      path: '/inspections',
      children: [
        { label: 'Register Inspection', path: '/inspections' },
        { label: 'Violations & Fines', path: '/inspections/violations' },
        { label: 'View Inspectors', path: '/inspections/inspectors' },
      ],
    },
    {
      label: '🚢 Check Vessels',
      path: '/registry/vessels',
    },
    {
      label: '📦 Check Batches',
      path: '/batches',
      children: [
        { label: 'Landings', path: '/batches/landings' },
        { label: 'Fish Batches', path: '/batches/fish-batches' },
        { label: 'Batch Locations', path: '/batches/locations' },
      ],
    },
    {
      label: '🎟️ Check Tickets',
      path: '/recreational/tickets',
    },
    {
      label: 'View Information',
      path: '/view',
      children: [
        { label: 'Fish Species', path: '/nomenclatures/fish-species' },
        { label: 'Fishing Permits', path: '/fishing/permits' },
        { label: 'Fishing Operations', path: '/fishing/operations' },
        { label: 'Persons', path: '/registry/persons' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
      children: [
        { label: 'Expiring Permits', path: '/reports/expiring-permits' },
        { label: 'Vessel Statistics', path: '/reports/vessel-statistics' },
        { label: 'Carbon Footprint', path: '/reports/carbon-footprint' },
      ],
    },
  ];

  if (role === 'Inspector') {
    return inspectorItems;
  }
  
  return isAdmin(role) ? adminItems : userItems;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  // Get navigation items based on user role
  const navigationItems = getNavigationItems(role);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="layout">
      {/* Top Navigation Bar */}
      <header className="layout-header">
        <button className="layout-menu-button" onClick={toggleSidebar} aria-label="Toggle menu">
          ☰
        </button>
        <img src={logo} alt="IARA Logo" className="layout-header-logo" />
        <div className="layout-header-title">
          <h1>Executive Agency for Fisheries and Aquaculture</h1>
        </div>
        <div className="layout-header-actions">
          <button 
            className="layout-profile-button" 
            onClick={() => navigate('/profile')}
            title="My Profile"
          >
            👤 My Profile
          </button>
          <button className="layout-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="layout-body">
        {/* Mobile Overlay */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar Navigation */}
        <aside className={`layout-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav className="layout-nav">
            {navigationItems.map((item) => (
              <div key={item.path} className="nav-item-container">
                {item.children ? (
                  <>
                    <button
                      className={`nav-item nav-item-parent ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => toggleSubmenu(item.path)}
                    >
                      <span>{item.label}</span>
                      <span className="nav-item-arrow">
                        {openSubmenus.includes(item.path) ? '▼' : '▶'}
                      </span>
                    </button>
                    {openSubmenus.includes(item.path) && (
                      <div className="nav-submenu">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`nav-item nav-item-child ${isActive(child.path) ? 'active' : ''}`}
                            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="layout-content">{children}</main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
