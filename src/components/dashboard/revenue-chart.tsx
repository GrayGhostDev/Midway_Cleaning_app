'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';

// Stable module-level defaults — computed once, never change reference
const DEFAULT_END = new Date();
const DEFAULT_START = new Date(DEFAULT_END);
DEFAULT_START.setMonth(DEFAULT_START.getMonth() - 1);

interface RevenueChartProps {
  timeRange?: string;
  startDate?: Date;
  endDate?: Date;
}

export function RevenueChart({
  timeRange = 'monthly',
  startDate = DEFAULT_START,
  endDate = DEFAULT_END,
}: RevenueChartProps) {
  // Stable ISO strings prevent queryKey from changing on every render
  const startISO = useMemo(() => startDate.toISOString(), [startDate]);
  const endISO = useMemo(() => endDate.toISOString(), [endDate]);

  const { data, isLoading } = useQuery({
    queryKey: ['revenue', timeRange, startISO, endISO],
    queryFn: async () => {
      const params = new URLSearchParams({ timeRange, startDate: startISO, endDate: endISO });
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 min — analytics don't need real-time refresh
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Revenue breakdown over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.data}>
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                    }).format(value)
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
