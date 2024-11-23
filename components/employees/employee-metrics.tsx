"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Clock, Award } from "lucide-react";

const metrics = [
  {
    name: "Active Staff",
    value: 85,
    icon: Users,
    description: "Currently on duty",
    trend: "+5%",
  },
  {
    name: "Attendance Rate",
    value: 92,
    icon: UserCheck,
    description: "Last 30 days",
    trend: "+3%",
  },
  {
    name: "Avg. Hours",
    value: 78,
    icon: Clock,
    description: "Per week",
    trend: "+2%",
  },
  {
    name: "Certifications",
    value: 95,
    icon: Award,
    description: "Completion rate",
    trend: "+8%",
  },
];

export function EmployeeMetrics() {
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