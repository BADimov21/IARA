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
    firstName: '',
    middleName: '',
    lastName: '',
    egn: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
  });

  const validateName = (name: string, fieldName: string, required: boolean = true): string => {
    if (!name.trim() && required) {
      return `${fieldName} is required`;
    }
    if (name.trim() && !/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(name)) {
      return `${fieldName} must contain only letters`;
    }
    if (name.trim() && (name.length < 2 || name.length > 50)) {
      return `${fieldName} must be between 2 and 50 characters`;
    }
    return '';
  };

  const validateEGN = (egn: string): string => {
    if (!egn.trim()) {
      return 'UCN (EGN) is required';
    }
    if (!/^\d{10}$/.test(egn)) {
      return 'UCN (EGN) must be exactly 10 digits';
    }
    
    // Validate EGN checksum (Bulgarian EGN validation)
    const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(egn[i]) * weights[i];
    }
    const checksum = sum % 11;
    const expectedChecksum = checksum === 10 ? 0 : checksum;
    const actualChecksum = parseInt(egn[9]);
    
    if (expectedChecksum !== actualChecksum) {
      return 'Invalid UCN (EGN) - checksum verification failed';
    }
    
    return '';
  };

  const validateDateOfBirth = (date: string): string => {
    if (!date) {
      return 'Date of birth is required';
    }
    
    const birthDate = new Date(date);
    const today = new Date();
    
    if (birthDate > today) {
      return 'Date of birth cannot be in the future';
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 14) {
      return 'You must be at least 14 years old to register';
    }
    if (age > 120) {
      return 'Please enter a valid date of birth';
    }
    
    return '';
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) {
      return 'Address is required';
    }
    if (address.length < 10) {
      return 'Please enter a complete address (min 10 characters)';
    }
    if (address.length > 200) {
      return 'Address is too long (max 200 characters)';
    }
    return '';
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    
    // Remove all spaces, dashes, parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Must start with + or digit
    if (!/^[\+\d]/.test(cleanPhone)) {
      return 'Phone number must start with + or a digit';
    }
    
    // Must contain only valid characters
    if (!/^[\+\d]+$/.test(cleanPhone)) {
      return 'Phone number contains invalid characters';
    }
    
    // Check length (between 10 and 15 digits including country code)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return 'Phone number must be between 10 and 15 digits';
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for the field being edited
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Real-time validation for specific fields
    if (name === 'firstName' && value.trim()) {
      const error = validateName(value, 'First name');
      if (error) setErrors(prev => ({ ...prev, firstName: error }));
    }
    
    if (name === 'middleName' && value.trim()) {
      const error = validateName(value, 'Middle name', false);
      if (error) setErrors(prev => ({ ...prev, middleName: error }));
    }
    
    if (name === 'lastName' && value.trim()) {
      const error = validateName(value, 'Last name');
      if (error) setErrors(prev => ({ ...prev, lastName: error }));
    }
    
    if (name === 'egn' && value.trim()) {
      const error = validateEGN(value);
      if (error) setErrors(prev => ({ ...prev, egn: error }));
    }
    
    if (name === 'phoneNumber' && value.trim()) {
      const error = validatePhoneNumber(value);
      if (error) setErrors(prev => ({ ...prev, phoneNumber: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      firstName: validateName(formData.firstName, 'First name'),
      middleName: validateName(formData.middleName, 'Middle name', false),
      lastName: validateName(formData.lastName, 'Last name'),
      egn: validateEGN(formData.egn),
      dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
      address: validateAddress(formData.address),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      const firstError = Object.values(newErrors).find(error => error !== '');
      toast.error(firstError || 'Please fix the validation errors');
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
      
      // Check for validation errors from ASP.NET Core
      if (error && typeof error === 'object') {
        // Check for ASP.NET Core validation errors format
        if (error.errors && typeof error.errors === 'object') {
          const errorFields = Object.keys(error.errors);
          if (errorFields.length > 0) {
            const firstFieldErrors = error.errors[errorFields[0]];
            if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
              errorMessage = firstFieldErrors[0];
            } else if (typeof firstFieldErrors === 'string') {
              errorMessage = firstFieldErrors;
            }
          }
        }
        // Check for specific duplicate error messages
        else if (error.message) {
          const msg = error.message.toLowerCase();
          if (msg.includes('egn') && (msg.includes('exist') || msg.includes('duplicate') || msg.includes('already'))) {
            errorMessage = 'A person with this UCN (EGN) has already been registered.';
          } else if (msg.includes('phone') && (msg.includes('exist') || msg.includes('duplicate') || msg.includes('already'))) {
            errorMessage = 'A person with this phone number has already been registered.';
          } else {
            errorMessage = error.message;
          }
        }
        // Check for error property
        else if (error.error && typeof error.error === 'string') {
          const err = error.error.toLowerCase();
          if (err.includes('egn') && (err.includes('exist') || err.includes('duplicate') || err.includes('already'))) {
            errorMessage = 'A person with this UCN (EGN) has already been registered.';
          } else if (err.includes('phone') && (err.includes('exist') || err.includes('duplicate') || err.includes('already'))) {
            errorMessage = 'A person with this phone number has already been registered.';
          } else {
            errorMessage = error.error;
          }
        }
        // Check for title property
        else if (error.title && typeof error.title === 'string') {
          errorMessage = error.title;
        }
        // Check for 400 Bad Request (likely duplicate)
        else if (error.statusCode === 400 || error.status === 400) {
          errorMessage = 'Registration failed. The UCN (EGN) or phone number may already be registered.';
        }
      }

      toast.error(errorMessage);
      
      // Highlight the relevant field if we know which one has the error
      if (errorMessage.toLowerCase().includes('egn')) {
        setErrors(prev => ({ ...prev, egn: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('phone')) {
        setErrors(prev => ({ ...prev, phoneNumber: errorMessage }));
      }
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
              Your personal information is required by Bulgarian fishing regulations. Your unified civil number (UCN or EGN - Единен граждански номер) 
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
                error={errors.firstName}
                helperText="Your legal first name (letters only)"
              />
              <Input
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                fullWidth
                disabled={isSubmitting}
                error={errors.middleName}
                helperText="Optional (letters only)"
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
              error={errors.lastName}
              helperText="Your legal last name (letters only)"
            />

            <Input
              label="UCN (Unified Civil Number) / EGN (Единен граждански номер)"
              name="egn"
              value={formData.egn}
              onChange={handleChange}
              required
              fullWidth
              disabled={isSubmitting}
              maxLength={10}
              error={errors.egn}
              placeholder="Enter 10-digit UCN (EGN)"
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
              error={errors.dateOfBirth}
              helperText="Must match your UCN (EGN) - minimum age 14"
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
              error={errors.address}
              placeholder="Street, City, Postal Code"
              helperText="Your current residential address (min 10 characters)"
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
