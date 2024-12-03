import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { Role, can } from './rbac';
import { AuthError } from '@/hooks/use-auth';

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requiredRoles?: Role[];
    requiredPermissions?: { action: string; subject: string }[];
  }
) {
  return async function authMiddleware(req: NextRequest) {
    try {
      const token = await getToken({ req });

      if (!token) {
        throw new AuthError('Unauthorized', 'UNAUTHORIZED');
      }

      // Add user information to the request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: token.sub!,
        email: token.email as string,
        role: token.role as Role,
      };

      // Check role-based access
      if (options?.requiredRoles && !options.requiredRoles.includes(token.role as Role)) {
        throw new AuthError('Forbidden: Insufficient role', 'FORBIDDEN');
      }

      // Check permissions
      if (options?.requiredPermissions) {
        const hasPermissions = options.requiredPermissions.every(({ action, subject }) =>
          can(token.role as Role, action, subject)
        );

        if (!hasPermissions) {
          throw new AuthError('Forbidden: Insufficient permissions', 'FORBIDDEN');
        }
      }

      return handler(authenticatedReq);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.code === 'UNAUTHORIZED' ? 401 : 403 }
        );
      }

      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Helper function to protect API routes with specific permissions
export function withPermission(action: string, subject: string) {
  return function (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(handler, {
      requiredPermissions: [{ action, subject }],
    });
  };
}

// Helper function to protect API routes with specific roles
export function withRole(...roles: Role[]) {
  return function (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(handler, {
      requiredRoles: roles,
    });
  };
}

// Example usage:
// export const GET = withPermission('read', 'tasks')(async function handler(req) {
//   // Your handler code here
// });
//
// export const POST = withRole('ADMIN', 'MANAGER')(async function handler(req) {
//   // Your handler code here
// });
