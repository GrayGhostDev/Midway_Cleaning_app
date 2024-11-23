"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus } from "lucide-react";
import { ServiceSchedule } from "@/components/services/schedule/service-schedule";
import { AddBookingDialog } from "@/components/services/schedule/add-booking-dialog";
import { ServiceCalendar } from "@/components/services/schedule/service-calendar";

export default function ServiceSchedulePage() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Service Schedule</h1>
          <p className="text-muted-foreground">
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Manage service bookings and availability
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <ServiceCalendar
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
        <ServiceSchedule selectedDate={selectedDate} />
      </div>

      <AddBookingDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}