"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

interface ServiceCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function ServiceCalendar({ selected, onSelect }: ServiceCalendarProps) {
  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        className="rounded-md"
      />
    </Card>
  );
}