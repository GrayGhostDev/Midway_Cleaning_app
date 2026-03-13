// Re-export from the unified auth module for backwards compatibility.
// New code should import directly from '@/lib/auth'.
export {
  type Role,
  type Permission,
  can,
  canAccess,
  hasRole,
  getRolePermissions,
  roleHierarchy,
  ROLES,
} from '@/lib/auth';

export function checkPermissions(
  role: import('@/lib/auth').Role,
  permissions: import('@/lib/auth').Permission[]
): boolean {
  const { can: canDo } = require('@/lib/auth');
  return permissions.every(({ action, subject }) => canDo(role, action, subject));
}
