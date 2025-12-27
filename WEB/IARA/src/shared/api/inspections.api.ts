/**
 * Inspections Module API
 * API functions for inspections, inspectors, and violations
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  // Inspector
  InspectorCreateRequestDTO,
  InspectorUpdateRequestDTO,
  InspectorFilter,
  // Violation
  ViolationCreateRequestDTO,
  ViolationUpdateRequestDTO,
  ViolationFilter,
  // Inspection
  InspectionCreateRequestDTO,
  InspectionUpdateRequestDTO,
  InspectionFilter,
} from '../types';

// Inspector API
export const inspectorApi = {
  getAll: async (filters: BaseFilter<InspectorFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<InspectorFilter>>(
      API_ENDPOINTS.INSPECTOR.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.INSPECTOR.GET}?id=${id}`);
  },

  add: async (data: InspectorCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, InspectorCreateRequestDTO>(
      API_ENDPOINTS.INSPECTOR.ADD,
      data
    );
  },

  edit: async (data: InspectorUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, InspectorUpdateRequestDTO>(
      API_ENDPOINTS.INSPECTOR.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.INSPECTOR.DELETE}?id=${id}`);
  },
};

// Violation API
export const violationApi = {
  getAll: async (filters: BaseFilter<ViolationFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<ViolationFilter>>(
      API_ENDPOINTS.VIOLATION.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.VIOLATION.GET}?id=${id}`);
  },

  add: async (data: ViolationCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, ViolationCreateRequestDTO>(
      API_ENDPOINTS.VIOLATION.ADD,
      data
    );
  },

  edit: async (data: ViolationUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, ViolationUpdateRequestDTO>(
      API_ENDPOINTS.VIOLATION.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.VIOLATION.DELETE}?id=${id}`);
  },
};

// Inspection API
export const inspectionApi = {
  getAll: async (filters: BaseFilter<InspectionFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<InspectionFilter>>(
      API_ENDPOINTS.INSPECTION.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.INSPECTION.GET}?id=${id}`);
  },

  add: async (data: InspectionCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, InspectionCreateRequestDTO>(
      API_ENDPOINTS.INSPECTION.ADD,
      data
    );
  },

  edit: async (data: InspectionUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, InspectionUpdateRequestDTO>(
      API_ENDPOINTS.INSPECTION.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.INSPECTION.DELETE}?id=${id}`);
  },
};
