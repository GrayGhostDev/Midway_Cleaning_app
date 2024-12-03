import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole, hasPermission } from './roles';

export async function withAuth(
  request: NextRequest,
  requiredPermissions?: string[],
  requiredRole?: UserRole
) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = token.role as UserRole;

    if (requiredRole && userRole !== requiredRole) {
      return NextResponse.json(
        { error: 'Insufficient role permissions' },
        { status: 403 }
      );
    }

    if (requiredPermissions) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        hasPermission(userRole, permission)
      );

      if (!hasAllPermissions) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export function withPermissions(permissions: string[]) {
  return async (request: NextRequest) => {
    return withAuth(request, permissions);
  };
}

export function withRole(role: UserRole) {
  return async (request: NextRequest) => {
    return withAuth(request, undefined, role);
  };
}
