"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notificationTypes = [
  {
    id: "service-reminders",
    title: "Service Reminders",
    description: "Get notified about upcoming scheduled services",
  },
  {
    id: "service-updates",
    title: "Service Updates",
    description: "Receive updates during service delivery",
  },
  {
    id: "billing",
    title: "Billing Notifications",
    description: "Get notified about invoices and payments",
  },
  {
    id: "promotions",
    title: "Promotions & Offers",
    description: "Receive special offers and promotions",
  },
];

const channels = [
  {
    id: "email",
    title: "Email Notifications",
    description: "Receive notifications via email",
  },
  {
    id: "sms",
    title: "SMS Notifications",
    description: "Get text message notifications",
  },
  {
    id: "push",
    title: "Push Notifications",
    description: "Receive notifications in your browser",
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