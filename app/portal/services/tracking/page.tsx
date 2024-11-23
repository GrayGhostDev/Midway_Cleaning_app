"use client";

import { ServiceTracking } from "@/components/portal/service-tracking";

export default function ServiceTrackingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Service Tracking</h1>
        <p className="text-muted-foreground">
          Track your current cleaning service in real-time
        </p>
      </div>
      <ServiceTracking />
    </div>
  );
}