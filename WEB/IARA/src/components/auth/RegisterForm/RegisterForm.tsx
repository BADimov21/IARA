/**
 * Register Component
 * User registration form with comprehensive password validation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { Button, Input } from '../../shared';

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
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
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
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      console.log('Attempting registration with:', { userName: formData.username, email: formData.email });
      
      await authApi.register({
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful');
      // Redirect to login on success
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      setSubmitError('Registration failed. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join the IARA Fisheries System</p>
        </div>
        
        {submitError && (
          <div className="form-error-message">
            {submitError}
          </div>
        )}
        
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
