export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

export const roleHierarchy: Record<UserRole, number> = {
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.EMPLOYEE]: 2,
  [UserRole.CLIENT]: 1,
};

export const rolePermissions: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'manage:users',
    'manage:roles',
    'manage:settings',
    'view:analytics',
    'manage:invoices',
    'manage:schedules',
    'manage:tasks',
    'manage:documents',
    'manage:clients',
  ],
  [UserRole.MANAGER]: [
    'manage:schedules',
    'manage:tasks',
    'manage:invoices',
    'view:analytics',
    'manage:documents',
    'manage:clients',
  ],
  [UserRole.EMPLOYEE]: [
    'view:schedules',
    'view:tasks',
    'manage:assigned_tasks',
    'view:documents',
  ],
  [UserRole.CLIENT]: [
    'view:own_schedules',
    'view:own_invoices',
    'manage:own_documents',
    'manage:own_profile',
  ],
};

export function hasPermission(userRole: UserRole, requiredPermission: string): boolean {
  return rolePermissions[userRole].includes(requiredPermission);
}

export function canAccessRole(userRole: UserRole, targetRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[targetRole];
}
