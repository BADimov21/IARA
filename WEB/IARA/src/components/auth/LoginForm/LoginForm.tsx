/**
 * Login Component
 * User authentication login form
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { Button, Input, useToast } from '../../shared';
import logo from '../../../assets/logo.png';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields');
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
      const response = await authApi.login({
        userName: formData.username,
        password: formData.password,
      });

      if (response) {
        toast.success('Login successful!');
        // Redirect to dashboard after successful login
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      console.log('Error details:', {
        response: error?.response,
        data: error?.response?.data,
        message: error?.message
      });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error && typeof error === 'object') {
        const data = error;
        
        // Check for specific error messages
        if (data.message && data.message !== 'Bad Request') {
          errorMessage = data.message;
        } else if (data.error && typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.title && typeof data.title === 'string') {
          errorMessage = data.title;
        } 
        // Check status code
        else if (data.statusCode || data.status) {
          const status = data.statusCode || data.status;
          if (status === 400 || status === 401) {
            errorMessage = 'Invalid username or password';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (status === 503) {
            errorMessage = 'Service unavailable. The server may be down.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please contact support if the problem persists.';
          }
        }
      } else if (typeof error === 'string') {
        if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error;
        }
      }
      
      // Handle network/connection errors
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection or try again later.';
      }
      
      toast.error(errorMessage);
      
      // Clear password field for security
      setFormData(prev => ({ ...prev, password: '' }));
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
