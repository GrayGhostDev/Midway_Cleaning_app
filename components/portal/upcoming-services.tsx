"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const upcomingServices = [
  {
    id: 1,
    type: "Regular Cleaning",
    date: "2024-03-20",
    time: "09:00 AM",
    duration: "2 hours",
    location: "Main Office",
    status: "Confirmed",
  },
  {
    id: 2,
    type: "Deep Cleaning",
    date: "2024-03-25",
    time: "02:00 PM",
    duration: "4 hours",
    location: "Warehouse",
    status: "Pending",
  },
];

const statusColors = {
  Confirmed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function UpcomingServices() {
  return (
    <div className="space-y-4">
      {upcomingServices.map((service) => (
        <Card key={service.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{service.type}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(service.date), "MMMM d, yyyy")}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Cancel Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {service.time} ({service.duration})
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{service.location}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[service.status as keyof typeof statusColors]}
            >
              {service.status}
            </Badge>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </Card>
      ))}

      {upcomingServices.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No upcoming services scheduled</p>
          <Button className="mt-4">Book a Service</Button>
        </Card>
      )}
    </div>
  );
}