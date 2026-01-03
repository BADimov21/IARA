/**
 * Unauthorized Page
 * Displayed when user tries to access a page without proper permissions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/shared';
import './Unauthorized.css';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <Card title="Access Denied" className="unauthorized-card">
        <div className="unauthorized-content">
          <div className="unauthorized-icon">🔒</div>
          <h2>401 - Unauthorized</h2>
          <p className="unauthorized-message">
            You don't have permission to access this page.
          </p>
          <p className="unauthorized-submessage">
            This page is restricted to administrators only. If you believe you should have access, 
            please contact your system administrator.
          </p>
          <div className="unauthorized-actions">
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
