"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";

const maintenanceSchedule = [
  {
    id: 1,
    equipmentName: "Industrial Vacuum #1",
    type: "Routine",
    dueDate: addDays(new Date(), 2),
    assignedTo: "John Smith",
    priority: "High",
    tasks: [
      "Check filters",
      "Clean dust compartment",
      "Inspect power cord",
      "Test suction power"
    ]
  },
  {
    id: 2,
    equipmentName: "Floor Buffer #3",
    type: "Preventive",
    dueDate: addDays(new Date(), 5),
    assignedTo: "Sarah Johnson",
    priority: "Medium",
    tasks: [
      "Replace brushes",
      "Check motor bearings",
      "Lubricate moving parts",
      "Test operation"
    ]
  },
  {
    id: 3,
    equipmentName: "Pressure Washer #2",
    type: "Repair",
    dueDate: new Date(),
    assignedTo: "Mike Wilson",
    priority: "Urgent",
    tasks: [
      "Replace pump seals",
      "Check pressure regulator",
      "Test water flow",
      "Inspect hoses"
    ]
  }
];

const priorityColors = {
  Urgent: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-blue-100 text-blue-800"
};

const typeColors = {
  Routine: "bg-green-100 text-green-800",
  Preventive: "bg-blue-100 text-blue-800",
  Repair: "bg-purple-100 text-purple-800"
};

export function MaintenanceSchedule() {
  return (
    <div className="space-y-4">
      {maintenanceSchedule.map((maintenance) => (
        <Card key={maintenance.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{maintenance.equipmentName}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={typeColors[maintenance.type as keyof typeof typeColors]}>
                  {maintenance.type}
                </Badge>
                <Badge variant="outline" className={priorityColors[maintenance.priority as keyof typeof priorityColors]}>
                  {maintenance.priority}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Wrench className="mr-2 h-4 w-4" />
              Start Maintenance
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Due: {format(maintenance.dueDate, "MMM d, yyyy")}
              </div>
              <span>Assigned to: {maintenance.assignedTo}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Maintenance Tasks:</h4>
              <ul className="grid grid-cols-2 gap-2">
                {maintenance.tasks.map((task, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {maintenance.priority === "Urgent" && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span className="text-sm">Requires immediate attention</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}