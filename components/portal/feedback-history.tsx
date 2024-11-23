"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

const feedbackHistory = [
  {
    id: 1,
    service: "Regular Cleaning",
    date: "2024-03-10",
    rating: 5,
    comment: "Excellent service as always. The team was thorough and professional.",
    category: "Service Quality",
    status: "Responded",
    response: {
      message: "Thank you for your positive feedback! We're glad you're satisfied with our service.",
      date: "2024-03-11",
    },
  },
  {
    id: 2,
    service: "Deep Cleaning",
    date: "2024-02-15",
    rating: 4,
    comment: "Good overall, but some areas could use more attention.",
    category: "Quality",
    status: "Pending",
  },
];

const statusColors = {
  Responded: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewing: "bg-blue-100 text-blue-800",
};

export function FeedbackHistory() {
  return (
    <div className="space-y-4">
      {feedbackHistory.map((feedback) => (
        <Card key={feedback.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{feedback.service}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(feedback.date), "MMMM d, yyyy")}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={statusColors[feedback.status as keyof typeof statusColors]}
              >
                {feedback.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < feedback.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{feedback.category}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                <p className="text-sm">{feedback.comment}</p>
              </div>
            </div>

            {feedback.response && (
              <div className="mt-4 border-t pt-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response from Support</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(feedback.response.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm">{feedback.response.message}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                Edit Feedback
              </Button>
              {!feedback.response && (
                <Button variant="outline" size="sm" className="text-destructive">
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}

      {feedbackHistory.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No feedback history available</p>
        </Card>
      )}
    </div>
  );
}