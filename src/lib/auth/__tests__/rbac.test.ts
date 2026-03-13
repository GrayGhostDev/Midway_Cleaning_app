import { can, canAccess, hasRole, getRolePermissions, checkPermissions, roleHierarchy } from '../rbac';
import type { Role } from '../rbac';

describe('RBAC', () => {
  describe('can', () => {
    it('should allow ADMIN to do anything', () => {
      expect(can('ADMIN', 'manage', 'all')).toBe(true);
      expect(can('ADMIN', 'read', 'dashboard')).toBe(true);
      expect(can('ADMIN', 'delete', 'users')).toBe(true);
    });

    it('should allow MANAGER to manage tasks', () => {
      expect(can('MANAGER', 'manage', 'tasks')).toBe(true);
      expect(can('MANAGER', 'read', 'tasks')).toBe(true);
    });

    it('should allow MANAGER to manage employees', () => {
      expect(can('MANAGER', 'manage', 'employees')).toBe(true);
    });

    it('should allow MANAGER to read and create reports', () => {
      expect(can('MANAGER', 'read', 'reports')).toBe(true);
      expect(can('MANAGER', 'create', 'reports')).toBe(true);
    });

    it('should deny MANAGER from managing all', () => {
      expect(can('MANAGER', 'manage', 'all')).toBe(false);
    });

    it('should allow EMPLOYEE to read tasks', () => {
      expect(can('EMPLOYEE', 'read', 'tasks')).toBe(true);
    });

    it('should allow EMPLOYEE to update tasks', () => {
      expect(can('EMPLOYEE', 'update', 'tasks')).toBe(true);
    });

    it('should deny EMPLOYEE from managing tasks', () => {
      expect(can('EMPLOYEE', 'manage', 'tasks')).toBe(false);
    });

    it('should allow CLIENT to read services', () => {
      expect(can('CLIENT', 'read', 'services')).toBe(true);
    });

    it('should allow CLIENT to create requests', () => {
      expect(can('CLIENT', 'create', 'requests')).toBe(true);
    });

    it('should deny CLIENT from managing anything', () => {
      expect(can('CLIENT', 'manage', 'tasks')).toBe(false);
      expect(can('CLIENT', 'manage', 'employees')).toBe(false);
    });
  });

  describe('canAccess', () => {
    it('should return true when user role is in required roles', () => {
      expect(canAccess('ADMIN', ['ADMIN', 'MANAGER'])).toBe(true);
    });

    it('should return false when user role is not in required roles', () => {
      expect(canAccess('CLIENT', ['ADMIN', 'MANAGER'])).toBe(false);
    });

    it('should handle single required role', () => {
      expect(canAccess('EMPLOYEE', ['EMPLOYEE'])).toBe(true);
    });
  });

  describe('hasRole', () => {
    it('should return true for ADMIN checking any role', () => {
      expect(hasRole('ADMIN', 'ADMIN')).toBe(true);
      expect(hasRole('ADMIN', 'MANAGER')).toBe(true);
      expect(hasRole('ADMIN', 'EMPLOYEE')).toBe(true);
      expect(hasRole('ADMIN', 'CLIENT')).toBe(true);
    });

    it('should return true for MANAGER checking EMPLOYEE', () => {
      expect(hasRole('MANAGER', 'EMPLOYEE')).toBe(true);
    });

    it('should return false for EMPLOYEE checking MANAGER', () => {
      expect(hasRole('EMPLOYEE', 'MANAGER')).toBe(false);
    });

    it('should return false for CLIENT checking ADMIN', () => {
      expect(hasRole('CLIENT', 'ADMIN')).toBe(false);
    });

    it('should always return true for same role', () => {
      const roles: Role[] = ['ADMIN', 'MANAGER', 'EMPLOYEE', 'CLIENT'];
      roles.forEach(role => {
        expect(hasRole(role, role)).toBe(true);
      });
    });
  });

  describe('getRolePermissions', () => {
    it('should return ADMIN permissions with manage all', () => {
      const perms = getRolePermissions('ADMIN');

      expect(perms).toContainEqual({ action: 'manage', subject: 'all' });
    });

    it('should return MANAGER permissions', () => {
      const perms = getRolePermissions('MANAGER');

      expect(perms.length).toBeGreaterThan(0);
      expect(perms).toContainEqual({ action: 'manage', subject: 'tasks' });
    });

    it('should return CLIENT permissions', () => {
      const perms = getRolePermissions('CLIENT');

      expect(perms.length).toBeGreaterThan(0);
      expect(perms).toContainEqual({ action: 'read', subject: 'invoices' });
    });
  });

  describe('checkPermissions', () => {
    it('should return true when all permissions are satisfied', () => {
      const result = checkPermissions('MANAGER', [
        { action: 'read', subject: 'dashboard' },
        { action: 'manage', subject: 'tasks' },
      ]);

      expect(result).toBe(true);
    });

    it('should return false when any permission is not satisfied', () => {
      const result = checkPermissions('EMPLOYEE', [
        { action: 'read', subject: 'tasks' },
        { action: 'manage', subject: 'employees' },
      ]);

      expect(result).toBe(false);
    });

    it('should return true for empty permissions array', () => {
      expect(checkPermissions('CLIENT', [])).toBe(true);
    });
  });

  describe('roleHierarchy', () => {
    it('should define correct hierarchy', () => {
      expect(roleHierarchy.ADMIN).toContain('ADMIN');
      expect(roleHierarchy.ADMIN).toContain('MANAGER');
      expect(roleHierarchy.ADMIN).toContain('EMPLOYEE');
      expect(roleHierarchy.ADMIN).toContain('CLIENT');
      expect(roleHierarchy.MANAGER).not.toContain('ADMIN');
      expect(roleHierarchy.EMPLOYEE).not.toContain('MANAGER');
      expect(roleHierarchy.CLIENT).toEqual(['CLIENT']);
    });
  });
});
