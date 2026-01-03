/**
 * Personal Information Form Component
 * Allows users to register their personal information after account creation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, useToast } from '../../shared';
import { personApi } from '../../../shared/api';
import './PersonalInfoForm.css';

export const PersonalInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    egn: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({
    egn: '',
    phoneNumber: '',
  });

  const validateEGN = (egn: string): boolean => {
    if (!/^\d{10}$/.test(egn)) {
      setErrors(prev => ({ ...prev, egn: 'EGN must be exactly 10 digits' }));
      return false;
    }
    setErrors(prev => ({ ...prev, egn: '' }));
    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Invalid phone number format' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phoneNumber: '' }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (name === 'egn' && errors.egn) {
      setErrors(prev => ({ ...prev, egn: '' }));
    }
    if (name === 'phoneNumber' && errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const isEGNValid = validateEGN(formData.egn);
    const isPhoneValid = validatePhoneNumber(formData.phoneNumber);

    if (!isEGNValid || !isPhoneValid) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert date format
      const dateOfBirth = new Date(formData.dateOfBirth);
      const formattedDate = `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`;

      await personApi.registerPersonInfo({
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        egn: formData.egn,
        dateOfBirth: formattedDate,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      });

      toast.success('Personal information registered successfully!');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to register personal info:', error);
      
      // Parse error message
      let errorMessage = 'Failed to register personal information';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.title) {
        errorMessage = error.title;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="personal-info-page">
      <div className="personal-info-container">
        <Card className="personal-info-card">
          <div className="personal-info-header">
            <h1>🎣 Complete Your Fishing Profile</h1>
            <p>We need some information to link your account to the fishing system</p>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#4338ca' }}>
            <strong>ℹ️ Why do we need this?</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              Your personal information is required by Bulgarian fishing regulations. Your EGN (Единен граждански номер) 
              will be used to track your fishing tickets, permits, and catches. This ensures compliance with fishing laws 
              and helps protect Bulgaria's fish populations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="personal-info-form">
            <div className="form-row">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
                disabled={isSubmitting}
                helperText="Your legal first name"
              />
              <Input
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                fullWidth
                disabled={isSubmitting}
                helperText="Optional"
              />
            </div>

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              helperText="Your legal last name"
            />

            <Input
              label="EGN (Единен граждански номер)"
              name="egn"
              value={formData.egn}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              maxLength={10}
              error={errors.egn}
              placeholder="Enter 10-digit EGN"
              helperText="Your 10-digit personal identification number (e.g., 9001011234)"
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              helperText="Must match your EGN"
              max={new Date().toISOString().split('T')[0]}
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              placeholder="Street, City, Postal Code"
              helperText="Your current residential address"
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              error={errors.phoneNumber}
              placeholder="+359 XX XXX XXXX"
              helperText="Contact number for official communications"
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Registering Your Information...' : '✓ Complete Registration'}
              </Button>
            </div>

            <div className="form-note">
              <p>🔒 <strong>Privacy:</strong> Your personal information is encrypted and securely stored.</p>
              <p>📋 <strong>Usage:</strong> This data is only used for fishing license administration and compliance.</p>
              <p>⚠️ <strong>Required:</strong> All fields marked with * are mandatory for registration.</p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
