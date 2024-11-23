"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { startOfWeek, addDays, format } from "date-fns";

interface WeeklyScheduleProps {
  selectedDate: Date;
}

const shifts = [
  {
    id: 1,
    employee: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john",
    },
    location: "Downtown Office",
    type: "Morning",
    days: [0, 1, 2, 3, 4],
  },
  {
    id: 2,
    employee: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah",
    },
    location: "Medical Center",
    type: "Evening",
    days: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    employee: {
      name: "Mike Wilson",
      image: "https://i.pravatar.cc/150?u=mike",
    },
    location: "Tech Park",
    type: "Night",
    days: [2, 3, 4, 5, 6],
  },
];

const shiftTypes = {
  Morning: "bg-blue-100 text-blue-800",
  Evening: "bg-purple-100 text-purple-800",
  Night: "bg-indigo-100 text-indigo-800",
};

export function WeeklySchedule({ selectedDate }: WeeklyScheduleProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-8 gap-4">
        <div className="pt-16">
          <h3 className="text-sm font-medium text-muted-foreground">Staff</h3>
        </div>
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center">
            <p className="text-sm font-medium">{format(day, "EEE")}</p>
            <p className="text-sm text-muted-foreground">{format(day, "MMM d")}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {shifts.map((shift) => (
          <Card key={shift.id} className="p-4">
            <div className="grid grid-cols-8 gap-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={shift.employee.image} alt={shift.employee.name} />
                  <AvatarFallback>{shift.employee.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{shift.employee.name}</p>
                  <p className="text-xs text-muted-foreground">{shift.location}</p>
                </div>
              </div>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex items-center justify-center">
                  {shift.days.includes(i) && (
                    <Badge
                      variant="outline"
                      className={shiftTypes[shift.type as keyof typeof shiftTypes]}
                    >
                      {shift.type}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}