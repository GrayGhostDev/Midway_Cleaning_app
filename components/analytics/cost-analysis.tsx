"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import { AnalyticsService, CostData } from "../../lib/services/analytics.service";
import { useToast } from "@/components/ui/use-toast";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface TooltipPayload {
  color: string;
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface CostAnalysisProps {}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
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
                ${Number(item.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function CostAnalysis({}: CostAnalysisProps) {
  const [data, setData] = useState<CostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCostData = useCallback(async () => {
    try {
      const costData = await AnalyticsService.getCostAnalysis();
      setData(costData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cost analysis data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCostData();
  }, [loadCostData]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading cost analysis...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Cost Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Bar
              dataKey="actual"
              name="Actual Cost"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="projected"
              name="Projected Cost"
              fill="#4ade80"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}