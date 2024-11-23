"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

const paymentMetrics = [
  {
    name: "Monthly Spending",
    value: "$1,299",
    trend: "+12%",
    trendDirection: "up",
    description: "vs. last month",
  },
  {
    name: "Outstanding Balance",
    value: "$299",
    trend: "-25%",
    trendDirection: "down",
    description: "vs. last month",
  },
  {
    name: "Next Payment Due",
    value: "$599",
    dueDate: "March 30, 2024",
    description: "Regular service payment",
  },
];

export function PaymentOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {paymentMetrics.map((metric) => (
          <Card key={metric.name} className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.trend && (
                  <span className={`text-sm flex items-center ${
                    metric.trendDirection === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {metric.trendDirection === "up" ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {metric.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              {metric.dueDate && (
                <p className="text-xs text-muted-foreground">Due: {metric.dueDate}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  {i % 2 === 0 ? (
                    <DollarSign className="h-4 w-4 text-primary" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {i % 2 === 0 ? "Monthly Service Payment" : "Additional Service"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="font-medium">-$599.00</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/24</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Default</span>
          </div>
          <Progress value={33} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Monthly Limit: $2,000</span>
            <span>Used: $667</span>
          </div>
        </div>
      </Card>
    </div>
  );
}