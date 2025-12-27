/**
 * Batches Module Types
 * Type definitions for batch locations, fish batches, and landings
 */

// ==================== Batch Location ====================

export interface BatchLocationCreateRequestDTO {
  batchId: number;
  locationType: string;
  locationName: string;
  arrivedAt: string;
}

export interface BatchLocationDepartRequestDTO {
  id: number;
  departedAt: string;
}

export interface BatchLocationFilter {
  id?: number;
  batchId?: number;
  locationType?: string;
  locationName?: string;
  arrivedAtFrom?: string;
  arrivedAtTo?: string;
  departedAtFrom?: string;
  departedAtTo?: string;
  isCurrentLocation?: boolean;
}

// ==================== Fish Batch ====================

export interface FishBatchCreateRequestDTO {
  landingId: number;
  speciesId: number;
  batchCode: string;
  weightKg: number;
}

export interface FishBatchUpdateRequestDTO {
  id: number;
  batchCode?: string;
  landingId?: number;
  speciesId?: number;
  weightKg?: number;
}

export interface FishBatchFilter {
  id?: number;
  batchCode?: string;
  landingId?: number;
  speciesId?: number;
  minWeightKg?: number;
  maxWeightKg?: number;
  currentLocation?: string;
  hasActiveLocation?: boolean;
}

// ==================== Landing ====================

export interface LandingCreateRequestDTO {
  tripId: number;
  landingDateTime: string;
  port: string;
  fishBatches?: number[];
}

export interface LandingUpdateRequestDTO {
  id: number;
  tripId?: number;
  landingDateTime?: string;
  port?: string;
}

export interface LandingFilter {
  id?: number;
  tripId?: number;
  landingDateTimeFrom?: string;
  landingDateTimeTo?: string;
  port?: string;
}
