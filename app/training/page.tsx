"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search } from "lucide-react";
import { CourseList } from "../../components/training/course-list";
import { AddCourseDialog } from "../../components/training/add-course-dialog";
import { TrainingMetrics } from "@/components/training/training-metrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeProgress } from "@/components/training/employee-progress";
import { Certifications } from "@/components/training/certifications";

export default function TrainingPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Training</h1>
          <p className="text-muted-foreground">
            <GraduationCap className="mr-2 inline-block h-4 w-4" />
            Manage employee training and development
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <TrainingMetrics />

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="progress">Employee Progress</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <CourseList searchQuery={search} />
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <EmployeeProgress />
        </TabsContent>

        <TabsContent value="certifications">
          <Certifications />
        </TabsContent>
      </Tabs>

      <AddCourseDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}