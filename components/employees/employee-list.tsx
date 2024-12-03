"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeService, Employee } from "@/lib/services/employee.service";
import { useToast } from "@/components/ui/use-toast";

interface EmployeeListProps {
  searchQuery: string;
}

export function EmployeeList({ searchQuery }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadEmployees = useCallback(async () => {
    try {
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-muted" />
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredEmployees.map((employee) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>View Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Edit Details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Assign Tasks</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm font-medium">{employee.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                {employee.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Performance</span>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{employee.performance}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {filteredEmployees.length === 0 && (
        <div className="col-span-full text-center">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      )}
    </div>
  );
}