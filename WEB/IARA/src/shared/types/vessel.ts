/**
 * Vessel Types
 * Types for vessel entities
 */

export interface VesselCreateRequestDTO {
  internationalNumber: string;
  callSign: string;
  vesselName: string;
  length: number;
  width: number;
  draft: number;
  grossTonnage: number;
  enginePower: number;
  engineTypeId: number;
  ownerId: number;
  captainId: number;
}

export interface VesselUpdateRequestDTO {
  id: number;
  callSign?: string;
  vesselName?: string;
  length?: number;
  width?: number;
  draft?: number;
  grossTonnage?: number;
  enginePower?: number;
  engineTypeId?: number;
  ownerId?: number;
  captainId?: number;
}

export interface VesselFilter {
  id?: number;
  vesselName?: string;
  internationalNumber?: string;
  callSign?: string;
  ownerId?: number;
  captainId?: number;
  engineTypeId?: number;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minGrossTonnage?: number;
  maxGrossTonnage?: number;
  minEnginePower?: number;
  maxEnginePower?: number;
}

export interface VesselResponseDTO {
  id: number;
  internationalNumber: string;
  callSign: string;
  vesselName: string;
  length: number;
  width: number;
  draft: number;
  grossTonnage: number;
  enginePower: number;
  engineTypeId: number;
  ownerId: number;
  captainId: number;
}
