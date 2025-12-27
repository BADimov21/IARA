/**
 * ProfilePage Component
 * User profile page for viewing and editing user information
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { userApi } from '../../../shared/api';
import { Button, Input, Card, Loading } from '../../shared';
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
      console.error('Failed to load profile:', err);
      setError(`Failed to load profile: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password change if provided
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
    }

    try {
      // Update profile - API endpoint needs to be implemented
      if (profile) {
        console.log('Profile update would be sent:', {
          id: profile.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
        
        // TODO: Implement when API is ready
        // await userApi.edit({...});
        
        setSuccess('Profile updated successfully');
        setEditing(false);
        loadProfile();
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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
