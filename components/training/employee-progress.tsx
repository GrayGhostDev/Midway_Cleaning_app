"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Clock, Award } from "lucide-react";

const employees = [
  {
    id: 1,
    name: "John Smith",
    image: "https://i.pravatar.cc/150?u=john",
    role: "Senior Cleaner",
    coursesCompleted: 8,
    totalCourses: 10,
    currentCourse: "Advanced Sanitization",
    progress: 75,
    hoursCompleted: 24,
    certificates: 3,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    image: "https://i.pravatar.cc/150?u=sarah",
    role: "Team Lead",
    coursesCompleted: 12,
    totalCourses: 12,
    currentCourse: "Management Skills",
    progress: 90,
    hoursCompleted: 36,
    certificates: 5,
  },
  {
    id: 3,
    name: "Mike Wilson",
    image: "https://i.pravatar.cc/150?u=mike",
    role: "Cleaner",
    coursesCompleted: 4,
    totalCourses: 8,
    currentCourse: "Equipment Safety",
    progress: 45,
    hoursCompleted: 12,
    certificates: 2,
  },
];

export function EmployeeProgress() {
  return (
    <div className="space-y-6">
      {employees.map((employee) => (
        <Card key={employee.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.image} alt={employee.name} />
                <AvatarFallback>{employee.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Course Progress</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {employee.coursesCompleted}/{employee.totalCourses}
                </span>
              </div>
              <Progress value={(employee.coursesCompleted / employee.totalCourses) * 100} />
              <p className="text-xs text-muted-foreground">
                Current: {employee.currentCourse}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Hours Completed</span>
              </div>
              <p className="text-2xl font-bold">{employee.hoursCompleted}</p>
              <p className="text-xs text-muted-foreground">
                Training hours this month
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Certificates Earned</span>
              </div>
              <p className="text-2xl font-bold">{employee.certificates}</p>
              <div className="flex gap-2">
                {Array.from({ length: employee.certificates }).map((_, i) => (
                  <Badge key={i} variant="secondary">
                    Level {i + 1}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}