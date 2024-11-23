"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FeedbackForm } from "@/components/portal/feedback-form";
import { FeedbackHistory } from "@/components/portal/feedback-history";
import { ServiceRatings } from "@/components/portal/service-ratings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Star, History } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Feedback & Ratings</h1>
        <p className="text-muted-foreground">
          Share your experience and view past feedback
        </p>
      </div>

      <Tabs defaultValue="give-feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="give-feedback">
            <MessageSquare className="mr-2 h-4 w-4" />
            Give Feedback
          </TabsTrigger>
          <TabsTrigger value="ratings">
            <Star className="mr-2 h-4 w-4" />
            Service Ratings
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Feedback History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="give-feedback">
          <Card className="p-6">
            <FeedbackForm />
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <ServiceRatings />
        </TabsContent>

        <TabsContent value="history">
          <FeedbackHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}