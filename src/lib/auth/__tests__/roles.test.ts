import { UserRole, roleHierarchy, rolePermissions, hasPermission, canAccessRole } from '../roles';

describe('Roles', () => {
  describe('UserRole enum', () => {
    it('should define all four roles', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
      expect(UserRole.MANAGER).toBe('MANAGER');
      expect(UserRole.EMPLOYEE).toBe('EMPLOYEE');
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
      expect(roleHierarchy[UserRole.CLIENT]).toBeLessThan(roleHierarchy[UserRole.EMPLOYEE]);
      expect(roleHierarchy[UserRole.EMPLOYEE]).toBeLessThan(roleHierarchy[UserRole.MANAGER]);
      expect(roleHierarchy[UserRole.MANAGER]).toBeLessThan(roleHierarchy[UserRole.ADMIN]);
    });
  });

  describe('rolePermissions', () => {
    it('should give ADMIN all management permissions', () => {
      const adminPerms = rolePermissions[UserRole.ADMIN];

      expect(adminPerms).toContain('manage:users');
      expect(adminPerms).toContain('manage:roles');
      expect(adminPerms).toContain('manage:settings');
      expect(adminPerms).toContain('view:analytics');
    });

    it('should give MANAGER schedule and task management', () => {
      const managerPerms = rolePermissions[UserRole.MANAGER];

      expect(managerPerms).toContain('manage:schedules');
      expect(managerPerms).toContain('manage:tasks');
      expect(managerPerms).toContain('manage:invoices');
    });

    it('should give EMPLOYEE view-only permissions', () => {
      const empPerms = rolePermissions[UserRole.EMPLOYEE];

      expect(empPerms).toContain('view:schedules');
      expect(empPerms).toContain('view:tasks');
      expect(empPerms).not.toContain('manage:schedules');
    });

    it('should give CLIENT own-resource permissions', () => {
      const clientPerms = rolePermissions[UserRole.CLIENT];

      expect(clientPerms).toContain('view:own_schedules');
      expect(clientPerms).toContain('view:own_invoices');
      expect(clientPerms).toContain('manage:own_profile');
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      expect(hasPermission(UserRole.ADMIN, 'manage:users')).toBe(true);
      expect(hasPermission(UserRole.MANAGER, 'manage:tasks')).toBe(true);
    });

    it('should return false when user lacks the permission', () => {
      expect(hasPermission(UserRole.EMPLOYEE, 'manage:users')).toBe(false);
      expect(hasPermission(UserRole.CLIENT, 'manage:tasks')).toBe(false);
    });

    it('should handle edge case of non-existent permission', () => {
      expect(hasPermission(UserRole.ADMIN, 'fly:helicopter')).toBe(false);
    });
  });

  describe('canAccessRole', () => {
    it('should allow ADMIN to access all roles', () => {
      expect(canAccessRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.MANAGER)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.EMPLOYEE)).toBe(true);
      expect(canAccessRole(UserRole.ADMIN, UserRole.CLIENT)).toBe(true);
    });

    it('should allow MANAGER to access EMPLOYEE and CLIENT', () => {
      expect(canAccessRole(UserRole.MANAGER, UserRole.EMPLOYEE)).toBe(true);
      expect(canAccessRole(UserRole.MANAGER, UserRole.CLIENT)).toBe(true);
    });

    it('should deny MANAGER from accessing ADMIN', () => {
      expect(canAccessRole(UserRole.MANAGER, UserRole.ADMIN)).toBe(false);
    });

    it('should deny EMPLOYEE from accessing MANAGER', () => {
      expect(canAccessRole(UserRole.EMPLOYEE, UserRole.MANAGER)).toBe(false);
    });

    it('should allow same-level access', () => {
      expect(canAccessRole(UserRole.EMPLOYEE, UserRole.EMPLOYEE)).toBe(true);
      expect(canAccessRole(UserRole.CLIENT, UserRole.CLIENT)).toBe(true);
    });
  });
});
