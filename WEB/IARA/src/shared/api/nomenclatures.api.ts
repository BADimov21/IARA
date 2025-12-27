/**
 * Nomenclatures API
 * API functions for reference data (fish species, engine types, gear types, ticket types)
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  FishSpecyCreateRequestDTO,
  FishSpecyUpdateRequestDTO,
  FishSpecyFilter,
  EngineTypeCreateRequestDTO,
  EngineTypeUpdateRequestDTO,
  EngineTypeFilter,
  FishingGearTypeCreateRequestDTO,
  FishingGearTypeUpdateRequestDTO,
  FishingGearTypeFilter,
  TicketTypeCreateRequestDTO,
  TicketTypeUpdateRequestDTO,
  TicketTypeFilter,
} from '../types';

// Fish Species API
export const fishSpecyApi = {
  getAll: async (filters: BaseFilter<FishSpecyFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishSpecyFilter>>(
      API_ENDPOINTS.FISH_SPECY.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISH_SPECY.GET}?id=${id}`);
  },

  add: async (data: FishSpecyCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishSpecyCreateRequestDTO>(
      API_ENDPOINTS.FISH_SPECY.ADD,
      data
    );
  },

  edit: async (data: FishSpecyUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishSpecyUpdateRequestDTO>(
      API_ENDPOINTS.FISH_SPECY.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISH_SPECY.DELETE}?id=${id}`);
  },
};

// Engine Type API
export const engineTypeApi = {
  getAll: async (filters: BaseFilter<EngineTypeFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<EngineTypeFilter>>(
      API_ENDPOINTS.ENGINE_TYPE.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.ENGINE_TYPE.GET}?id=${id}`);
  },

  add: async (data: EngineTypeCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, EngineTypeCreateRequestDTO>(
      API_ENDPOINTS.ENGINE_TYPE.ADD,
      data
    );
  },

  edit: async (data: EngineTypeUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, EngineTypeUpdateRequestDTO>(
      API_ENDPOINTS.ENGINE_TYPE.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.ENGINE_TYPE.DELETE}?id=${id}`);
  },
};

// Fishing Gear Type API
export const fishingGearTypeApi = {
  getAll: async (filters: BaseFilter<FishingGearTypeFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<FishingGearTypeFilter>>(
      API_ENDPOINTS.FISHING_GEAR_TYPE.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.FISHING_GEAR_TYPE.GET}?id=${id}`);
  },

  add: async (data: FishingGearTypeCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, FishingGearTypeCreateRequestDTO>(
      API_ENDPOINTS.FISHING_GEAR_TYPE.ADD,
      data
    );
  },

  edit: async (data: FishingGearTypeUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, FishingGearTypeUpdateRequestDTO>(
      API_ENDPOINTS.FISHING_GEAR_TYPE.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.FISHING_GEAR_TYPE.DELETE}?id=${id}`);
  },
};

// Ticket Type API
export const ticketTypeApi = {
  getAll: async (filters: BaseFilter<TicketTypeFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<TicketTypeFilter>>(
      API_ENDPOINTS.TICKET_TYPE.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.TICKET_TYPE.GET}?id=${id}`);
  },

  add: async (data: TicketTypeCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, TicketTypeCreateRequestDTO>(
      API_ENDPOINTS.TICKET_TYPE.ADD,
      data
    );
  },

  edit: async (data: TicketTypeUpdateRequestDTO): Promise<void> => {
    await httpClient.patch<void, TicketTypeUpdateRequestDTO>(
      API_ENDPOINTS.TICKET_TYPE.EDIT,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.TICKET_TYPE.DELETE}?id=${id}`);
  },
};
