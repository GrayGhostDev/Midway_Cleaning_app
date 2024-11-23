"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notificationTypes = [
  {
    id: "tasks",
    title: "Task Updates",
    description: "Get notified when tasks are assigned, completed, or modified",
  },
  {
    id: "schedule",
    title: "Schedule Changes",
    description: "Receive updates about shift changes and schedule modifications",
  },
  {
    id: "inventory",
    title: "Inventory Alerts",
    description: "Get alerts for low stock and inventory updates",
  },
  {
    id: "maintenance",
    title: "Equipment Maintenance",
    description: "Notifications about equipment maintenance and repairs",
  },
  {
    id: "quality",
    title: "Quality Control",
    description: "Updates on quality inspections and reports",
  },
];

const channels = [
  {
    id: "email",
    title: "Email Notifications",
    description: "Receive notifications via email",
  },
  {
    id: "push",
    title: "Push Notifications",
    description: "Get notifications in your browser or mobile app",
  },
  {
    id: "sms",
    title: "SMS Notifications",
    description: "Receive text message notifications",
  },
];

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={type.id}>{type.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <Switch id={type.id} defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={channel.id}>{channel.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {channel.description}
                </p>
              </div>
              <Switch id={channel.id} defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}