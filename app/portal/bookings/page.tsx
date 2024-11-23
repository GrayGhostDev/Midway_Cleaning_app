"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ServiceBookingForm } from "@/components/portal/service-booking-form";
import { ServiceAvailability } from "@/components/services/service-availability";
import { ServicePackageSelector } from "@/components/portal/service-package-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, CalendarDays } from "lucide-react";

export default function BookingsPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Book Services</h1>
        <p className="text-muted-foreground">
          Schedule new cleaning services or subscribe to a service package
        </p>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">
            <CalendarDays className="mr-2 h-4 w-4" />
            Single Service
          </TabsTrigger>
          <TabsTrigger value="package">
            <Package className="mr-2 h-4 w-4" />
            Service Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card className="p-6">
            <ServiceBookingForm
              onServiceSelect={setSelectedService}
              selectedService={selectedService}
            />
            {selectedService && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Select Date & Time</h3>
                <ServiceAvailability serviceId={selectedService} />
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="package">
          <ServicePackageSelector />
        </TabsContent>
      </Tabs>
    </div>
  );
}