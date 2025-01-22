'use client';

import * as React from 'react';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  ClipboardList,
  DollarSign,
  Users,
  CheckCircle2,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building
} from 'lucide-react';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { Suspense } from 'react';
import { StatsCard } from '@/components/dashboard/ui/stats-card';
import { ServiceTracker } from '@/components/dashboard/service-tracker';
import { DocumentManager } from '@/components/dashboard/document-manager';
import { AnalyticsDashboardContent } from '@/components/dashboard/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Midway Cleaning',
  description: 'Dashboard overview for Midway Cleaning services',
};

export default function DashboardPage() {
  // This would typically come from an API
  const metrics = {
    activeTasks: 12,
    employeesOnDuty: 8,
    completedToday: 15,
    customerRating: 4.8,
    trends: {
      tasks: '+12',
      employees: '+5',
      completion: '+8',
      rating: '+0.3'
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Tasks"
          value={metrics.activeTasks}
          icon={Clock}
          trend={{ value: 12, isPositive: true }}
          description="Tasks in progress"
        />
        <StatsCard
          title="Employees on Duty"
          value={metrics.employeesOnDuty}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          description="Currently working"
        />
        <StatsCard
          title="Completed Today"
          value={metrics.completedToday}
          icon={CheckCircle2}
          trend={{ value: 8, isPositive: true }}
          description="Tasks completed"
        />
        <StatsCard
          title="Customer Rating"
          value={metrics.customerRating}
          icon={Star}
          trend={{ value: 0.3, isPositive: true }}
          description="Average rating"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Services */}
        <Card>
          <CardHeader>
            <CardTitle>Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading services...</div>}>
              <ServiceTracker />
            </Suspense>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading documents...</div>}>
              <DocumentManager />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading analytics...</div>}>
            <AnalyticsDashboardContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
