import { Suspense } from 'react';
import { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Midway Cleaning Co. Dashboard',
  description: 'Management dashboard for Midway Cleaning Company',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </DashboardShell>
  );
}
