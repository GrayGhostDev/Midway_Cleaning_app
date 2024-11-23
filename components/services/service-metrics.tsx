"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CleaningBucket, TrendingUp, DollarSign, Star } from "lucide-react";

const metrics = [
  {
    name: "Active Services",
    value: 12,
    icon: CleaningBucket,
    description: "Currently offered",
    trend: "+2",
  },
  {
    name: "Utilization Rate",
    value: 85,
    icon: TrendingUp,
    description: "Last 30 days",
    trend: "+5%",
  },
  {
    name: "Average Revenue",
    value: 92,
    icon: DollarSign,
    description: "Per service",
    trend: "+8%",
  },
  {
    name: "Client Satisfaction",
    value: 95,
    icon: Star,
    description: "Service rating",
    trend: "+2%",
  },
];

export function ServiceMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.name} className="p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">{metric.name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metric.value}%</span>
                <span className="text-sm text-green-600">{metric.trend}</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
                <Progress value={metric.value} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}