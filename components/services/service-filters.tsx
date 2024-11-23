"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ServiceFilters() {
  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="regular">Regular Cleaning</SelectItem>
              <SelectItem value="deep">Deep Cleaning</SelectItem>
              <SelectItem value="specialized">Specialized Services</SelectItem>
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
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">1-2 Hours</SelectItem>
              <SelectItem value="medium">2-4 Hours</SelectItem>
              <SelectItem value="long">4+ Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Staff Required</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Staff Size</SelectItem>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3+">3+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}