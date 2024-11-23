"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, MoreVertical, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ServiceService } from "@/lib/services/service.service";
import { useToast } from "@/components/ui/use-toast";

interface ServiceScheduleProps {
  selectedDate: Date;
}

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function ServiceSchedule({ selectedDate }: ServiceScheduleProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, [selectedDate]);

  async function loadBookings() {
    try {
      // In a real application, this would fetch from your API
      const mockBookings = [
        {
          id: 1,
          service: "Deep Cleaning",
          client: {
            name: "Tech Corp",
            image: "https://i.pravatar.cc/150?u=tech",
          },
          time: "09:00 AM",
          duration: "3 hours",
          location: "Downtown Office",
          staff: 2,
          status: "Scheduled",
        },
        {
          id: 2,
          service: "Regular Maintenance",
          client: {
            name: "Medical Center",
            image: "https://i.pravatar.cc/150?u=medical",
          },
          time: "02:00 PM",
          duration: "2 hours",
          location: "Medical Center",
          staff: 1,
          status: "In Progress",
        },
      ];
      setBookings(mockBookings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">
        Schedule for {format(selectedDate, "MMMM d, yyyy")}
      </h2>

      {bookings.map((booking) => (
        <Card key={booking.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={booking.client.image} alt={booking.client.name} />
                <AvatarFallback>{booking.client.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{booking.service}</h3>
                <p className="text-sm text-muted-foreground">
                  {booking.client.name}
                </p>
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
                <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                <DropdownMenuItem>Cancel Booking</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {booking.time} ({booking.duration})
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {booking.location}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                {booking.staff} Staff Required
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[booking.status as keyof typeof statusColors]}
            >
              {booking.status}
            </Badge>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </Card>
      ))}

      {bookings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No bookings for this date</p>
        </Card>
      )}
    </div>
  );
}