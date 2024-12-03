"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, DollarSign, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Metric {
  name: string;
  value: number | string;
  icon: any;
  description: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  progress?: number;
}

export function ClientMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulated API call - replace with actual API integration
    const fetchMetrics = async () => {
      try {
        // Simulated data
        const data: Metric[] = [
          {
            name: "Active Services",
            value: 3,
            icon: Calendar,
            description: "Currently scheduled",
            trend: "+1",
            trendDirection: "up",
            progress: 75
          },
          {
            name: "Service Hours",
            value: 85,
            icon: Clock,
            description: "This month",
            trend: "+5%",
            trendDirection: "up",
            progress: 85
          },
          {
            name: "Total Spent",
            value: "$1,299",
            icon: DollarSign,
            description: "Last 30 days",
            trend: "+8%",
            trendDirection: "up",
            progress: 92
          },
          {
            name: "Satisfaction",
            value: 4.8,
            icon: Star,
            description: "Average rating",
            trend: "+0.2",
            trendDirection: "up",
            progress: 96
          }
        ];
        setMetrics(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load metrics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [toast]);

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </p>
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                </div>
              </div>
              {metric.trend && (
                <div className="flex items-center space-x-1">
                  {metric.trendDirection === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      metric.trendDirection === "up"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {metric.trend}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {metric.description}
            </p>
            {metric.progress && (
              <Progress value={metric.progress} className="mt-4" />
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}