'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, DollarSign, Tag, Percent } from 'lucide-react';

export function PackageMetrics() {
  const [stats, setStats] = useState({ total: 0, maxMonthly: 0, maxAnnual: 0, discountedCount: 0 });

  useEffect(() => {
    fetch('/api/services/packages')
      .then((r) => r.json())
      .then((pkgs: { pricing: { monthly: number; annual: number }; discounts?: unknown[] }[]) => {
        if (!Array.isArray(pkgs)) return;
        setStats({
          total: pkgs.length,
          maxMonthly: Math.max(0, ...pkgs.map((p) => p.pricing.monthly)),
          maxAnnual: Math.max(0, ...pkgs.map((p) => p.pricing.annual)),
          discountedCount: pkgs.filter((p) => p.discounts && p.discounts.length > 0).length,
        });
      })
      .catch(console.error);
  }, []);

  const items = [
    { label: 'Total Packages', value: stats.total, icon: Package },
    { label: 'Top Monthly', value: `$${stats.maxMonthly.toLocaleString()}`, icon: DollarSign },
    { label: 'Top Annual', value: `$${stats.maxAnnual.toLocaleString()}`, icon: Tag },
    { label: 'With Discounts', value: stats.discountedCount, icon: Percent },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
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
