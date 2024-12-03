'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary/90 block"
          >
            Return to Dashboard
          </Link>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
