import { Metadata } from 'next';
import { ServiceBooking } from '@/components/dashboard/service-booking';

export const metadata: Metadata = {
  title: 'Book Service | Midway Cleaning',
  description: 'Book a cleaning service with Midway Cleaning',
};

export default function BookingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Book a Service</h2>
        <p className="text-muted-foreground">
          Schedule a cleaning service that fits your needs
        </p>
      </div>
      <ServiceBooking />
    </div>
  );
}
