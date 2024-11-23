"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
          <Button variant="outline">Configure 2FA</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Login History</h3>
        <div className="space-y-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Chrome on Windows</p>
                  <p className="text-xs text-muted-foreground">
                    IP: 192.168.1.{i} • Last accessed March {15 - i}, 2024
                  </p>
                </div>
                <Badge variant={i === 1 ? "default" : "secondary"}>
                  {i === 1 ? "Current Session" : "Previous Session"}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            View Full History
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new sign-ins to your account
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trusted Devices Only</Label>
              <p className="text-sm text-muted-foreground">
                Only allow login from recognized devices
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="destructive">
          Sign Out All Devices
        </Button>
        <Button>
          Save Changes
        </Button>
      </div>
    </div>
  );
}