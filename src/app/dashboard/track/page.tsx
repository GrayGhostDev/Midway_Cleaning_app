import { Metadata } from 'next';
import { ServiceTracker } from '@/components/dashboard/service-tracker';

export const metadata: Metadata = {
  title: 'Track Services | Midway Cleaning',
  description: 'Track your cleaning services in real-time',
};

export default function TrackingPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Service Tracking</h2>
        <p className="text-muted-foreground">
          Monitor your cleaning services in real-time
        </p>
      </div>
      <ServiceTracker />
    </div>
  );
}
