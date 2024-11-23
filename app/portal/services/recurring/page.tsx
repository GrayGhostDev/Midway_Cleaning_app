"use client";

import { RecurringBooking } from "@/components/portal/recurring-booking";

export default function RecurringBookingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Recurring Services</h1>
        <p className="text-muted-foreground">
          Schedule and manage your recurring cleaning services
        </p>
      </div>
      <RecurringBooking />
    </div>
  );
}