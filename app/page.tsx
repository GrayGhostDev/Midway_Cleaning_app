"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
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
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, show sign-in message
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
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
            Updated 2 hours ago
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
            <Clock className="mr-1 h-3 w-3" />
            Updated today
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">$12.5k</p>
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
            <Clock className="mr-1 h-3 w-3" />
            Updated today
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Performance Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Task completion and efficiency metrics
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <Overview />
              </div>
            </Card>
            <Card className="col-span-3">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">Latest updates and changes</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <RecentActivity />
              </div>
            </Card>
          </div>
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Task Summary</h3>
              <TaskSummary />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}