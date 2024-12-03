import { useState, useEffect } from 'react';
import { getAnalyticsData } from '@/lib/services/analytics.service';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface DashboardData {
  revenue: {
    total: number;
    trend: number;
    data: { date: string; value: number }[];
  };
  customers: {
    total: number;
    trend: number;
    data: { date: string; value: number }[];
  };
  satisfaction: {
    average: number;
    trend: number;
    data: { date: string; value: number }[];
  };
  utilization: {
    rate: number;
    trend: number;
    data: { date: string; value: number }[];
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());
        const analyticsData = await getAnalyticsData(startDate, endDate);
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
