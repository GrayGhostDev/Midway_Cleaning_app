"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const staff = [
  {
    id: 1,
    name: "John Smith",
    image: "https://i.pravatar.cc/150?u=john",
    role: "Senior Cleaner",
    availability: "Full-time",
    preferredLocation: "Downtown Office",
    schedule: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
    },
    status: "Available",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    image: "https://i.pravatar.cc/150?u=sarah",
    role: "Team Lead",
    availability: "Part-time",
    preferredLocation: "Medical Center",
    schedule: {
      monday: "10:00 AM - 4:00 PM",
      wednesday: "10:00 AM - 4:00 PM",
      friday: "10:00 AM - 4:00 PM",
    },
    status: "On Leave",
  },
  {
    id: 3,
    name: "Mike Wilson",
    image: "https://i.pravatar.cc/150?u=mike",
    role: "Cleaner",
    availability: "Full-time",
    preferredLocation: "Tech Park",
    schedule: {
      monday: "2:00 PM - 10:00 PM",
      tuesday: "2:00 PM - 10:00 PM",
      wednesday: "2:00 PM - 10:00 PM",
      thursday: "2:00 PM - 10:00 PM",
      friday: "2:00 PM - 10:00 PM",
    },
    status: "Available",
  },
];

const statusColors = {
  Available: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  "Off Duty": "bg-gray-100 text-gray-800",
};

export function StaffAvailability() {
  return (
    <div className="space-y-6">
      {staff.map((member) => (
        <Card key={member.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={statusColors[member.status as keyof typeof statusColors]}
            >
              {member.status}
            </Badge>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{member.availability}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.preferredLocation}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Weekly Schedule
              </h4>
              {Object.entries(member.schedule).map(([day, time]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{day}:</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" size="sm">View Full Schedule</Button>
            <Button size="sm">Assign Shift</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}