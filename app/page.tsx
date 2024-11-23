"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Overview } from "@/components/overview";
import { RecentActivity } from "@/components/recent-activity";
import { TaskSummary } from "@/components/task-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CheckCircle2,
  Star,
  BarChart2,
  Clock,
  TrendingUp,
} from "lucide-react";

const timeRanges = ["Today", "This Week", "This Month", "This Quarter"];

export default function Home() {
  const [selectedRange, setSelectedRange] = useState("Today");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? "default" : "outline"}
              onClick={() => setSelectedRange(range)}
              size="sm"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">24</p>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  8.2%
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Updated 5 minutes ago
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Staff on Duty</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">12</p>
                <span className="text-xs text-red-600 flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  3.1%
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Real-time data
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">18</p>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  12.5%
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3" />
            94% completion rate
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Customer Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">4.8</p>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  0.3
                </span>
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Star className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            Last 30 days
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Task Completion Overview</h3>
            <Overview />
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Task Summary</h3>
            <TaskSummary />
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <RecentActivity />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}