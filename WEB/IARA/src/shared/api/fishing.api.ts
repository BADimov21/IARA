/**
 * Fishing Module API
 * API functions for fishing operations, gear, catches, permits, and trips
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  // Catch
  CatchCreateRequestDTO,
  CatchUpdateRequestDTO,
  CatchFilter,
  // Fishing Gear
  FishingGearCreateRequestDTO,
  FishingGearUpdateRequestDTO,
  FishingGearFilter,
  // Fishing Operation
  FishingOperationCreateRequestDTO,
  FishingOperationCompleteRequestDTO,
  FishingOperationFilter,
  // Fishing Permit
  FishingPermitCreateRequestDTO,
  FishingPermitRevokeRequestDTO,
  FishingPermitFilter,
  // Fishing Trip
  FishingTripCreateRequestDTO,
  FishingTripCompleteRequestDTO,
  FishingTripFilter,
} from '../types';

// Catch API
export const catchApi = {
  getAll: async (filters: BaseFilter<CatchFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<CatchFilter>>(
      API_ENDPOINTS.CATCH.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.CATCH.GET}?id=${id}`);
  },

  add: async (data: CatchCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, CatchCreateRequestDTO>(
      API_ENDPOINTS.CATCH.ADD,
      data
    );
  },

  edit: async (data: CatchUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, CatchUpdateRequestDTO>(
      API_ENDPOINTS.CATCH.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.CATCH.DELETE}?id=${id}`);
  },
};

// Fishing Gear API
export const fishingGearApi = {
  getAll: async (filters: BaseFilter<FishingGearFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishingGearFilter>>(
      API_ENDPOINTS.FISHING_GEAR.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISHING_GEAR.GET}?id=${id}`);
  },

  add: async (data: FishingGearCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishingGearCreateRequestDTO>(
      API_ENDPOINTS.FISHING_GEAR.ADD,
      data
    );
  },

  edit: async (data: FishingGearUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishingGearUpdateRequestDTO>(
      API_ENDPOINTS.FISHING_GEAR.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISHING_GEAR.DELETE}?id=${id}`);
  },
};

// Fishing Operation API
export const fishingOperationApi = {
  getAll: async (filters: BaseFilter<FishingOperationFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishingOperationFilter>>(
      API_ENDPOINTS.FISHING_OPERATION.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISHING_OPERATION.GET}?id=${id}`);
  },

  add: async (data: FishingOperationCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishingOperationCreateRequestDTO>(
      API_ENDPOINTS.FISHING_OPERATION.ADD,
      data
    );
  },

  complete: async (data: FishingOperationCompleteRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishingOperationCompleteRequestDTO>(
      API_ENDPOINTS.FISHING_OPERATION.COMPLETE,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISHING_OPERATION.DELETE}?id=${id}`);
  },
};

// Fishing Permit API
export const fishingPermitApi = {
  getAll: async (filters: BaseFilter<FishingPermitFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishingPermitFilter>>(
      API_ENDPOINTS.FISHING_PERMIT.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISHING_PERMIT.GET}?id=${id}`);
  },

  add: async (data: FishingPermitCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishingPermitCreateRequestDTO>(
      API_ENDPOINTS.FISHING_PERMIT.ADD,
      data
    );
  },

  revoke: async (data: FishingPermitRevokeRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishingPermitRevokeRequestDTO>(
      API_ENDPOINTS.FISHING_PERMIT.REVOKE,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISHING_PERMIT.DELETE}?id=${id}`);
  },
};

// Fishing Trip API
export const fishingTripApi = {
  getAll: async (filters: BaseFilter<FishingTripFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishingTripFilter>>(
      API_ENDPOINTS.FISHING_TRIP.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISHING_TRIP.GET}?id=${id}`);
  },

  add: async (data: FishingTripCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishingTripCreateRequestDTO>(
      API_ENDPOINTS.FISHING_TRIP.ADD,
      data
    );
  },

  complete: async (data: FishingTripCompleteRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishingTripCompleteRequestDTO>(
      API_ENDPOINTS.FISHING_TRIP.COMPLETE,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISHING_TRIP.DELETE}?id=${id}`);
  },
};
