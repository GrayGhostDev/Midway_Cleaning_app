'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, DollarSign, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalRevenue: number;
  pendingBookings: number;
  pendingTasks: number;
  activeCleaners: number;
  trends: {
    revenue: number;
    tasks: number;
    cleaners: number;
  };
}

function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-1" />
        <Skeleton className="h-3 w-36" />
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const revenue = stats?.totalRevenue ?? 0;
  const trend = stats?.trends.revenue ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(revenue)}
        subtext={`${trend >= 0 ? '+' : ''}${trend}% from last month`}
        icon={DollarSign}
      />
      <StatCard
        title="Active Cleaners"
        value={stats?.activeCleaners ?? 0}
        subtext={`${stats?.trends.cleaners ?? 0 >= 0 ? '+' : ''}${stats?.trends.cleaners ?? 0} this month`}
        icon={Users}
      />
      <StatCard
        title="Pending Bookings"
        value={stats?.pendingBookings ?? 0}
        subtext="Awaiting confirmation"
        icon={Calendar}
      />
      <StatCard
        title="Pending Tasks"
        value={stats?.pendingTasks ?? 0}
        subtext={`${stats?.trends.tasks ?? 0 >= 0 ? '+' : ''}${stats?.trends.tasks ?? 0}% from last week`}
        icon={ClipboardList}
      />
    </div>
  );
}
