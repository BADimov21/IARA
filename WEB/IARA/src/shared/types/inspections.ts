/**
 * Inspections Module Types
 * Type definitions for inspections, inspectors, and violations
 */

// ==================== Inspector ====================

export interface InspectorCreateRequestDTO {
  personId: number;
  badgeNumber: string;
}

export interface InspectorUpdateRequestDTO {
  id: number;
  personId?: number;
  badgeNumber?: string;
}

export interface InspectorFilter {
  id?: number;
  personId?: number;
  badgeNumber?: string;
  firstName?: string;
  lastName?: string;
}

// ==================== Violation ====================

export interface ViolationCreateRequestDTO {
  inspectionId: number;
  description: string;
  fineAmount: number;
}

export interface ViolationUpdateRequestDTO {
  id: number;
  inspectionId?: number;
  description?: string;
  fineAmount?: number;
}

export interface ViolationFilter {
  id?: number;
  inspectionId?: number;
  description?: string;
  minFineAmount?: number;
  maxFineAmount?: number;
}

// ==================== Inspection ====================

export interface InspectionCreateRequestDTO {
  inspectorId: number;
  inspectionDateTime: string;
  inspectionType: string;
  vesselId?: number;
  batchId?: number;
  ticketPurchaseId?: number;
  isCompliant: boolean;
  violations?: number[];
}

export interface InspectionUpdateRequestDTO {
  id: number;
  inspectorId?: number;
  vesselId?: number;
  inspectionDateTime?: string;
  location?: string;
  notes?: string;
}

export interface InspectionFilter {
  id?: number;
  inspectorId?: number;
  inspectionDateTimeFrom?: string;
  inspectionDateTimeTo?: string;
  inspectionType?: string;
  vesselId?: number;
  batchId?: number;
  ticketPurchaseId?: number;
  isCompliant?: boolean;
  hasViolations?: boolean;
}
