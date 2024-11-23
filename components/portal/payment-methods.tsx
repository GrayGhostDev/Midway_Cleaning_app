"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";
import { useState } from "react";

const paymentMethods = [
  {
    id: 1,
    type: "credit",
    last4: "4242",
    expiry: "12/24",
    brand: "Visa",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit",
    last4: "1234",
    expiry: "09/25",
    brand: "Mastercard",
    isDefault: false,
  },
];

export function PaymentMethods() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Payment Methods</h3>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">
                      {method.brand} ending in {method.last4}
                    </p>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm">
                    Make Default
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AddPaymentMethodDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}