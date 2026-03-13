'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface ServicePackage {
  id: number;
  name: string;
  services: { serviceId: number; frequency: string }[];
  pricing: { monthly: number; quarterly: number; annual: number };
  discounts?: { type: string; value: number; conditions?: string }[];
}

export function PackageList({ searchQuery }: { searchQuery?: string }) {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services/packages')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPackages(data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = searchQuery
    ? packages.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : packages;

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading packages...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filtered.length === 0 ? (
        <p className="col-span-2 text-center text-muted-foreground py-8">No packages found</p>
      ) : (
        filtered.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">{pkg.name}</CardTitle>
              </div>
              <CardDescription>{pkg.services.length} service{pkg.services.length !== 1 ? 's' : ''} included</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                {(['monthly', 'quarterly', 'annual'] as const).map((tier) => (
                  <div key={tier} className="rounded-md border p-2">
                    <p className="text-xs text-muted-foreground capitalize">{tier}</p>
                    <p className="font-semibold">${pkg.pricing[tier].toLocaleString()}</p>
                  </div>
                ))}
              </div>
              {pkg.discounts && pkg.discounts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pkg.discounts.map((d, i) => (
                    <Badge key={i} variant="secondary">{d.value}% {d.type} discount</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
