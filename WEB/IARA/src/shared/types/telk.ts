/**
 * TELK Module Types
 * Type definitions for TELK decisions
 */

export interface TELKDecisionCreateRequestDTO {
  personId: number;
  decisionNumber: string;
  issueDate: string;
  validUntil?: string;
}

export interface TELKDecisionUpdateRequestDTO {
  id: number;
  validUntil?: string;
}

export interface TELKDecisionFilter {
  id?: number;
  personId?: number;
  decisionNumber?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  validUntilFrom?: string;
  validUntilTo?: string;
  isValid?: boolean;
}
