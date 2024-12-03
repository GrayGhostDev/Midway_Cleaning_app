"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Filter } from "lucide-react";
import { EmployeeList } from "@/components/employees/employee-list";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeMetrics } from "@/components/employees/employee-metrics";

// Mock data for employee metrics
const mockEmployeeMetrics = {
  totalEmployees: 25,
  activeEmployees: 22,
  employeeGrowth: 8,
  employeesByRole: [
    { role: "Cleaner", count: 15 },
    { role: "Supervisor", count: 5 },
    { role: "Manager", count: 2 },
  ],
  employeeHistory: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2023, i, 1).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 10) + 20,
  })),
};

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            <UserPlus className="mr-2 inline-block h-4 w-4" />
            Manage cleaning staff and assignments
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeMetrics {...mockEmployeeMetrics} />
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && <EmployeeFilters />}
      <EmployeeList searchQuery={search} />
      <AddEmployeeDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}