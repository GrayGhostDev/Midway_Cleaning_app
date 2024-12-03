'use client';

import { ClipboardList, DollarSign, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/ui/stats-card';
import { Chart } from '@/components/dashboard/ui/chart';
import { DataTable } from '@/components/dashboard/ui/data-table';
import { DashboardCard } from '@/components/dashboard/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { formatCurrency } from '@/lib/utils';
import { Row } from '@tanstack/react-table';
import { DashboardStats, TasksResponse } from '@/types/dashboard';
import { ProtectedRoute } from '@/components/auth/protected-route';

interface Task {
  id: string;
  title: string;
  cleaner: {
    name: string | null;
  } | null;
  status: string;
  priority: string;
  dueDate: string | null;
  booking: {
    service: {
      name: string;
    };
  } | null;
}

const taskColumns = [
  { accessorKey: 'title', header: 'Task' },
  { 
    accessorKey: 'booking.service.name', 
    header: 'Service',
    cell: ({ row }: { row: Row<Task> }) => {
      return row.original.booking?.service.name || 'N/A';
    },
  },
  { 
    accessorKey: 'cleaner.name', 
    header: 'Cleaner',
    cell: ({ row }: { row: Row<Task> }) => {
      return row.original.cleaner?.name || 'Unassigned';
    },
  },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'priority', header: 'Priority' },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }: { row: Row<Task> }) => {
      if (!row.original.dueDate) return 'No due date';
      return new Date(row.original.dueDate).toLocaleDateString();
    },
  },
];

function DashboardContent() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-destructive">Failed to load dashboard data</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const stats: DashboardStats = data?.stats || {
    totalTasks: 0,
    totalRevenue: 0,
    totalCleaners: 0,
  };

  const tasks: TasksResponse = data?.tasks || {
    tasks: [],
    totalTasks: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your cleaning service.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks.toString()}
          description="Active cleaning tasks"
          icon={ClipboardList}
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="Total revenue this month"
          icon={DollarSign}
        />
        <StatsCard
          title="Cleaners"
          value={stats.totalCleaners.toString()}
          description="Active cleaning staff"
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Revenue Overview">
          <Chart data={data?.revenueData || []} />
        </DashboardCard>
        <DashboardCard title="Task Distribution">
          <Chart data={data?.taskDistribution || []} />
        </DashboardCard>
      </div>

      <DashboardCard title="Recent Tasks">
        <DataTable
          columns={taskColumns}
          data={tasks.tasks}
        />
      </DashboardCard>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
