'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: string;
  rate: number;
  rateUnit: string;
  staffRequired: number;
  status: string;
  utilization: number;
  lastUpdated: string;
}

export function ServiceList({ searchQuery }: { searchQuery?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      const res = await fetch(`/api/services?${params}`);
      if (!res.ok) throw new Error('Failed to load services');
      setServices(await res.json());
    } catch (err) {
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [searchQuery]);

  const statusColor = (status: string) =>
    status === 'Active' ? 'default' : status === 'Under Review' ? 'secondary' : 'destructive';

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading services...</div>;
  if (error) return (
    <div className="py-8 text-center text-destructive">
      {error} <Button variant="outline" size="sm" className="ml-2" onClick={load}>Retry</Button>
    </div>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Utilization</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground">No services found</TableCell>
          </TableRow>
        ) : (
          services.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell className="capitalize">{s.category}</TableCell>
              <TableCell>{s.duration}</TableCell>
              <TableCell>${s.rate}/{s.rateUnit}</TableCell>
              <TableCell>{s.staffRequired}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${s.utilization}%` }}
                    />
                  </div>
                  <span className="text-xs">{s.utilization}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusColor(s.status) as 'default' | 'secondary' | 'destructive'}>{s.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
