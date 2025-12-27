/**
 * Batches Module API
 * API functions for batch locations, fish batches, and landings
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  // Batch Location
  BatchLocationCreateRequestDTO,
  BatchLocationDepartRequestDTO,
  BatchLocationFilter,
  // Fish Batch
  FishBatchCreateRequestDTO,
  FishBatchUpdateRequestDTO,
  FishBatchFilter,
  // Landing
  LandingCreateRequestDTO,
  LandingUpdateRequestDTO,
  LandingFilter,
} from '../types';

// Batch Location API
export const batchLocationApi = {
  getAll: async (filters: BaseFilter<BatchLocationFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<BatchLocationFilter>>(
      API_ENDPOINTS.BATCH_LOCATION.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.BATCH_LOCATION.GET}?id=${id}`);
  },

  add: async (data: BatchLocationCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, BatchLocationCreateRequestDTO>(
      API_ENDPOINTS.BATCH_LOCATION.ADD,
      data
    );
  },

  depart: async (data: BatchLocationDepartRequestDTO): Promise<void> => {
    await httpClient.patch<void, BatchLocationDepartRequestDTO>(
      API_ENDPOINTS.BATCH_LOCATION.DEPART,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.BATCH_LOCATION.DELETE}?id=${id}`);
  },
};

// Fish Batch API
export const fishBatchApi = {
  getAll: async (filters: BaseFilter<FishBatchFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishBatchFilter>>(
      API_ENDPOINTS.FISH_BATCH.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISH_BATCH.GET}?id=${id}`);
  },

  add: async (data: FishBatchCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishBatchCreateRequestDTO>(
      API_ENDPOINTS.FISH_BATCH.ADD,
      data
    );
  },

  edit: async (data: FishBatchUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishBatchUpdateRequestDTO>(
      API_ENDPOINTS.FISH_BATCH.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISH_BATCH.DELETE}?id=${id}`);
  },
};

// Landing API
export const landingApi = {
  getAll: async (filters: BaseFilter<LandingFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<LandingFilter>>(
      API_ENDPOINTS.LANDING.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.LANDING.GET}?id=${id}`);
  },

  add: async (data: LandingCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, LandingCreateRequestDTO>(
      API_ENDPOINTS.LANDING.ADD,
      data
    );
  },

  edit: async (data: LandingUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, LandingUpdateRequestDTO>(
      API_ENDPOINTS.LANDING.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.LANDING.DELETE}?id=${id}`);
  },
};
