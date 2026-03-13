'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const serviceTypes = [
  { id: 'regular', name: 'Regular Cleaning', price: 150 },
  { id: 'deep', name: 'Deep Cleaning', price: 300 },
  { id: 'window', name: 'Window Cleaning', price: 200 },
  { id: 'carpet', name: 'Carpet Cleaning', price: 250 },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

function parseTimeSlot(slot: string, base: Date): Date {
  const [time, meridian] = slot.split(' ');
  const [rawHours, minutes] = time.split(':').map(Number);
  const hours = meridian === 'PM' && rawHours !== 12 ? rawHours + 12 : rawHours === 12 && meridian === 'AM' ? 0 : rawHours;
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function ServiceBooking() {
  const [date, setDate] = useState<Date>();
  const [serviceType, setServiceType] = useState<string>();
  const [timeSlot, setTimeSlot] = useState<string>();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceType || !date || !timeSlot) {
      toast({
        title: 'Missing fields',
        description: 'Please select a service, date, and time slot.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const bookingDate = parseTimeSlot(timeSlot, date);
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: serviceType,
          date: bookingDate.toISOString(),
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Booking failed');
      }

      toast({
        title: 'Booking confirmed',
        description: `Your ${serviceTypes.find(s => s.id === serviceType)?.name} has been scheduled.`,
      });

      // Reset form
      setDate(undefined);
      setServiceType(undefined);
      setTimeSlot(undefined);
      setNotes('');
    } catch (err) {
      toast({
        title: 'Booking failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Service</CardTitle>
        <CardDescription>Schedule a cleaning service at your convenience</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} — ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(d) => d < new Date()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Slot</label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Special Instructions</label>
            <Textarea
              placeholder="Any specific requirements or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
          {submitting ? 'Booking…' : 'Book Service'}
        </Button>
      </CardFooter>
    </Card>
  );
}
