'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';

interface Booking {
  id: number;
  service: string;
  client: { name: string; image?: string };
  time: string;
  duration: string;
  location: string;
  staff: number;
  status: string;
}

interface ServiceScheduleProps {
  selectedDate?: Date;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Scheduled: 'default',
  'In Progress': 'secondary',
  Completed: 'secondary',
  Cancelled: 'destructive',
};

export function ServiceSchedule({ selectedDate }: ServiceScheduleProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDate) params.set('date', selectedDate.toISOString());
    fetch(`/api/services/bookings?${params}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBookings(data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Today';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule — {dateLabel}</CardTitle>
        <CardDescription>
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-6">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No bookings for this date</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-start justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="font-medium">{b.service}</p>
                  <p className="text-sm text-muted-foreground">{b.client.name}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.time} · {b.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{b.staff} staff</span>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[b.status] ?? 'secondary'}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
