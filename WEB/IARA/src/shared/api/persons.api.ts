/**
 * Persons Module API
 * API functions for person management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  PersonCreateRequestDTO,
  PersonUpdateRequestDTO,
  PersonFilter,
} from '../types';

export const personApi = {
  getAll: async (filters: BaseFilter<PersonFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<PersonFilter>>(
      API_ENDPOINTS.PERSON.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.PERSON.GET}?id=${id}`);
  },

  add: async (data: PersonCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, PersonCreateRequestDTO>(
      API_ENDPOINTS.PERSON.ADD,
      data
    );
  },

  edit: async (data: PersonUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, PersonUpdateRequestDTO>(
      API_ENDPOINTS.PERSON.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.PERSON.DELETE}?id=${id}`);
  },
};
