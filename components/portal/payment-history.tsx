"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";

const payments = [
  {
    id: 1,
    amount: 599.99,
    date: "2024-03-15",
    method: "Visa ending in 4242",
    status: "Completed",
    invoice: "INV-2024-001",
    description: "March Cleaning Services",
  },
  {
    id: 2,
    amount: 499.99,
    date: "2024-02-15",
    method: "Mastercard ending in 1234",
    status: "Completed",
    invoice: "INV-2024-002",
    description: "February Cleaning Services",
  },
  {
    id: 3,
    amount: 699.99,
    date: "2024-01-15",
    method: "Bank Transfer",
    status: "Completed",
    invoice: "INV-2024-003",
    description: "January Cleaning Services",
  },
];

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Failed: "bg-red-100 text-red-800",
};

export function PaymentHistory() {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">${payment.amount.toFixed(2)}</h3>
                <Badge
                  variant="outline"
                  className={statusColors[payment.status as keyof typeof statusColors]}
                >
                  {payment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {payment.description}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Date</p>
              <p>{format(new Date(payment.date), "MMMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Payment Method</p>
              <p>{payment.method}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Invoice Number</p>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p>{payment.invoice}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}