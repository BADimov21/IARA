/**
 * Vessels Module API
 * API functions for vessel management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  VesselCreateRequestDTO,
  VesselUpdateRequestDTO,
  VesselFilter,
} from '../types';

export const vesselApi = {
  getAll: async (filters: BaseFilter<VesselFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<VesselFilter>>(
      API_ENDPOINTS.VESSEL.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.VESSEL.GET}?id=${id}`);
  },

  add: async (data: VesselCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, VesselCreateRequestDTO>(
      API_ENDPOINTS.VESSEL.ADD,
      data
    );
  },

  edit: async (data: VesselUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, VesselUpdateRequestDTO>(
      API_ENDPOINTS.VESSEL.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.VESSEL.DELETE}?id=${id}`);
  },
};
