/**
 * Login Component
 * User authentication login form
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { Button, Input } from '../../shared';
import logo from '../../../assets/logo.png';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError] = useState(''); // Reserved for future use
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    // No password length validation on login for security reasons

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
        userName: formData.username,
        password: formData.password,
      });

      if (response) {
        // Redirect to dashboard after successful login
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      // Silent fail - no error messages for security
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <img src={logo} alt="IARA Logo" className="login-logo" />
          <h1 className="login-title">Welcome to EAFA (IARA)</h1>
          <p className="login-subtitle">Fisheries Information System</p>
        </div>
        
        {submitError && (
          <div className="form-error-message">
            {submitError}
          </div>
        )}
        
        <div className="login-form-fields">
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="login-links">
            <a href="/register" className="login-link">
              Don't have an account? Register
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
