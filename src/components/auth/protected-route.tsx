'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  return <>{children}</>;
}
