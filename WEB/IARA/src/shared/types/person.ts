/**
 * Person Types
 * Types for person entities
 */

export interface PersonCreateRequestDTO {
  firstName: string;
  middleName?: string;
  lastName: string;
  egn?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
}

export interface PersonUpdateRequestDTO {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  egn?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
}

export interface PersonFilter {
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  egn?: string;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  phoneNumber?: string;
  address?: string;
}
