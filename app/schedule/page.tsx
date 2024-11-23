"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/schedule/calendar";
import { ShiftList } from "@/components/schedule/shift-list";
import { AddShiftDialog } from "@/components/schedule/add-shift-dialog";
import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklySchedule } from "@/components/schedule/weekly-schedule";
import { StaffAvailability } from "@/components/schedule/staff-availability";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">
            <CalendarDays className="mr-2 inline-block h-4 w-4" />
            {format(selectedDate, "MMMM d, yyyy")}
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shift
        </Button>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="staff">Staff Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <ShiftList selectedDate={selectedDate} />
            <div className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Today's Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Shifts:</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staff on Duty:</span>
                    <span>12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Locations Covered:</span>
                    <span>5</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklySchedule selectedDate={selectedDate} />
        </TabsContent>

        <TabsContent value="staff">
          <StaffAvailability />
        </TabsContent>
      </Tabs>

      <AddShiftDialog 
        open={open} 
        onOpenChange={setOpen}
        selectedDate={selectedDate}
      />
    </div>
  );
}