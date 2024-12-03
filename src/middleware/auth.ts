import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
    email: string;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<Response>,
  allowedRoles?: UserRole[]
) {
  return async (req: Request) => {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user has required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Add user to request
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = user;

    return handler(authenticatedReq);
  };
}

export function withRole(...roles: UserRole[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => {
    return withAuth(handler, roles);
  };
}

// Example usage:
// export const POST = withRole(UserRole.ADMIN, UserRole.MANAGER)(async (req) => {
//   // Only admins and managers can access this endpoint
//   const { user } = req;
//   // ... handle request
// });
