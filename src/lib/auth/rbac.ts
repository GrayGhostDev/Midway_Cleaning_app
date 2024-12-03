export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CLIENT';

export interface Permission {
  action: string;
  subject: string;
}

// Define permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    { action: 'manage', subject: 'all' }, // Admins can do everything
  ],
  MANAGER: [
    { action: 'read', subject: 'dashboard' },
    { action: 'manage', subject: 'tasks' },
    { action: 'manage', subject: 'employees' },
    { action: 'manage', subject: 'locations' },
    { action: 'read', subject: 'reports' },
    { action: 'create', subject: 'reports' },
    { action: 'manage', subject: 'inventory' },
    { action: 'manage', subject: 'schedules' },
  ],
  EMPLOYEE: [
    { action: 'read', subject: 'dashboard' },
    { action: 'read', subject: 'tasks' },
    { action: 'update', subject: 'tasks' },
    { action: 'read', subject: 'locations' },
    { action: 'read', subject: 'inventory' },
    { action: 'read', subject: 'schedules' },
  ],
  CLIENT: [
    { action: 'read', subject: 'dashboard' },
    { action: 'read', subject: 'services' },
    { action: 'create', subject: 'requests' },
    { action: 'read', subject: 'invoices' },
  ],
};

export function can(role: Role, action: string, subject: string): boolean {
  const permissions = rolePermissions[role];
  
  return permissions.some(permission => 
    // Check for exact permission match
    (permission.action === action && permission.subject === subject) ||
    // Check for wildcard permission (manage all)
    (permission.action === 'manage' && permission.subject === 'all') ||
    // Check for manage permission on specific subject
    (permission.action === 'manage' && permission.subject === subject)
  );
}

export function canAccess(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

// Role hierarchy for permission inheritance
export const roleHierarchy: Record<Role, Role[]> = {
  ADMIN: ['ADMIN', 'MANAGER', 'EMPLOYEE', 'CLIENT'],
  MANAGER: ['MANAGER', 'EMPLOYEE'],
  EMPLOYEE: ['EMPLOYEE'],
  CLIENT: ['CLIENT'],
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole].includes(requiredRole);
}

// Helper to get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role];
}

// Helper to check multiple permissions at once
export function checkPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(({ action, subject }) => can(role, action, subject));
}
