/**
 * Nomenclature Types
 * Types for nomenclature/reference data entities
 */

// ==================== Fish Specy ====================

export interface FishSpecyCreateRequestDTO {
  speciesName: string;
}

export interface FishSpecyUpdateRequestDTO {
  id: number;
  speciesName: string;
}

export interface FishSpecyFilter {
  id?: number;
  speciesName?: string;
}

// ==================== Engine Type ====================

export interface EngineTypeCreateRequestDTO {
  typeName: string;
  averageFuelConsumption: number;
  fuelUnit: string;
}

export interface EngineTypeUpdateRequestDTO {
  id: number;
  typeName?: string;
  averageFuelConsumption?: number;
  fuelUnit?: string;
}

export interface EngineTypeFilter {
  id?: number;
  typeName?: string;
  minAverageFuelConsumption?: number;
  maxAverageFuelConsumption?: number;
  fuelUnit?: string;
}

export interface EngineTypeResponseDTO {
  id: number;
  typeName: string;
  averageFuelConsumption: number;
  fuelUnit: string;
}

// ==================== Fishing Gear Type ====================

export interface FishingGearTypeCreateRequestDTO {
  typeName: string;
}

export interface FishingGearTypeUpdateRequestDTO {
  id: number;
  typeName: string;
}

export interface FishingGearTypeFilter {
  id?: number;
  typeName?: string;
}

// ==================== Ticket Type ====================

export interface TicketTypeCreateRequestDTO {
  typeName: string;
  validityDays: number;
  priceUnder14: number;
  priceAdult: number;
  pricePensioner: number;
  isFreeForDisabled: boolean;
}

export interface TicketTypeUpdateRequestDTO {
  id: number;
  typeName?: string;
  validityDays?: number;
  priceUnder14?: number;
  priceAdult?: number;
  pricePensioner?: number;
  isFreeForDisabled?: boolean;
}

export interface TicketTypeFilter {
  id?: number;
  typeName?: string;
  minValidityDays?: number;
  maxValidityDays?: number;
  minPrice?: number;
  maxPrice?: number;
  isFreeForDisabled?: boolean;
}
