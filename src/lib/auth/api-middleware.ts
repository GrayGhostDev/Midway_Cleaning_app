// Re-export from the unified auth module for backwards compatibility.
// New code should import directly from '@/lib/auth'.
export { withApiAuth as withAuth, type Role, can, AuthError } from '@/lib/auth';

export function withPermission(action: string, subject: string) {
  return function (handler: (req: Request) => Promise<Response>) {
    return async (req: Request) => {
      const { requireAuth, can: canDo } = await import('@/lib/auth');
      const user = await requireAuth();
      if (!canDo(user.role, action, subject)) {
        const { NextResponse } = await import('next/server');
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req);
    };
  };
}

export function withRole(...roles: import('@/lib/auth').Role[]) {
  return function (handler: (req: Request) => Promise<Response>) {
    return async (req: Request) => {
      const { requireRole } = await import('@/lib/auth');
      await requireRole(...roles);
      return handler(req);
    };
  };
}
