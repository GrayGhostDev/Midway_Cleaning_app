"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wrench, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const metrics = [
  {
    name: "Equipment Available",
    value: 82,
    icon: CheckCircle2,
    description: "Ready for use",
    trend: "+3%",
  },
  {
    name: "Maintenance Due",
    value: 15,
    icon: AlertTriangle,
    description: "Next 30 days",
    trend: "-2%",
  },
  {
    name: "Utilization Rate",
    value: 78,
    icon: Clock,
    description: "Last 7 days",
    trend: "+5%",
  },
  {
    name: "Maintenance Completed",
    value: 95,
    icon: Wrench,
    description: "This month",
    trend: "+8%",
  },
];

export function EquipmentMetrics() {
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
                <span className={`text-sm ${
                  metric.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend}
                </span>
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