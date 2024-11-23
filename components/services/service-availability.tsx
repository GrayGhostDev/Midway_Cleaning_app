"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

interface ServiceAvailabilityProps {
  serviceId: number;
  onTimeSelect?: (date: Date, time: string) => void;
}

export function ServiceAvailability({ serviceId, onTimeSelect }: ServiceAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "09:00", available: true },
    { time: "10:00", available: false, reason: "Fully booked" },
    { time: "11:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: false, reason: "Staff unavailable" },
    { time: "15:00", available: true },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
        />
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-medium">
            {selectedDate
              ? `Available Times for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date to view available times"}
          </h3>

          {selectedDate && (
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={slot.available ? "outline" : "ghost"}
                  className="justify-start"
                  disabled={!slot.available}
                  onClick={() => onTimeSelect?.(selectedDate, slot.time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {slot.time}
                  {!slot.available && (
                    <Badge variant="secondary" className="ml-2">
                      {slot.reason}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}