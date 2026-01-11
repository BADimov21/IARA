/**
 * HTTP Client
 * Utility for making authenticated HTTP requests to the API
 */

import { API_BASE_URL } from './config';
import type { ErrorResponse } from '../types';

// Token storage
const TOKEN_KEY = 'iara_auth_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};

// HTTP Client class
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = tokenStorage.get();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        const text = await response.text();
        console.log('Error response body:', text);
        console.log('Error response status:', response.status);
        console.log('Error response headers:', Object.fromEntries(response.headers.entries()));
        
        // Try to parse as JSON first
        try {
          errorData = JSON.parse(text);
        } catch {
          // If not JSON, use the plain text as the message
          errorData = {
            statusCode: response.status,
            message: text || response.statusText || 'An error occurred',
          };
        }
      } catch {
        errorData = {
          statusCode: response.status,
          message: response.statusText || 'An error occurred',
        };
      }
      throw errorData;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Handle 201 Created with no body
    if (response.status === 201) {
      const text = await response.text();
      return text ? JSON.parse(text) : undefined as T;
    }

    return response.json();
  }

  async get<T>(url: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });
    return this.handleResponse<T>(response);
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    includeAuth: boolean = true
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T, D = unknown>(
    url: string,
    data: D,
    includeAuth: boolean = true
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });
    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const httpClient = new HttpClient(API_BASE_URL);
