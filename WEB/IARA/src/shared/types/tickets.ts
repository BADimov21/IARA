/**
 * Tickets Module Types
 * Type definitions for recreational catches and ticket purchases
 */

// ==================== Recreational Catch ====================

export interface RecreationalCatchCreateRequestDTO {
  ticketPurchaseId: number;
  personId: number;
  speciesId: number;
  catchDateTime: string;
  location?: string;
  quantity: number;
  weightKg: number;
}

export interface RecreationalCatchFilter {
  id?: number;
  ticketPurchaseId?: number;
  personId?: number;
  speciesId?: number;
  catchDateTimeFrom?: string;
  catchDateTimeTo?: string;
  location?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minWeightKg?: number;
  maxWeightKg?: number;
}

// ==================== Ticket Purchase ====================

export interface TicketPurchaseCreateRequestDTO {
  ticketTypeId: number;
  personId: number;
  purchaseDate: string;
  validFrom: string;
  validUntil: string;
  pricePaid: number;
  telkDecisionId?: number;
}

export interface TicketPurchaseFilter {
  id?: number;
  ticketNumber?: string;
  ticketTypeId?: number;
  personId?: number;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  validFromDate?: string;
  validUntilDate?: string;
  isValid?: boolean;
  minPricePaid?: number;
  maxPricePaid?: number;
  telkDecisionId?: number;
}
