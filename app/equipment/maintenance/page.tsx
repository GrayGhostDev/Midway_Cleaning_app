"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MaintenanceSchedule } from "@/components/equipment/maintenance-schedule";
import { MaintenanceHistory } from "@/components/equipment/maintenance-history";
import { MaintenanceRequestDialog } from "@/components/equipment/maintenance-request-dialog";
import { Wrench, ClipboardList, Plus } from "lucide-react";

export default function MaintenancePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Equipment Maintenance</h1>
          <p className="text-muted-foreground">
            <Wrench className="mr-2 inline-block h-4 w-4" />
            Track and manage equipment maintenance schedules
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Request Maintenance
        </Button>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">
            <ClipboardList className="mr-2 h-4 w-4" />
            Maintenance Schedule
          </TabsTrigger>
          <TabsTrigger value="history">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <MaintenanceSchedule />
        </TabsContent>

        <TabsContent value="history">
          <MaintenanceHistory />
        </TabsContent>
      </Tabs>

      <MaintenanceRequestDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}