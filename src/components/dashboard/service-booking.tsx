'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

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

export function ServiceBooking() {
  const [date, setDate] = useState<Date>();
  const [serviceType, setServiceType] = useState<string>();
  const [timeSlot, setTimeSlot] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking submission
    console.log({ date, serviceType, timeSlot });
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
                    {service.name} - ${service.price}
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
              disabled={(date) => date < new Date()}
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
            <Textarea placeholder="Any specific requirements or notes..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Number</label>
            <Input type="tel" placeholder="Your phone number" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Book Service
        </Button>
      </CardFooter>
    </Card>
  );
}
