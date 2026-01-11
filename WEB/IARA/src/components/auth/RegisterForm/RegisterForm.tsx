/**
 * Register Component
 * User registration form with comprehensive password validation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { Button, Input, useToast } from '../../shared';
import logo from '../../../assets/logo.png';

import './RegisterForm.css';

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordReqs, setPasswordReqs] = useState<PasswordRequirements>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update password requirements display
    if (name === 'password') {
      setPasswordReqs(checkPasswordRequirements(value));
    }
    
    // Clear errors when user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
    
    // Validate email format as user types (only show error if invalid)
    if (name === 'email' && value.trim()) {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // Password must be at least 8 characters
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      // Must contain at least one uppercase letter
      else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      }
      // Must contain at least one lowercase letter
      else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      }
      // Must contain at least one number
      else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
      // Must contain at least one special character
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character (!@#$%^&*...)';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Show first error in toast
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting registration with:', { userName: formData.username, email: formData.email });
      
      await authApi.register({
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful');
      toast.success('Registration successful! Please complete your personal information.');
      
      // Redirect to personal info form after successful registration
      setTimeout(() => {
        navigate('/personal-info');
      }, 1500);
    } catch (error: any) {
      console.error('Registration failed:', error);
      console.log('Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Registration failed. Please try again.';
      
      // The httpClient throws the error data directly from response.json()
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
        // Check for message property
        else if (error.message && error.message !== 'Bad Request') {
          errorMessage = error.message;
        } 
        // Check for error property
        else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        // Check for title property
        else if (error.title && typeof error.title === 'string') {
          errorMessage = error.title;
        }
        // Check status code to provide appropriate message
        else if (error.statusCode || error.status) {
          const status = error.statusCode || error.status;
          if (status === 400) {
            errorMessage = 'Registration failed. The username or email may already be in use.';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (status === 503) {
            errorMessage = 'Service unavailable. The server may be down.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please contact support if the problem persists.';
          }
        }
      } 
      // Network/connection errors
      else if (typeof error === 'string') {
        if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error;
        }
      }
      // Handle case where error might be a network error object
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection or try again later.';
      }
      
      console.log('Final error message to display:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-header">
          <img src={logo} alt="IARA Logo" className="register-logo" />
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join the EAFA (IARA) Fisheries System</p>
        </div>
        
        <div className="register-form-fields">
          <Input
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            fullWidth
            required
            autoComplete="username"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            required
            autoComplete="new-password"
          />

          {/* Password Requirements Indicator */}
          {formData.password && (
            <div className="password-requirements">
              <p className="requirements-title">Password Requirements:</p>
              <ul className="requirements-list">
                <li className={passwordReqs.minLength ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordReqs.minLength ? '✓' : '○'} At least 8 characters
                </li>
                <li className={passwordReqs.hasUppercase ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordReqs.hasUppercase ? '✓' : '○'} One uppercase letter (A-Z)
                </li>
                <li className={passwordReqs.hasLowercase ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordReqs.hasLowercase ? '✓' : '○'} One lowercase letter (a-z)
                </li>
                <li className={passwordReqs.hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordReqs.hasNumber ? '✓' : '○'} One number (0-9)
                </li>
                <li className={passwordReqs.hasSpecial ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordReqs.hasSpecial ? '✓' : '○'} One special character (!@#$%^&*...)
                </li>
              </ul>
            </div>
          )}

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            fullWidth
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>

          <div className="register-links">
            <a href="/login" className="register-link">
              Already have an account? Login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
