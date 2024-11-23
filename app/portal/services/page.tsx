"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceBooking } from "@/components/portal/service-booking";
import { ServiceCustomization } from "@/components/portal/service-customization";
import { RecurringBooking } from "@/components/portal/recurring-booking";
import { ServiceTracking } from "@/components/portal/service-tracking";
import { Calendar, Settings2, Repeat, Activity } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          Book and manage your cleaning services
        </p>
      </div>

      <Tabs defaultValue="book" className="space-y-4">
        <TabsList>
          <TabsTrigger value="book">
            <Calendar className="mr-2 h-4 w-4" />
            Book Service
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Settings2 className="mr-2 h-4 w-4" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="recurring">
            <Repeat className="mr-2 h-4 w-4" />
            Recurring
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Activity className="mr-2 h-4 w-4" />
            Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <ServiceBooking />
        </TabsContent>

        <TabsContent value="customize">
          <ServiceCustomization />
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringBooking />
        </TabsContent>

        <TabsContent value="tracking">
          <ServiceTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
}