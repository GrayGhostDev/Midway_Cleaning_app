"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isSameDay } from "date-fns";

const shifts = [
  {
    id: 1,
    employee: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john",
    },
    location: "Downtown Office",
    startTime: "2024-03-15T09:00:00",
    endTime: "2024-03-15T17:00:00",
    status: "Scheduled",
    type: "Regular",
  },
  {
    id: 2,
    employee: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah",
    },
    location: "Medical Center",
    startTime: "2024-03-15T10:00:00",
    endTime: "2024-03-15T18:00:00",
    status: "In Progress",
    type: "Overtime",
  },
  {
    id: 3,
    employee: {
      name: "Mike Wilson",
      image: "https://i.pravatar.cc/150?u=mike",
    },
    location: "Tech Park",
    startTime: "2024-03-15T14:00:00",
    endTime: "2024-03-15T22:00:00",
    status: "Completed",
    type: "Regular",
  },
];

const statusVariants = {
  "Scheduled": "default",
  "In Progress": "secondary",
  "Completed": "success",
} as const;

const typeColors = {
  Regular: "bg-blue-100 text-blue-800",
  Overtime: "bg-purple-100 text-purple-800",
  "On Call": "bg-orange-100 text-orange-800",
};

interface ShiftListProps {
  selectedDate: Date;
}

export function ShiftList({ selectedDate }: ShiftListProps) {
  const filteredShifts = shifts.filter((shift) =>
    isSameDay(new Date(shift.startTime), selectedDate)
  );

  return (
    <div className="space-y-4">
      {filteredShifts.map((shift) => (
        <Card key={shift.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={shift.employee.image} alt={shift.employee.name} />
                <AvatarFallback>{shift.employee.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{shift.employee.name}</h3>
                <p className="text-sm text-muted-foreground">{shift.location}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Shift</DropdownMenuItem>
                <DropdownMenuItem>Change Status</DropdownMenuItem>
                <DropdownMenuItem>Cancel Shift</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(shift.startTime), "h:mm a")} -{" "}
                {format(new Date(shift.endTime), "h:mm a")}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Badge variant={statusVariants[shift.status as keyof typeof statusVariants]}>
              {shift.status}
            </Badge>
            <Badge
              variant="outline"
              className={typeColors[shift.type as keyof typeof typeColors]}
            >
              {shift.type}
            </Badge>
          </div>
        </Card>
      ))}

      {filteredShifts.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No shifts scheduled for this date</p>
        </Card>
      )}
    </div>
  );
}