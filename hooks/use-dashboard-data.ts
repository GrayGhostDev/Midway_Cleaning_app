import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { DashboardStats, RevenueData, TasksResponse } from '@/types/dashboard';
import { fetchAPI } from '@/lib/services/api';

async function fetchDashboardStats(): Promise<DashboardStats> {
  return fetchAPI<DashboardStats>('/api/dashboard/stats');
}

async function fetchRevenueData(): Promise<RevenueData> {
  return fetchAPI<RevenueData>('/api/dashboard/revenue');
}

async function fetchTasks(page: number, search: string): Promise<TasksResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    search,
  });

  return fetchAPI<TasksResponse>(`/api/tasks?${params}`);
}

export function useDashboardData() {
  const { isLoaded, isSignedIn } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const stats = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    enabled: isLoaded && isSignedIn,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const revenue = useQuery<RevenueData>({
    queryKey: ['revenueData'],
    queryFn: fetchRevenueData,
    enabled: isLoaded && isSignedIn,
    refetchInterval: 60000, // Refetch every minute
  });

  const tasks = useQuery<TasksResponse>({
    queryKey: ['tasks', page, search],
    queryFn: () => fetchTasks(page, search),
    enabled: isLoaded && isSignedIn,
  });

  // If not authenticated, redirect to sign-in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = '/sign-in';
    }
  }, [isLoaded, isSignedIn]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return {
    isLoading: !isLoaded || stats.isLoading || revenue.isLoading || tasks.isLoading,
    error: stats.error || revenue.error || tasks.error,
    data: {
      stats: stats.data,
      revenue: revenue.data,
      tasks: tasks.data,
      pagination: {
        page,
        setPage,
        search,
        setSearch,
      },
    },
  };
}
