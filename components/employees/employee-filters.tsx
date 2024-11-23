"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeFilters() {
  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="cleaner">Cleaner</SelectItem>
              <SelectItem value="senior-cleaner">Senior Cleaner</SelectItem>
              <SelectItem value="team-lead">Team Lead</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="downtown">Downtown Office</SelectItem>
              <SelectItem value="medical">Medical Center</SelectItem>
              <SelectItem value="tech-park">Tech Park</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Performance</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="excellent">Excellent (4.5+)</SelectItem>
              <SelectItem value="good">Good (4.0-4.4)</SelectItem>
              <SelectItem value="average">Average (3.0-3.9)</SelectItem>
              <SelectItem value="below">Below Average (&lt;3.0)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}