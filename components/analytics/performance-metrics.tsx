"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AnalyticsService, PerformanceData } from "@/lib/services/analytics.service";
import { useToast } from "@/components/ui/use-toast";

export function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPerformanceData();
  }, []);

  async function loadPerformanceData() {
    try {
      const performanceData = await AnalyticsService.getPerformanceData();
      setData(performanceData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load performance data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Performance Trends</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={true}
              axisLine={true}
              padding={{ left: 30, right: 30 }}
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis
              width={50}
              tick={{ fontSize: 12 }}
              tickLine={true}
              axisLine={true}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{label}</div>
                        {payload.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.name}:
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="taskCompletion"
              name="Task Completion"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              name="Efficiency"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="quality"
              name="Quality Score"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}