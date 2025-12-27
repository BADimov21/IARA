/**
 * API Index
 * Central export for all API functions
 */

// Authentication & User Management
export { authApi, userApi } from './auth.api';

// Nomenclatures (Reference Data)
export {
  fishSpecyApi,
  engineTypeApi,
  fishingGearTypeApi,
  ticketTypeApi,
} from './nomenclatures.api';

// Fishing Module
export {
  catchApi,
  fishingGearApi,
  fishingOperationApi,
  fishingPermitApi,
  fishingTripApi,
} from './fishing.api';

// Batches Module
export {
  batchLocationApi,
  fishBatchApi,
  landingApi,
} from './batches.api';

// Inspections Module
export {
  inspectorApi,
  violationApi,
  inspectionApi,
} from './inspections.api';

// Persons Module
export { personApi } from './persons.api';

// Vessels Module
export { vesselApi } from './vessels.api';

// TELK Module
export { telkDecisionApi } from './telk.api';

// Tickets Module
export {
  recreationalCatchApi,
  ticketPurchaseApi,
} from './tickets.api';

// HTTP Client & Configuration
export { httpClient, tokenStorage } from './httpClient';
export { API_BASE_URL, API_ENDPOINTS } from './config';
