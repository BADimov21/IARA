/**
 * Role-Based Access Control (RBAC) System
 * Defines permissions for each role and module
 */

export type UserRole = 'Admin' | 'User' | 'Inspector';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type Module =
  | 'dashboard'
  | 'users'
  | 'fishSpecies'
  | 'engineTypes'
  | 'fishingGearTypes'
  | 'ticketTypes'
  | 'fishingTrips'
  | 'fishingOperations'
  | 'catches'
  | 'fishingPermits'
  | 'fishingGear'
  | 'landings'
  | 'fishBatches'
  | 'batchLocations'
  | 'inspections'
  | 'inspectors'
  | 'violations'
  | 'persons'
  | 'vessels'
  | 'telkDecisions'
  | 'ticketPurchases'
  | 'recreationalCatches';

/**
 * Role permissions configuration
 * Defines what each role can do for each module
 */
const rolePermissions: Record<UserRole, Record<Module, Permission[]>> = {
  Admin: {
    // Admins have full access to everything
    dashboard: ['view'],
    users: ['view', 'create', 'edit', 'delete'],
    fishSpecies: ['view', 'create', 'edit', 'delete'],
    engineTypes: ['view', 'create', 'edit', 'delete'],
    fishingGearTypes: ['view', 'create', 'edit', 'delete'],
    ticketTypes: ['view', 'create', 'edit', 'delete'],
    fishingTrips: ['view', 'create', 'edit', 'delete'],
    fishingOperations: ['view', 'create', 'edit', 'delete'],
    catches: ['view', 'create', 'edit', 'delete'],
    fishingPermits: ['view', 'create', 'edit', 'delete'],
    fishingGear: ['view', 'create', 'edit', 'delete'],
    landings: ['view', 'create', 'edit', 'delete'],
    fishBatches: ['view', 'create', 'edit', 'delete'],
    batchLocations: ['view', 'create', 'edit', 'delete'],
    inspections: ['view', 'create', 'edit', 'delete'],
    inspectors: ['view', 'create', 'edit', 'delete'],
    violations: ['view', 'create', 'edit', 'delete'],
    persons: ['view', 'create', 'edit', 'delete'],
    vessels: ['view', 'create', 'edit', 'delete'],
    telkDecisions: ['view', 'create', 'edit', 'delete'],
    ticketPurchases: ['view', 'create', 'edit', 'delete'],
    recreationalCatches: ['view', 'create', 'edit', 'delete'],
  },
  Inspector: {
    // Inspectors can register inspections, issue fines, and check vessels/stores
    dashboard: ['view'],
    users: [], // No access to user management
    
    // Nomenclatures - View only
    fishSpecies: ['view'],
    engineTypes: ['view'],
    fishingGearTypes: ['view'],
    ticketTypes: ['view'],
    
    // Fishing - View for verification
    fishingTrips: ['view'],
    fishingOperations: ['view'],
    catches: ['view'],
    fishingPermits: ['view'],
    fishingGear: ['view'],
    
    // Batches - View and check stores/trucks
    landings: ['view'],
    fishBatches: ['view'],
    batchLocations: ['view'],
    
    // Inspections - Full access to register inspections and issue fines
    inspections: ['view', 'create', 'edit', 'delete'],
    inspectors: ['view'], // Can view other inspectors
    violations: ['view', 'create', 'edit', 'delete'], // Can issue fines and penalties
    
    // Registry - View for verification
    persons: ['view'],
    vessels: ['view'],
    telkDecisions: ['view'],
    
    // Recreational Fishing - View to check tickets and catches
    ticketPurchases: ['view'],
    recreationalCatches: ['view'],
  },
  User: {
    // Regular users (fishermen) have limited access
    dashboard: ['view'],
    users: [], // No access to user management
    
    // Nomenclatures - View only
    fishSpecies: ['view'],
    engineTypes: ['view'],
    fishingGearTypes: ['view'],
    ticketTypes: ['view'],
    
    // Fishing - View and create for their own data
    fishingTrips: ['view'],
    fishingOperations: ['view', 'create'], // Can record their own operations
    catches: ['view', 'create'], // Can record their own catches
    fishingPermits: ['view'],
    fishingGear: ['view'],
    
    // Batches - View only
    landings: ['view'],
    fishBatches: ['view'],
    batchLocations: ['view'],
    
    // Inspections - View only
    inspections: ['view'],
    inspectors: [], // No access
    violations: ['view'],
    
    // Registry - View only
    persons: ['view'],
    vessels: ['view'],
    telkDecisions: ['view'],
    
    // Recreational Fishing - Full access to their own tickets and catches
    ticketPurchases: ['view', 'create'], // Can purchase tickets
    recreationalCatches: ['view', 'create', 'edit', 'delete'], // Can manage their own catches
  },
};

/**
 * Check if a user has a specific permission for a module
 */
export const hasPermission = (
  role: UserRole,
  module: Module,
  permission: Permission
): boolean => {
  const modulePermissions = rolePermissions[role]?.[module] || [];
  return modulePermissions.includes(permission);
};

/**
 * Check if a user can view a module
 */
export const canView = (role: UserRole, module: Module): boolean => {
  return hasPermission(role, module, 'view');
};

/**
 * Check if a user can create in a module
 */
export const canCreate = (role: UserRole, module: Module): boolean => {
  return hasPermission(role, module, 'create');
};

/**
 * Check if a user can edit in a module
 */
export const canEdit = (role: UserRole, module: Module): boolean => {
  return hasPermission(role, module, 'edit');
};

/**
 * Check if a user can delete in a module
 */
export const canDelete = (role: UserRole, module: Module): boolean => {
  return hasPermission(role, module, 'delete');
};

/**
 * Get all permissions for a role and module
 */
export const getModulePermissions = (
  role: UserRole,
  module: Module
): Permission[] => {
  return rolePermissions[role]?.[module] || [];
};

/**
 * Check if a user is an admin
 */
export const isAdmin = (role: UserRole): boolean => {
  return role === 'Admin';
};

/**
 * Check if a user has access to a module at all (any permission)
 */
export const hasModuleAccess = (role: UserRole, module: Module): boolean => {
  const permissions = rolePermissions[role]?.[module] || [];
  return permissions.length > 0;
};
