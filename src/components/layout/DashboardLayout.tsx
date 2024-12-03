import { ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from '../ui/toaster';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return null; // Or redirect to sign in
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Sidebar />
      <div className="flex flex-col pl-64">
        <Header user={user} />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
