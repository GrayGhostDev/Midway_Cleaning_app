"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const integrations = [
  {
    id: "calendar",
    name: "Calendar Integration",
    description: "Sync schedules with Google Calendar or Outlook",
    connected: true,
    provider: "Google Calendar",
  },
  {
    id: "accounting",
    name: "Accounting Software",
    description: "Connect with QuickBooks or Xero",
    connected: false,
    provider: null,
  },
  {
    id: "communication",
    name: "Communication Tools",
    description: "Integrate with Slack or Microsoft Teams",
    connected: true,
    provider: "Slack",
  },
  {
    id: "storage",
    name: "Cloud Storage",
    description: "Connect with Dropbox or Google Drive",
    connected: false,
    provider: null,
  },
];

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      {integrations.map((integration) => (
        <Card key={integration.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
              {integration.connected && (
                <p className="text-sm text-green-600">
                  Connected to {integration.provider}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={integration.connected} />
              <Button variant="outline" size="sm">
                {integration.connected ? "Configure" : "Connect"}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}