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

interface UserPersonInfoRequestDTO {
  firstName: string;
  middleName?: string;
  lastName: string;
  egn: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
}

interface PersonalInfoStatusResponse {
  hasCompleted: boolean;
  personId: number | null;
}

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

  registerPersonInfo: async (data: UserPersonInfoRequestDTO): Promise<{ personId: number; message: string }> => {
    return httpClient.post<{ personId: number; message: string }, UserPersonInfoRequestDTO>(
      API_ENDPOINTS.PERSON.REGISTER_INFO,
      data
    );
  },

  hasCompletedPersonalInfo: async (): Promise<PersonalInfoStatusResponse> => {
    return httpClient.get<PersonalInfoStatusResponse>(
      API_ENDPOINTS.PERSON.HAS_COMPLETED_INFO
    );
  },
};
