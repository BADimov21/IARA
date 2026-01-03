/**
 * API Configuration
 * Central configuration for API base URL and request settings
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTHENTICATION: {
    REGISTER: '/authentication/register',
    LOGIN: '/authentication/login',
    CHANGE_PASSWORD: '/authentication/changepassword',
    CHANGE_EMAIL: '/authentication/changeemail',
  },
  // Users
  USER: {
    GET_ALL: '/user/getall',
    GET: '/user/get',
    DELETE: '/user/delete',
  },
  // Nomenclatures
  FISH_SPECY: {
    GET_ALL: '/fishspecy/getall',
    GET: '/fishspecy/get',
    ADD: '/fishspecy/add',
    EDIT: '/fishspecy/edit',
    DELETE: '/fishspecy/delete',
  },
  ENGINE_TYPE: {
    GET_ALL: '/enginetype/getall',
    GET: '/enginetype/get',
    ADD: '/enginetype/add',
    EDIT: '/enginetype/edit',
    DELETE: '/enginetype/delete',
  },
  FISHING_GEAR_TYPE: {
    GET_ALL: '/fishinggeartype/getall',
    GET: '/fishinggeartype/get',
    ADD: '/fishinggeartype/add',
    EDIT: '/fishinggeartype/edit',
    DELETE: '/fishinggeartype/delete',
  },
  TICKET_TYPE: {
    GET_ALL: '/tickettype/getall',
    GET: '/tickettype/get',
    ADD: '/tickettype/add',
    EDIT: '/tickettype/edit',
    DELETE: '/tickettype/delete',
  },
  // Fishing Module
  CATCH: {
    GET_ALL: '/catch/getall',
    GET: '/catch/get',
    ADD: '/catch/add',
    EDIT: '/catch/edit',
    DELETE: '/catch/delete',
  },
  FISHING_GEAR: {
    GET_ALL: '/fishinggear/getall',
    GET: '/fishinggear/get',
    ADD: '/fishinggear/add',
    EDIT: '/fishinggear/edit',
    DELETE: '/fishinggear/delete',
  },
  FISHING_OPERATION: {
    GET_ALL: '/fishingoperation/getall',
    GET: '/fishingoperation/get',
    ADD: '/fishingoperation/add',
    COMPLETE: '/fishingoperation/complete',
    DELETE: '/fishingoperation/delete',
  },
  FISHING_PERMIT: {
    GET_ALL: '/fishingpermit/getall',
    GET: '/fishingpermit/get',
    ADD: '/fishingpermit/add',
    REVOKE: '/fishingpermit/revoke',
    DELETE: '/fishingpermit/delete',
  },
  FISHING_TRIP: {
    GET_ALL: '/fishingtrip/getall',
    GET: '/fishingtrip/get',
    ADD: '/fishingtrip/add',
    COMPLETE: '/fishingtrip/complete',
    DELETE: '/fishingtrip/delete',
  },
  // Batches Module
  BATCH_LOCATION: {
    GET_ALL: '/batchlocation/getall',
    GET: '/batchlocation/get',
    ADD: '/batchlocation/add',
    DEPART: '/batchlocation/depart',
    DELETE: '/batchlocation/delete',
  },
  FISH_BATCH: {
    GET_ALL: '/fishbatch/getall',
    GET: '/fishbatch/get',
    ADD: '/fishbatch/add',
    EDIT: '/fishbatch/edit',
    DELETE: '/fishbatch/delete',
  },
  LANDING: {
    GET_ALL: '/landing/getall',
    GET: '/landing/get',
    ADD: '/landing/add',
    EDIT: '/landing/edit',
    DELETE: '/landing/delete',
  },
  // Inspections Module
  INSPECTION: {
    GET_ALL: '/inspection/getall',
    GET: '/inspection/get',
    ADD: '/inspection/add',
    EDIT: '/inspection/edit',
    DELETE: '/inspection/delete',
  },
  INSPECTOR: {
    GET_ALL: '/inspector/getall',
    GET: '/inspector/get',
    ADD: '/inspector/add',
    EDIT: '/inspector/edit',
    DELETE: '/inspector/delete',
  },
  VIOLATION: {
    GET_ALL: '/violation/getall',
    GET: '/violation/get',
    ADD: '/violation/add',
    EDIT: '/violation/edit',
    DELETE: '/violation/delete',
  },
  // Persons Module
  PERSON: {
    GET_ALL: '/person/getall',
    GET: '/person/get',
    ADD: '/person/add',
    EDIT: '/person/edit',
    DELETE: '/person/delete',
    REGISTER_INFO: '/person/registerpersoninfo',
    HAS_COMPLETED_INFO: '/person/hascompletedpersonalinfo',
  },
  // TELK Module
  TELK_DECISION: {
    GET_ALL: '/telkdecision/getall',
    GET: '/telkdecision/get',
    ADD: '/telkdecision/add',
    EDIT: '/telkdecision/edit',
    DELETE: '/telkdecision/delete',
  },
  // Tickets Module
  RECREATIONAL_CATCH: {
    GET_ALL: '/recreationalcatch/getall',
    GET: '/recreationalcatch/get',
    ADD: '/recreationalcatch/add',
    EDIT: '/recreationalcatch/edit',
    DELETE: '/recreationalcatch/delete',
  },
  TICKET_PURCHASE: {
    GET_ALL: '/ticketpurchase/getall',
    GET: '/ticketpurchase/get',
    ADD: '/ticketpurchase/add',
    DELETE: '/ticketpurchase/delete',
  },
  // Vessels Module
  VESSEL: {
    GET_ALL: '/vessel/getall',
    GET: '/vessel/get',
    ADD: '/vessel/add',
    EDIT: '/vessel/edit',
    DELETE: '/vessel/delete',
  },
} as const;
