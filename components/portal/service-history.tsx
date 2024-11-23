"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Star,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const services = [
  {
    id: 1,
    type: "Regular Cleaning",
    location: "Main Office",
    date: "2024-03-15",
    time: "9:00 AM - 11:00 AM",
    status: "Completed",
    rating: 5,
    feedback: "Excellent service, very thorough cleaning.",
  },
  {
    id: 2,
    type: "Deep Cleaning",
    location: "Warehouse",
    date: "2024-03-10",
    time: "1:00 PM - 5:00 PM",
    status: "Completed",
    rating: 4,
    feedback: "Good job overall, some areas needed touch-up.",
  },
  {
    id: 3,
    type: "Window Cleaning",
    location: "Retail Store",
    date: "2024-03-20",
    time: "10:00 AM - 12:00 PM",
    status: "Scheduled",
  },
];

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function ServiceHistory() {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{service.type}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {service.location}
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
                <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                <DropdownMenuItem>Request Similar Service</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {service.date}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {service.time}
              </div>
            </div>
            <div className="space-y-2">
              {service.rating && (
                <div className="flex items-center text-sm">
                  <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                  Rating: {service.rating}/5
                </div>
              )}
              {service.feedback && (
                <div className="flex items-center text-sm">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  {service.feedback}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[service.status as keyof typeof statusColors]}
            >
              {service.status}
            </Badge>
            {service.status === "Completed" && !service.rating && (
              <Button variant="outline" size="sm">
                Leave Feedback
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}