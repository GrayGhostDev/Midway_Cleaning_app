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
        const data = [
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
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{metric.name}</h3>
                </div>
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
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                  {metric.progress && (
                    <Progress 
                      value={metric.progress}
                      className="h-1.5"
                    />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}