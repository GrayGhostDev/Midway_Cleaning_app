"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  MapPin,
  CheckCircle2,
  User,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, name: "Team Assigned", completed: true, time: "9:00 AM" },
  { id: 2, name: "En Route", completed: true, time: "9:45 AM" },
  { id: 3, name: "Service Started", completed: true, time: "10:00 AM" },
  { id: 4, name: "In Progress", completed: false, time: "Current" },
  { id: 5, name: "Quality Check", completed: false, time: "Pending" },
  { id: 6, name: "Completed", completed: false, time: "Pending" },
];

export function ServiceTracking() {
  const progress = (steps.filter((step) => step.completed).length / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Current Service Status</h3>
              <p className="text-sm text-muted-foreground">Regular Cleaning</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-4 ${
                  step.completed ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    step.completed ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{step.name}</p>
                  <p className="text-sm">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Service Details</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Estimated Duration: 2 hours</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location: Main Office</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Cleaning Team</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">John Smith (Team Lead)</span>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}