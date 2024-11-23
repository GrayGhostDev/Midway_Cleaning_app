"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QualityService } from "@/lib/services/quality.service";
import { useToast } from "@/components/ui/use-toast";

export function QualityMetrics() {
  const [metrics, setMetrics] = useState<{
    overallScore: number;
    passRate: number;
    satisfaction: number;
    compliance: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      const data = await QualityService.getMetrics();
      setMetrics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quality metrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-2 w-full bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      name: "Overall Quality Score",
      value: metrics?.overallScore || 0,
      target: 95,
      trend: "+2.5%",
    },
    {
      name: "Inspection Pass Rate",
      value: metrics?.passRate || 0,
      target: 90,
      trend: "+1.8%",
    },
    {
      name: "Customer Satisfaction",
      value: metrics?.satisfaction || 0,
      target: 95,
      trend: "+0.5%",
    },
    {
      name: "Standards Compliance",
      value: metrics?.compliance || 0,
      target: 98,
      trend: "-0.2%",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <Card key={metric.name} className="p-6">
          <div className="space-y-2">
            <h3 className="font-semibold">{metric.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metric.value}%</span>
              <span className={`text-sm ${
                metric.trend.startsWith("+") 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target: {metric.target}%</span>
              </div>
              <Progress value={(metric.value / metric.target) * 100} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}