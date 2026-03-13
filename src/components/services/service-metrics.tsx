'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle, DollarSign, Users } from 'lucide-react';

interface ServiceSummary {
  totalActive: number;
  avgUtilization: number;
  avgRate: number;
  totalStaffRequired: number;
}

export function ServiceMetrics() {
  const [summary, setSummary] = useState<ServiceSummary | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((services: { status: string; utilization: number; rate: number; staffRequired: number }[]) => {
        if (!Array.isArray(services)) return;
        const active = services.filter((s) => s.status === 'Active');
        setSummary({
          totalActive: active.length,
          avgUtilization: active.length
            ? Math.round(active.reduce((a, s) => a + s.utilization, 0) / active.length)
            : 0,
          avgRate: active.length
            ? Math.round(active.reduce((a, s) => a + s.rate, 0) / active.length)
            : 0,
          totalStaffRequired: active.reduce((a, s) => a + s.staffRequired, 0),
        });
      })
      .catch(console.error);
  }, []);

  const stats = [
    { label: 'Active Services', value: summary?.totalActive ?? '—', icon: CheckCircle },
    { label: 'Avg Utilization', value: summary ? `${summary.avgUtilization}%` : '—', icon: Activity },
    { label: 'Avg Rate', value: summary ? `$${summary.avgRate}/hr` : '—', icon: DollarSign },
    { label: 'Staff Required', value: summary?.totalStaffRequired ?? '—', icon: Users },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
