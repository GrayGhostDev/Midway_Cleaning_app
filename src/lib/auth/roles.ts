// Re-export from the unified auth module for backwards compatibility.
// New code should import directly from '@/lib/auth'.
export { type Role, ROLES, roleHierarchy, can as hasPermission, hasRole as canAccessRole } from '@/lib/auth';

// Legacy enum-like export for code that imports UserRole as an object constant
export const UserRole = {
  ADMIN: 'ADMIN' as const,
  MANAGER: 'MANAGER' as const,
  CLEANER: 'CLEANER' as const,
  CLIENT: 'CLIENT' as const,
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
