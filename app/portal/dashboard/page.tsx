"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceHistory } from "@/components/portal/service-history";
import { UpcomingServices } from "@/components/portal/upcoming-services";
import { PaymentOverview } from "@/components/portal/payment-overview";
import { ClientMetrics } from "@/components/portal/client-metrics";
import { Calendar, CreditCard, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("upcoming");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your cleaning services and account
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => router.push("/portal/bookings")}>
            <Plus className="mr-2 h-4 w-4" />
            Book Service
          </Button>
          <Button variant="outline" onClick={() => router.push("/portal/payments")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        </div>
      </div>

      <ClientMetrics />

      <Tabs defaultValue={selectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Services
          </TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingServices />
        </TabsContent>

        <TabsContent value="history">
          <ServiceHistory />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}