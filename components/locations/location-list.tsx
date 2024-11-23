"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  CalendarRange,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locations = [
  {
    id: 1,
    name: "Downtown Office",
    address: "123 Business Ave, Downtown",
    type: "Office Building",
    size: "50,000 sq ft",
    cleaningFrequency: "Daily",
    assignedStaff: 5,
    operatingHours: "8:00 AM - 6:00 PM",
    status: "Active",
    nextScheduled: "2024-03-15",
  },
  {
    id: 2,
    name: "Medical Center",
    address: "456 Health Blvd, Midtown",
    type: "Healthcare Facility",
    size: "75,000 sq ft",
    cleaningFrequency: "24/7",
    assignedStaff: 8,
    operatingHours: "24 Hours",
    status: "Active",
    nextScheduled: "2024-03-14",
  },
  {
    id: 3,
    name: "Tech Park",
    address: "789 Innovation Way",
    type: "Office Complex",
    size: "100,000 sq ft",
    cleaningFrequency: "Daily",
    assignedStaff: 10,
    operatingHours: "7:00 AM - 8:00 PM",
    status: "Maintenance",
    nextScheduled: "2024-03-16",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

interface LocationListProps {
  searchQuery: string;
}

export function LocationList({ searchQuery }: LocationListProps) {
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredLocations.map((location) => (
        <Card key={location.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{location.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {location.address}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>View Schedule</DropdownMenuItem>
                <DropdownMenuItem>Manage Staff</DropdownMenuItem>
                <DropdownMenuItem>View Reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                {location.type}
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                {location.assignedStaff} Staff
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {location.operatingHours}
              </div>
              <div className="flex items-center text-sm">
                <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                {location.cleaningFrequency}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[location.status as keyof typeof statusColors]}
            >
              {location.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {location.size}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}