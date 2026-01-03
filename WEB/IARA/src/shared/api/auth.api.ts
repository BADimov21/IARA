/**
 * Authentication API
 * API functions for user authentication and management
 */

import { httpClient, tokenStorage } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  RegisterRequestDTO,
  LoginRequestDTO,
  AuthenticationResponseDTO,
  UserResponseDTO,
  UserFilter,
  BaseFilter,
} from '../types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequestDTO): Promise<void> => {
    await httpClient.post<void, RegisterRequestDTO>(
      API_ENDPOINTS.AUTHENTICATION.REGISTER,
      data,
      false
    );
  },

  /**
   * Login and receive JWT token
   */
  login: async (data: LoginRequestDTO): Promise<AuthenticationResponseDTO> => {
    const response = await httpClient.post<AuthenticationResponseDTO, LoginRequestDTO>(
      API_ENDPOINTS.AUTHENTICATION.LOGIN,
      data,
      false
    );
    
    // Store token
    if (response.accessToken) {
      tokenStorage.set(response.accessToken);
    }
    
    return response;
  },

  /**
   * Logout (clear token)
   */
  logout: (): void => {
    tokenStorage.remove();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.get() !== null;
  },
  
  /**
   * Change user password
   */
  changePassword: async (data: { userId: string; currentPassword: string; newPassword: string }): Promise<void> => {
    await httpClient.post<void, typeof data>(
      API_ENDPOINTS.AUTHENTICATION.CHANGE_PASSWORD,
      data,
      true
    );
  },
  
  /**
   * Change user email
   */
  changeEmail: async (data: { userId: string; newEmail: string }): Promise<void> => {
    await httpClient.post<void, typeof data>(
      API_ENDPOINTS.AUTHENTICATION.CHANGE_EMAIL,
      data,
      true
    );
  },
};

export const userApi = {
  /**
   * Get all users with filtering and pagination
   */
  getAll: async (filters: BaseFilter<UserFilter>): Promise<UserResponseDTO[]> => {
    return httpClient.post<UserResponseDTO[], BaseFilter<UserFilter>>(
      API_ENDPOINTS.USER.GET_ALL,
      filters
    );
  },

  /**
   * Get user by ID
   */
  get: async (id: string): Promise<UserResponseDTO> => {
    return httpClient.get<UserResponseDTO>(`${API_ENDPOINTS.USER.GET}?id=${id}`);
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id: string): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.USER.DELETE}?id=${id}`);
  },
};
