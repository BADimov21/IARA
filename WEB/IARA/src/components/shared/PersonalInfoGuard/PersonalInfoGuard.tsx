/**
 * Personal Info Guard
 * Checks if user has completed personal information and redirects if needed
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { personApi } from '../../../shared/api';
import { Loading } from '../../shared';

interface PersonalInfoGuardProps {
  children: React.ReactNode;
}

const EXCLUDED_PATHS = ['/personal-info', '/login', '/register', '/profile'];

export const PersonalInfoGuard: React.FC<PersonalInfoGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPersonalInfo, setHasPersonalInfo] = useState(false);

  useEffect(() => {
    const checkPersonalInfo = async () => {
      // Skip check for excluded paths
      if (EXCLUDED_PATHS.some(path => location.pathname.startsWith(path))) {
        setIsChecking(false);
        setHasPersonalInfo(true);
        return;
      }

      try {
        const response = await personApi.hasCompletedPersonalInfo();
        
        if (!response.hasCompleted) {
          // Redirect to personal info form if not completed
          navigate('/personal-info', { replace: true });
        } else {
          setHasPersonalInfo(true);
        }
      } catch (error) {
        console.error('Failed to check personal info status:', error);
        // On error, allow access but log the error
        setHasPersonalInfo(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkPersonalInfo();
  }, [location.pathname, navigate]);

  if (isChecking) {
    return <Loading text="Checking registration status..." />;
  }

  if (!hasPersonalInfo) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
