import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// ─── Unified Role System ─────────────────────────────────────────────
// Single source of truth for roles across the entire application.
// Matches the Prisma UserRole enum (ADMIN, MANAGER, CLEANER, CLIENT).

export type Role = 'ADMIN' | 'MANAGER' | 'CLEANER' | 'CLIENT';

export const ROLES = {
  ADMIN: 'ADMIN' as Role,
  MANAGER: 'MANAGER' as Role,
  CLEANER: 'CLEANER' as Role,
  CLIENT: 'CLIENT' as Role,
} as const;

export const roleHierarchy: Record<Role, number> = {
  ADMIN: 4,
  MANAGER: 3,
  CLEANER: 2,
  CLIENT: 1,
};

export interface Permission {
  action: string;
  subject: string;
}

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [{ action: 'manage', subject: 'all' }],
  MANAGER: [
    { action: 'read', subject: 'dashboard' },
    { action: 'manage', subject: 'tasks' },
    { action: 'manage', subject: 'employees' },
    { action: 'manage', subject: 'locations' },
    { action: 'read', subject: 'reports' },
    { action: 'create', subject: 'reports' },
    { action: 'manage', subject: 'inventory' },
    { action: 'manage', subject: 'schedules' },
    { action: 'manage', subject: 'invoices' },
    { action: 'manage', subject: 'clients' },
    { action: 'manage', subject: 'documents' },
    { action: 'view', subject: 'analytics' },
  ],
  CLEANER: [
    { action: 'read', subject: 'dashboard' },
    { action: 'read', subject: 'tasks' },
    { action: 'update', subject: 'tasks' },
    { action: 'read', subject: 'locations' },
    { action: 'read', subject: 'inventory' },
    { action: 'read', subject: 'schedules' },
    { action: 'read', subject: 'documents' },
  ],
  CLIENT: [
    { action: 'read', subject: 'dashboard' },
    { action: 'read', subject: 'services' },
    { action: 'create', subject: 'requests' },
    { action: 'read', subject: 'invoices' },
    { action: 'manage', subject: 'own_profile' },
    { action: 'manage', subject: 'own_documents' },
  ],
};

// ─── Permission Helpers ──────────────────────────────────────────────

export function can(role: Role, action: string, subject: string): boolean {
  const perms = rolePermissions[role];
  return perms.some(
    (p) =>
      (p.action === action && p.subject === subject) ||
      (p.action === 'manage' && p.subject === 'all') ||
      (p.action === 'manage' && p.subject === subject)
  );
}

export function canAccess(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role];
}

// ─── Clerk Auth Helpers (Server Components / API Routes) ─────────────

export async function getAuthUser() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  let role = (sessionClaims?.metadata as { role?: Role })?.role;

  // Development fallback: when no role is stored in Clerk metadata yet,
  // default to ADMIN so every feature is accessible during local dev.
  // Override via DEV_DEFAULT_ROLE env var (e.g. DEV_DEFAULT_ROLE=MANAGER).
  if (!role && process.env.NODE_ENV === 'development') {
    role = (process.env.DEV_DEFAULT_ROLE as Role) ?? 'ADMIN';
  }

  return { userId, role: (role ?? 'CLIENT') as Role };
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new AuthError('Unauthorized', 'UNAUTHORIZED');
  }
  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (!canAccess(user.role, roles)) {
    throw new AuthError('Forbidden: Insufficient role', 'FORBIDDEN');
  }
  return user;
}

// ─── API Route Auth Wrapper ──────────────────────────────────────────

export function withApiAuth(
  handler: (req: Request, authUser: { userId: string; role: Role }) => Promise<Response>,
  options?: { requiredRoles?: Role[] }
) {
  return async (req: Request, context?: unknown) => {
    try {
      const user = await requireAuth();

      if (options?.requiredRoles && !canAccess(user.role, options.requiredRoles)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return handler(req, user);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.code === 'UNAUTHORIZED' ? 401 : 403 }
        );
      }
      console.error('Auth error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// ─── Error Class ─────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_CREDENTIALS' = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
