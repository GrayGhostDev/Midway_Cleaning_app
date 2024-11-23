"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PaymentHistory } from "@/components/portal/payment-history";
import { PaymentForm } from "@/components/portal/payment-form";
import { PaymentMethods } from "@/components/portal/payment-methods";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Clock, Wallet } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage your payments and payment methods
        </p>
      </div>

      <Tabs defaultValue="make-payment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="make-payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </TabsTrigger>
          <TabsTrigger value="payment-methods">
            <Wallet className="mr-2 h-4 w-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="make-payment">
          <Card className="p-6">
            <PaymentForm />
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}