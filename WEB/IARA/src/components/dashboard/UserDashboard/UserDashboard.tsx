/**
 * User Dashboard Component
 * Simplified dashboard for regular users showing their tickets, permits, and recent activities
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Loading } from '../../shared';
import { ticketPurchaseApi, recreationalCatchApi, fishingPermitApi } from '../../../shared/api';
import './UserDashboard.css';

interface DashboardStats {
  myTickets: number;
  myCatches: number;
  myPermits: number;
}

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    myTickets: 0,
    myCatches: 0,
    myPermits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user-specific data
        const [tickets, catches, permits] = await Promise.all([
          ticketPurchaseApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
          recreationalCatchApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
          fishingPermitApi.getAll({ page: 1, pageSize: 100, filters: {} }).catch(() => []),
        ]);

        setStats({
          myTickets: Array.isArray(tickets) ? tickets.length : 0,
          myCatches: Array.isArray(catches) ? catches.length : 0,
          myPermits: Array.isArray(permits) ? permits.length : 0,
        });
      } catch (error) {
        console.error('Failed to load user dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, []);

  if (loading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <h1>Welcome to Your Fishing Portal</h1>
        <p>Your central hub for managing recreational fishing activities in Bulgaria</p>
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', borderRadius: '0.75rem', borderLeft: '4px solid rgb(99, 102, 241)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#4338ca' }}>📋 Getting Started</h3>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <li><strong>Purchase a Ticket:</strong> Buy a recreational fishing ticket from the "My Tickets" section below</li>
          <li><strong>Go Fishing:</strong> Make sure your ticket is valid for the dates you plan to fish</li>
          <li><strong>Record Your Catch:</strong> After fishing, log what you caught in the "My Catches" section</li>
          <li><strong>Stay Compliant:</strong> Always fish within the regulations and report your catches accurately</li>
        </ol>
      </div>

      <div className="user-dashboard-stats">
        <Card className="user-stat-card">
          <div className="user-stat-content">
            <div className="user-stat-icon">🎫</div>
            <div className="user-stat-info">
              <h3>My Fishing Tickets</h3>
              <p className="user-stat-number">{stats.myTickets}</p>
              <p className="user-stat-label">Purchased tickets</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/recreational/tickets')}
            fullWidth
          >
            Manage Tickets
          </Button>
        </Card>

        <Card className="user-stat-card">
          <div className="user-stat-content">
            <div className="user-stat-icon">🐟</div>
            <div className="user-stat-info">
              <h3>My Catches</h3>
              <p className="user-stat-number">{stats.myCatches}</p>
              <p className="user-stat-label">Fish recorded</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/recreational/catches')}
            fullWidth
          >
            View Catches
          </Button>
        </Card>

        <Card className="user-stat-card">
          <div className="user-stat-content">
            <div className="user-stat-icon">📋</div>
            <div className="user-stat-info">
              <h3>Fishing Permits</h3>
              <p className="user-stat-number">{stats.myPermits}</p>
              <p className="user-stat-label">Active permits</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/fishing/permits')}
            fullWidth
          >
            View Permits
          </Button>
        </Card>
      </div>

      <div className="user-dashboard-actions">
        <Card title="Quick Actions" subtitle="Common tasks for recreational fishing" className="actions-card">
          <div className="action-buttons">
            <Button 
              variant="primary" 
              onClick={() => navigate('/recreational/tickets')}
              size="large"
            >
              🎟️ Purchase New Ticket
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/recreational/catches')}
              size="large"
            >
              📝 Record a Catch
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/nomenclatures/fish-species')}
              size="large"
            >
              🔍 Browse Fish Species
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/profile')}
              size="large"
            >
              👤 Update My Profile
            </Button>
          </div>
        </Card>

        <Card title="📚 Information" subtitle="Learn about fishing regulations" className="info-card">
          <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e40af' }}>Important Reminders:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Valid Ticket Required:</strong> You must have a valid fishing ticket for the day you fish</li>
              <li><strong>Record Catches:</strong> Log all your catches immediately after your fishing trip</li>
              <li><strong>Species Regulations:</strong> Check which fish species are allowed and any size/quantity limits</li>
              <li><strong>Protected Areas:</strong> Some areas may have special restrictions or be off-limits</li>
              <li><strong>Sustainability:</strong> Help preserve fish populations by following all guidelines</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
