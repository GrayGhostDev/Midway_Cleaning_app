"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tool, AlertTriangle } from "lucide-react";
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
              <Tool className="mr-2 h-4 w-4" />
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
  );</content></file>

<boltAction type="file" filePath="components/equipment/maintenance-history.tsx">"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Tool, FileText, DollarSign } from "lucide-react";
import { format } from "date-fns";

const maintenanceHistory = [
  {
    id: 1,
    equipmentName: "Industrial Vacuum #1",
    date: "2024-03-10",
    type: "Routine",
    technician: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john"
    },
    actions: [
      "Replaced HEPA filter",
      "Cleaned dust compartment",
      "Checked electrical connections"
    ],
    cost: 150,
    notes: "Equipment in good condition, next maintenance scheduled in 3 months"
  },
  {
    id: 2,
    equipmentName: "Floor Buffer #3",
    date: "2024-03-08",
    type: "Repair",
    technician: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah"
    },
    actions: [
      "Replaced motor bearings",
      "Installed new power switch",
      "Calibrated speed control"
    ],
    cost: 320,
    notes: "Major repair completed, equipment now functioning normally"
  }
];

const typeColors = {
  Routine: "bg-green-100 text-green-800",
  Repair: "bg-purple-100 text-purple-800",
  Inspection: "bg-blue-100 text-blue-800"
};

export function MaintenanceHistory() {
  return (
    <div className="space-y-4">
      {maintenanceHistory.map((record) => (
        <Card key={record.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{record.equipmentName}</h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={typeColors[record.type as keyof typeof typeColors]}
                >
                  {record.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  <Calendar className="mr-1 inline-block h-4 w-4" />
                  {format(new Date(record.date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Report
            </Button>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={record.technician.image} alt={record.technician.name} />
              <AvatarFallback>{record.technician.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{record.technician.name}</p>
              <p className="text-sm text-muted-foreground">Maintenance Technician</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Actions Performed:</h4>
            <ul className="space-y-1">
              {record.actions.map((action, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Tool className="mr-2 h-4 w-4 text-muted-foreground" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cost: ${record.cost}</span>
            </div>
            <p className="text-sm text-muted-foreground">{record.notes}</p>
          </div>
        </Card>
      ))}
    </div>
  );</content></file>

<boltAction type="start">
<command>npm run dev</command>