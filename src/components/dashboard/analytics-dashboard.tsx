'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { RevenueChart } from './revenue-chart';
import { addDays, subDays } from 'date-fns';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  revenue: number;
  appointments: number;
  customers: number;
  services: number;
  timestamp: string;
}

const queryClient = new QueryClient();

export function AnalyticsDashboardContent() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Fetch analytics data
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeRange,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  // Download report
  const downloadReport = async (format: 'pdf' | 'excel' | 'csv') => {
    const params = new URLSearchParams({
      timeRange,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      format,
    });
    
    window.open(`/api/analytics?${params}`, '_blank');
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load analytics data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>View and export analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />

            <div className="flex gap-2">
              <Button onClick={() => downloadReport('pdf')}>
                Export PDF
              </Button>
              <Button onClick={() => downloadReport('excel')}>
                Export Excel
              </Button>
              <Button onClick={() => downloadReport('csv')}>
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {data && (
        <>
          {/* Revenue Chart */}
          <RevenueChart 
            timeRange={timeRange} 
            startDate={dateRange.from} 
            endDate={dateRange.to} 
          />

          {/* Appointments Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments Overview</CardTitle>
              <CardDescription>Number of appointments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Bar dataKey="appointments" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(
                    data.data.reduce((sum: number, item: AnalyticsData) => sum + item.revenue, 0)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.data.reduce((sum: number, item: AnalyticsData) => sum + item.appointments, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.data.reduce((sum: number, item: AnalyticsData) => sum + item.customers, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.data.reduce((sum: number, item: AnalyticsData) => sum + item.services, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export function AnalyticsDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsDashboardContent />
    </QueryClientProvider>
  );
}
