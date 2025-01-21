"use client";

import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { MoreVertical, Clock, Users, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const courses = [
  {
    id: 1,
    title: "Basic Cleaning Techniques",
    description: "Learn fundamental cleaning methods and best practices",
    duration: "2 hours",
    enrolled: 24,
    completion: 85,
    status: "Active",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Advanced Sanitization",
    description: "Advanced techniques for medical facility cleaning",
    duration: "4 hours",
    enrolled: 18,
    completion: 72,
    status: "Active",
    level: "Advanced",
  },
  {
    id: 3,
    title: "Equipment Safety",
    description: "Safety protocols for cleaning equipment operation",
    duration: "3 hours",
    enrolled: 32,
    completion: 94,
    status: "Active",
    level: "Intermediate",
  },
];

const levelColors = {
  Beginner: "bg-blue-100 text-blue-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-purple-100 text-purple-800",
};

interface CourseListProps {
  searchQuery: string;
}

export function CourseList({ searchQuery }: CourseListProps) {
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredCourses.map((course) => (
        <Card key={course.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Course</DropdownMenuItem>
                <DropdownMenuItem>Manage Enrollments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {course.duration}
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                {course.enrolled} Enrolled
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                Completion Rate
              </div>
              <Progress value={course.completion} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={levelColors[course.level as keyof typeof levelColors]}
            >
              {course.level}
            </Badge>
            <Button variant="outline" size="sm">
              View Course
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}