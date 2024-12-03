import { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8">
        {children}
      </div>
    </DashboardLayout>
  );
}
