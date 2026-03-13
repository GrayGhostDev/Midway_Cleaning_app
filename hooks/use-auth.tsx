'use client';

import React from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { type Role, can, canAccess, hasRole } from '@/lib/auth';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function useAuth(requiredRoles?: Role[]) {
  const { isSignedIn, isLoaded, userId } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const role = (clerkUser?.publicMetadata?.role as Role) || 'CLIENT';

  const user: AuthUser | undefined =
    isSignedIn && clerkUser
      ? {
          id: userId!,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || '',
          role,
        }
      : undefined;

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (requiredRoles && user && !canAccess(user.role, requiredRoles)) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, requiredRoles, router, user]);

  return {
    user,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    role: user?.role,
    can: (action: string, subject: string) => (user ? can(user.role, action, subject) : false),
    hasRole: (r: Role) => (user ? hasRole(user.role, r) : false),
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isCleaner: user?.role === 'CLEANER',
    isClient: user?.role === 'CLIENT',
  };
}

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

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_CREDENTIALS' = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return { error: 'Please sign in to continue' };
      case 'FORBIDDEN':
        return { error: 'You do not have permission to access this resource' };
      case 'INVALID_CREDENTIALS':
        return { error: 'Invalid credentials' };
      default:
        return { error: 'An authentication error occurred' };
    }
  }
  return { error: 'An unexpected error occurred' };
}
