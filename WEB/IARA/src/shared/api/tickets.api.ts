/**
 * Tickets Module API
 * API functions for recreational catches and ticket purchases
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import type {
  BaseFilter,
  // Recreational Catch
  RecreationalCatchCreateRequestDTO,
  RecreationalCatchFilter,
  // Ticket Purchase
  TicketPurchaseCreateRequestDTO,
  TicketPurchaseFilter,
} from '../types';

// Recreational Catch API
export const recreationalCatchApi = {
  getAll: async (filters: BaseFilter<RecreationalCatchFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<RecreationalCatchFilter>>(
      API_ENDPOINTS.RECREATIONAL_CATCH.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.RECREATIONAL_CATCH.GET}?id=${id}`);
  },

  add: async (data: RecreationalCatchCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, RecreationalCatchCreateRequestDTO>(
      API_ENDPOINTS.RECREATIONAL_CATCH.ADD,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.RECREATIONAL_CATCH.DELETE}?id=${id}`);
  },
};

// Ticket Purchase API
export const ticketPurchaseApi = {
  getAll: async (filters: BaseFilter<TicketPurchaseFilter>): Promise<any[]> => {
    return httpClient.post<any[], BaseFilter<TicketPurchaseFilter>>(
      API_ENDPOINTS.TICKET_PURCHASE.GET_ALL,
      filters
    );
  },

  get: async (id: number): Promise<any> => {
    return httpClient.get<any>(`${API_ENDPOINTS.TICKET_PURCHASE.GET}?id=${id}`);
  },

  add: async (data: TicketPurchaseCreateRequestDTO): Promise<number> => {
    return httpClient.post<number, TicketPurchaseCreateRequestDTO>(
      API_ENDPOINTS.TICKET_PURCHASE.ADD,
      data
    );
  },

  delete: async (id: number): Promise<boolean> => {
    return httpClient.delete<boolean>(`${API_ENDPOINTS.TICKET_PURCHASE.DELETE}?id=${id}`);
  },
};
