/**
 * TELK Module API
 * API functions for TELK decisions
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  TELKDecisionCreateRequestDTO,
  TELKDecisionUpdateRequestDTO,
  TELKDecisionFilter,
} from '../types';

export const telkDecisionApi = {
  getAll: async (filters: BaseFilter<TELKDecisionFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<TELKDecisionFilter>>(
      API_ENDPOINTS.TELK_DECISION.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.TELK_DECISION.GET}?id=${id}`);
  },

  add: async (data: TELKDecisionCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, TELKDecisionCreateRequestDTO>(
      API_ENDPOINTS.TELK_DECISION.ADD,
      data
    );
  },

  edit: async (data: TELKDecisionUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, TELKDecisionUpdateRequestDTO>(
      API_ENDPOINTS.TELK_DECISION.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.TELK_DECISION.DELETE}?id=${id}`);
  },
};
