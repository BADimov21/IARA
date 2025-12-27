/**
 * Authentication Types
 * Types for authentication and user management
 */

// Request DTOs
export interface RegisterRequestDTO {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequestDTO {
  userName: string;
  password: string;
}

// Response DTOs
export interface AuthenticationResponseDTO {
  accessToken: string;
  expiresAtUtc: string;
  userName: string;
  roles: string[];
}

export interface UserResponseDTO {
  userId: string;
  username: string;
  email: string;
  userType: string;
  personId?: number;
  isActive: boolean;
  createdDate: string;
  lastLoginDate?: string;
}

// Filters
export interface UserFilter {
  userId?: string;
  username?: string;
  email?: string;
  userType?: string;
  personId?: number;
  isActive?: boolean;
  createdDateFrom?: string;
  createdDateTo?: string;
  lastLoginDateFrom?: string;
  lastLoginDateTo?: string;
}
