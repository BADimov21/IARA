/**
 * ProfilePage Component
 * User profile page for viewing and editing user information
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { userApi, authApi } from '../../../shared/api';
import { Button, Input, Card, Loading, useToast } from '../../shared';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const ProfilePage: React.FC = () => {
  const { username, userId } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Only load profile when userId or username is available
    if (userId || username) {
      loadProfile();
    }
  }, [userId, username]); // Re-run when userId or username changes

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('=== PROFILE LOADING DEBUG ===');
      console.log('Current userId from JWT:', userId);
      console.log('Current username from JWT:', username);
      
      // Get current user profile - API returns array, find current user
      const users = await userApi.getAll({ page: 1, pageSize: 100, filters: {} });
      
      console.log('API returned users count:', users?.length);
      console.log('All users data:', JSON.stringify(users, null, 2));
      
      if (!Array.isArray(users)) {
        console.error('Users is not an array:', users);
        setError('Invalid API response format');
        return;
      }
      
      if (users.length === 0) {
        setError('No users found in the system');
        return;
      }
      
      // Log all user IDs and usernames for debugging
      console.log('Available users:', users.map((u: any) => ({
        userId: u.userId,
        username: u.username,
        email: u.email,
        userType: u.userType
      })));
      
      let currentUser;
      
      // First try to match by userId (most reliable)
      if (userId && userId.trim() !== '') {
        console.log('Attempting to match by userId:', userId);
        currentUser = users.find((u: any) => {
          const matches = u.userId === userId || u.userId?.toString() === userId?.toString();
          console.log(`Comparing u.userId="${u.userId}" (type: ${typeof u.userId}) with JWT userId="${userId}" (type: ${typeof userId}): ${matches}`);
          return matches;
        });
        console.log('Match by userId result:', currentUser ? 'FOUND' : 'NOT FOUND');
      }
      
      // Fallback: try to match by username
      if (!currentUser && username && username.trim() !== '') {
        console.log('Attempting to match by username:', username);
        currentUser = users.find((u: any) => {
          const matches = u.username?.toLowerCase() === username?.toLowerCase();
          console.log(`Comparing u.username="${u.username}" with JWT username="${username}": ${matches}`);
          return matches;
        });
        console.log('Match by username result:', currentUser ? 'FOUND' : 'NOT FOUND');
      }
      
      console.log('Final selected user:', currentUser);
      console.log('=== END DEBUG ===');
      
      if (currentUser) {
        const userProfile = {
          id: (currentUser as any).userId || (currentUser as any).id,
          username: currentUser.username,
          email: currentUser.email || '',
          role: (currentUser as any).userType || (currentUser as any).role || 'User',
          firstName: '',
          lastName: '',
          phone: '',
        };
        
        console.log('Setting profile:', userProfile);
        setProfile(userProfile);
        
        setFormData({
          email: currentUser.email || '',
          firstName: '',
          lastName: '',
          phone: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        console.error('ERROR: No user found!');
        console.error('Looking for userId:', userId, '(type:', typeof userId, ')');
        console.error('Looking for username:', username);
        setError(`User profile not found. JWT userId: "${userId}", username: "${username}". Check browser console for details.`);
      }
    } catch (err) {
      console.error('Failed to load profile - Full error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      let errorMessage = 'Failed to load profile';
      if (err && typeof err === 'object') {
        if ('message' in err) {
          errorMessage += `: ${(err as any).message}`;
        } else if ('statusCode' in err) {
          errorMessage += `: Status ${(err as any).statusCode}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    let hasChanges = false;

    // Handle password change
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        const msg = 'Current password is required to change password';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!formData.newPassword) {
        const msg = 'New password is required';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (formData.newPassword.length < 8) {
        const msg = 'New password must be at least 8 characters';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        const msg = 'New password must contain at least one uppercase letter';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!/[a-z]/.test(formData.newPassword)) {
        const msg = 'New password must contain at least one lowercase letter';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!/[0-9]/.test(formData.newPassword)) {
        const msg = 'New password must contain at least one number';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword)) {
        const msg = 'New password must contain at least one special character';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        const msg = 'New passwords do not match';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      try {
        if (!profile?.id) {
          throw new Error('User ID not found');
        }
        
        await authApi.changePassword({
          userId: profile.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
        
        toast.success('Password changed successfully!');
        hasChanges = true;
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } catch (error: any) {
        console.error('Password change error:', error);
        
        let errorMessage = 'Failed to change password';
        
        if (error && typeof error === 'object') {
          if (error.message && error.message !== 'Bad Request') {
            errorMessage = error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.statusCode === 400) {
            errorMessage = 'Current password is incorrect or new password does not meet requirements';
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
    }

    // Handle email change
    if (formData.email && formData.email.trim() !== profile?.email?.trim()) {
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        const msg = 'Please enter a valid email address';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      try {
        if (!profile?.id) {
          throw new Error('User ID not found');
        }
        
        await authApi.changeEmail({
          userId: profile.id,
          newEmail: formData.email,
        });
        
        toast.success('Email changed successfully!');
        hasChanges = true;
        
        // Update profile with new email
        setProfile(prev => prev ? { ...prev, email: formData.email } : null);
      } catch (error: any) {
        console.error('Email change error:', error);
        
        let errorMessage = 'Failed to change email';
        
        if (error && typeof error === 'object') {
          if (error.message && error.message !== 'Bad Request') {
            errorMessage = error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.statusCode === 400) {
            errorMessage = 'This email is already registered to another account';
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
    }

    // If changes were made, reload profile and exit edit mode
    if (hasChanges) {
      setSuccess('Profile updated successfully!');
      setEditing(false);
      await loadProfile();
    } else {
      // If no changes were made
      toast.info('No changes to save');
      setEditing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <Card>
          <h2>Profile Not Found</h2>
          <p>Unable to load your profile information. Please try logging in again.</p>
          {error && <p className="error-details">{error}</p>}
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Card>
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editing && (
            <Button variant="primary" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {error && <div className="profile-error-message">{error}</div>}
        {success && <div className="profile-success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-field">
              <label>Username</label>
              <Input
                value={profile.username}
                disabled
                fullWidth
              />
            </div>
            <div className="profile-field">
              <label>Role</label>
              <Input
                value={profile.role}
                disabled
                fullWidth
              />
            </div>
            <div className="profile-field">
              <label>Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                required
                fullWidth
              />
            </div>
          </div>

          {editing && (
            <div className="profile-section">
              <h2>Change Password (Optional)</h2>
              <div className="profile-field">
                <label>Current Password</label>
                <Input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  fullWidth
                />
              </div>
              <div className="profile-field">
                <label>New Password</label>
                <Input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  fullWidth
                />
              </div>
              <div className="profile-field">
                <label>Confirm New Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  fullWidth
                />
              </div>
            </div>
          )}

          {editing && (
            <div className="profile-actions">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setSuccess('');
                  loadProfile();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
