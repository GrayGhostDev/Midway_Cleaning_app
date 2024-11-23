"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://i.pravatar.cc/150?u=client" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Client Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="client@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Business Information</h3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" defaultValue="Client Company" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" defaultValue="123 Business St" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tax-id">Tax ID/EIN</Label>
            <Input id="tax-id" defaultValue="XX-XXXXXXX" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}