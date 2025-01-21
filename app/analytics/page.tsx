"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceMetrics } from "../../components/analytics/performance-metrics";
import { ResourceUtilization } from "../../components/analytics/resource-utilization";
import { BarChart3, DollarSign, Heart, Box } from "lucide-react";
import { AnalyticsService, type DashboardMetrics } from "@/lib/services/analytics.service";
import { useToast } from "@/components/ui/use-toast";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadDashboardMetrics = useCallback(async () => {
    try {
      const data = await AnalyticsService.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard metrics. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [setMetrics, toast]);

  useEffect(() => {
    loadDashboardMetrics();
  }, [loadDashboardMetrics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">Active Tasks</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{metrics?.activeTasks}</p>
          <p className="text-xs text-muted-foreground">{metrics?.trends.tasks}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold">Staff on Duty</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{metrics?.employeesOnDuty}</p>
          <p className="text-xs text-muted-foreground">{metrics?.trends.employees}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold">Completed Today</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{metrics?.completedToday}</p>
          <p className="text-xs text-muted-foreground">{metrics?.trends.completion}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold">Customer Rating</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">{metrics?.customerRating}</p>
          <p className="text-xs text-muted-foreground">{metrics?.trends.rating}</p>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-4">
            <PerformanceMetrics />
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-4">
            <ResourceUtilization />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}