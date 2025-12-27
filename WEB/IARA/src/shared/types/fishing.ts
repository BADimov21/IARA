/**
 * Fishing Module Types
 * Types for fishing operations, trips, permits, gear, and catches
 */

// ==================== Catch ====================

export interface CatchCreateRequestDTO {
  operationId: number;
  speciesId: number;
  quantity: number;
  weightKg: number;
}

export interface CatchUpdateRequestDTO {
  id: number;
  operationId?: number;
  speciesId?: number;
  quantity?: number;
  weightKg?: number;
}

export interface CatchFilter {
  id?: number;
  operationId?: number;
  speciesId?: number;
  minQuantity?: number;
  maxQuantity?: number;
  minWeightKg?: number;
  maxWeightKg?: number;
}

// ==================== Fishing Gear ====================

export interface FishingGearCreateRequestDTO {
  gearTypeId: number;
  meshSize?: number;
  length?: number;
}

export interface FishingGearUpdateRequestDTO {
  id: number;
  gearTypeId?: number;
  meshSize?: number;
  length?: number;
}

export interface FishingGearFilter {
  id?: number;
  gearTypeId?: number;
  minMeshSize?: number;
  maxMeshSize?: number;
  minLength?: number;
  maxLength?: number;
}

// ==================== Fishing Operation ====================

export interface FishingOperationCreateRequestDTO {
  tripId: number;
  fishingGearId: number;
  startDateTime: string;
  location?: string;
}

export interface FishingOperationCompleteRequestDTO {
  id: number;
  endDateTime: string;
  catches?: number[];
}

export interface FishingOperationFilter {
  id?: number;
  tripId?: number;
  fishingGearId?: number;
  startDateTimeFrom?: string;
  startDateTimeTo?: string;
  endDateTimeFrom?: string;
  endDateTimeTo?: string;
  location?: string;
  isCompleted?: boolean;
}

// ==================== Fishing Permit ====================

export interface FishingPermitCreateRequestDTO {
  permitNumber: string;
  vesselId: number;
  issueDate: string;
  validFrom: string;
  validUntil: string;
  fishingGearIds?: number[];
}

export interface FishingPermitRevokeRequestDTO {
  id: number;
  revokeReason: string;
}

export interface FishingPermitFilter {
  id?: number;
  permitNumber?: string;
  vesselId?: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  validFromDate?: string;
  validUntilDate?: string;
  isRevoked?: boolean;
  isValid?: boolean;
}

// ==================== Fishing Trip ====================

export interface FishingTripCreateRequestDTO {
  vesselId: number;
  permitId: number;
  departureDateTime: string;
  departurePort: string;
}

export interface FishingTripCompleteRequestDTO {
  id: number;
  arrivalDateTime: string;
  arrivalPort: string;
}

export interface FishingTripFilter {
  id?: number;
  vesselId?: number;
  permitId?: number;
  departureDateTimeFrom?: string;
  departureDateTimeTo?: string;
  departurePort?: string;
  arrivalDateTimeFrom?: string;
  arrivalDateTimeTo?: string;
  arrivalPort?: string;
  isCompleted?: boolean;
  minDurationHours?: number;
  maxDurationHours?: number;
}
