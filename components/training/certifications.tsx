"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Calendar, MoreVertical, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const certifications = [
  {
    id: 1,
    name: "Professional Cleaning Certification",
    employee: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john",
    },
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "Active",
    level: "Advanced",
    authority: "Cleaning Industry Association",
  },
  {
    id: 2,
    name: "Safety and Compliance Certificate",
    employee: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah",
    },
    issueDate: "2023-11-20",
    expiryDate: "2024-11-20",
    status: "Active",
    level: "Expert",
    authority: "Occupational Safety Board",
  },
  {
    id: 3,
    name: "Equipment Operation License",
    employee: {
      name: "Mike Wilson",
      image: "https://i.pravatar.cc/150?u=mike",
    },
    issueDate: "2023-08-10",
    expiryDate: "2024-08-10",
    status: "Expiring Soon",
    level: "Intermediate",
    authority: "Equipment Manufacturers Association",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "Expiring Soon": "bg-yellow-100 text-yellow-800",
  Expired: "bg-red-100 text-red-800",
};

const levelColors = {
  Basic: "bg-blue-100 text-blue-800",
  Intermediate: "bg-purple-100 text-purple-800",
  Advanced: "bg-orange-100 text-orange-800",
  Expert: "bg-indigo-100 text-indigo-800",
};

export function Certifications() {
  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <Card key={cert.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.authority}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Certificate</DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                <DropdownMenuItem>Renew Certificate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={cert.employee.image} alt={cert.employee.name} />
                <AvatarFallback>{cert.employee.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{cert.employee.name}</p>
                <p className="text-xs text-muted-foreground">Certificate Holder</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Issue Date:</span>
                <span>{cert.issueDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expiry Date:</span>
                <span>{cert.expiryDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={statusColors[cert.status as keyof typeof statusColors]}
              >
                {cert.status}
              </Badge>
              <Badge
                variant="outline"
                className={levelColors[cert.level as keyof typeof levelColors]}
              >
                {cert.level}
              </Badge>
            </div>
            {cert.status === "Expiring Soon" && (
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="mr-1 h-4 w-4" />
                <span className="text-xs">Renewal required soon</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}