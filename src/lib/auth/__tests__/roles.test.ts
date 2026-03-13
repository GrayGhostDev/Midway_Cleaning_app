import { UserRole, roleHierarchy, hasPermission, canAccessRole } from '../roles';
import { getRolePermissions } from '@/lib/auth';

describe('Roles', () => {
  describe('UserRole enum', () => {
    it('should define all four roles', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
      expect(UserRole.MANAGER).toBe('MANAGER');
      expect(UserRole.CLEANER).toBe('CLEANER');
      expect(UserRole.CLIENT).toBe('CLIENT');
    });
  });

  describe('roleHierarchy', () => {
    it('should assign ADMIN the highest level', () => {
      expect(roleHierarchy[UserRole.ADMIN]).toBe(4);
    });

    it('should assign CLIENT the lowest level', () => {
      expect(roleHierarchy[UserRole.CLIENT]).toBe(1);
    });

    it('should have ascending order from CLIENT to ADMIN', () => {
      expect(roleHierarchy[UserRole.CLIENT]).toBeLessThan(roleHierarchy[UserRole.CLEANER]);
      expect(roleHierarchy[UserRole.CLEANER]).toBeLessThan(roleHierarchy[UserRole.MANAGER]);
      expect(roleHierarchy[UserRole.MANAGER]).toBeLessThan(roleHierarchy[UserRole.ADMIN]);
    });
  });

  describe('getRolePermissions', () => {
    it('should give ADMIN manage-all permission', () => {
      const adminPerms = getRolePermissions('ADMIN');
      expect(adminPerms).toContainEqual({ action: 'manage', subject: 'all' });
    });

    it('should give MANAGER schedule and task management', () => {
      const managerPerms = getRolePermissions('MANAGER');
      expect(managerPerms).toContainEqual({ action: 'manage', subject: 'schedules' });
      expect(managerPerms).toContainEqual({ action: 'manage', subject: 'tasks' });
      expect(managerPerms).toContainEqual({ action: 'manage', subject: 'invoices' });
    });

    it('should give CLEANER read-only permissions', () => {
      const cleanerPerms = getRolePermissions('CLEANER');
      expect(cleanerPerms).toContainEqual({ action: 'read', subject: 'schedules' });
      expect(cleanerPerms).toContainEqual({ action: 'read', subject: 'tasks' });
      expect(cleanerPerms).not.toContainEqual({ action: 'manage', subject: 'schedules' });
    });

    it('should give CLIENT own-resource permissions', () => {
      const clientPerms = getRolePermissions('CLIENT');
      expect(clientPerms).toContainEqual({ action: 'manage', subject: 'own_profile' });
      expect(clientPerms).toContainEqual({ action: 'read', subject: 'invoices' });
      expect(clientPerms).toContainEqual({ action: 'read', subject: 'services' });
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      expect(hasPermission(UserRole.ADMIN, 'manage', 'all')).toBe(true);
      expect(hasPermission(UserRole.MANAGER, 'manage', 'tasks')).toBe(true);
    });

    it('should return true for ADMIN on any action/subject (manage:all)', () => {
      expect(hasPermission(UserRole.ADMIN, 'manage', 'users')).toBe(true);
      expect(hasPermission(UserRole.ADMIN, 'read', 'reports')).toBe(true);
    });

    it('should return false when user lacks the permission', () => {
      expect(hasPermission(UserRole.CLEANER, 'manage', 'users')).toBe(false);
      expect(hasPermission(UserRole.CLIENT, 'manage', 'tasks')).toBe(false);
    });

    it('should handle edge case of non-existent subject', () => {
      expect(hasPermission(UserRole.CLEANER, 'fly', 'helicopter')).toBe(false);
    });
  });

  describe('canAccessRole', () => {
    it('should allow ADMIN to access all roles', () => {
      expect(canAccessRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.MANAGER)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.CLEANER)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.CLIENT)).toBe(true);
    });

    it('should allow MANAGER to access CLEANER and CLIENT', () => {
      expect(canAccessRole(UserRole.MANAGER, UserRole.CLEANER)).toBe(true);
      expect(canAccessRole(UserRole.MANAGER, UserRole.CLIENT)).toBe(true);
    });

    it('should deny MANAGER from accessing ADMIN', () => {
      expect(canAccessRole(UserRole.MANAGER, UserRole.ADMIN)).toBe(false);
    });

    it('should deny CLEANER from accessing MANAGER', () => {
      expect(canAccessRole(UserRole.CLEANER, UserRole.MANAGER)).toBe(false);
    });

    it('should allow same-level access', () => {
      expect(canAccessRole(UserRole.CLEANER, UserRole.CLEANER)).toBe(true);
      expect(canAccessRole(UserRole.CLIENT, UserRole.CLIENT)).toBe(true);
    });
  });
});
