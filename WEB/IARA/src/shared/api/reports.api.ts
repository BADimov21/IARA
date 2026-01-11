import { httpClient } from './httpClient';

const ENDPOINTS = {
  REPORTS: {
    EXPIRING_PERMITS: '/Report/GetVesselsWithExpiringPermits',
    FISHERMEN_RANKING: '/Report/GetRecreationalFishermenRanking',
    VESSEL_STATISTICS: '/Report/GetVesselStatistics',
    CARBON_FOOTPRINT: '/Report/GetVesselCarbonFootprint',
  },
};

export interface VesselExpiringPermit {
  vesselId: number;
  vesselName: string;
  internationalNumber: string;
  ownerName: string;
  permitNumber: string;
  validUntil: string;
  daysUntilExpiration: number;
}

export interface RecreationalFishermenRanking {
  personId: number;
  fisherName: string;
  totalCatches: number;
  totalWeightKg: number;
  rank: number;
}

export interface VesselStatistics {
  vesselId: number;
  vesselName: string;
  internationalNumber: string;
  averageTripDuration: number | null;
  minTripDuration: number | null;
  maxTripDuration: number | null;
  averageCatchPerTrip: number | null;
  minCatchPerTrip: number | null;
  maxCatchPerTrip: number | null;
  totalTrips: number;
  totalCatchWeightKg: number;
  rank: number;
}

export interface VesselCarbonFootprint {
  vesselId: number;
  vesselName: string;
  internationalNumber: string;
  engineTypeName: string;
  totalFuelConsumed: number;
  totalCatchWeightKg: number;
  totalTripHours: number;
  carbonFootprintPerKg: number;
  rank: number;
}

export const reportsApi = {
  getExpiringPermits: async (): Promise<VesselExpiringPermit[]> => {
    return httpClient.get<VesselExpiringPermit[]>(ENDPOINTS.REPORTS.EXPIRING_PERMITS);
  },

  getFishermenRanking: async (): Promise<RecreationalFishermenRanking[]> => {
    return httpClient.get<RecreationalFishermenRanking[]>(ENDPOINTS.REPORTS.FISHERMEN_RANKING);
  },

  getVesselStatistics: async (year: number = 2025): Promise<VesselStatistics[]> => {
    return httpClient.get<VesselStatistics[]>(`${ENDPOINTS.REPORTS.VESSEL_STATISTICS}?year=${year}`);
  },

  getCarbonFootprint: async (year: number = 2025): Promise<VesselCarbonFootprint[]> => {
    return httpClient.get<VesselCarbonFootprint[]>(`${ENDPOINTS.REPORTS.CARBON_FOOTPRINT}?year=${year}`);
  },
};
