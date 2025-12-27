/**
 * Common Types
 * Shared interfaces and types used across the application
 */

// Base filter for pagination and search
export interface BaseFilter<T> {
  page?: number;
  pageSize?: number;
  freeTextSearch?: string;
  filters?: T;
}

// Common nomenclature DTO
export interface NomenclatureDTO {
  id: number;
  name: string;
}

// .NET ProblemDetails standard error response
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

// Error response from API
export interface ErrorResponse {
  statusCode: number;
  message: string;
  detail?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
  success: boolean;
}
