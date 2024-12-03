import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role, can, canAccess, hasRole } from '@/lib/auth/rbac';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function useAuth(requiredRoles?: Role[]) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as AuthUser | undefined;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredRoles && user && !canAccess(user.role, requiredRoles)) {
      router.push('/dashboard');
    }
  }, [session, status, requiredRoles, router, user]);

  const isAuthenticated = !!session;
  const isLoading = status === 'loading';

  return {
    user,
    isAuthenticated,
    isLoading,
    role: user?.role,
    // Permission checking functions
    can: (action: string, subject: string) => user ? can(user.role, action, subject) : false,
    hasRole: (role: Role) => user ? hasRole(user.role, role) : false,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isEmployee: user?.role === 'EMPLOYEE',
    isClient: user?.role === 'CLIENT',
  };
}

// HOC for protecting components
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles?: Role[]
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth(requiredRoles);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Custom error for authentication failures
export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_CREDENTIALS' = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Helper function to handle auth errors
export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return { error: 'Please log in to continue' };
      case 'FORBIDDEN':
        return { error: 'You do not have permission to access this resource' };
      case 'INVALID_CREDENTIALS':
        return { error: 'Invalid email or password' };
      default:
        return { error: 'An authentication error occurred' };
    }
  }
  return { error: 'An unexpected error occurred' };
}
