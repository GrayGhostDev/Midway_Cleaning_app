"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wrench, Tool, MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EquipmentService, Equipment } from "@/lib/services/equipment.service";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  Available: "bg-green-100 text-green-800",
  "In Use": "bg-blue-100 text-blue-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
  Retired: "bg-red-100 text-red-800",
};

interface EquipmentListProps {
  searchQuery: string;
}

export function EquipmentList({ searchQuery }: EquipmentListProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const data = await EquipmentService.getAllEquipment();
      setEquipment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load equipment data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: number, status: Equipment["status"]) {
    try {
      await EquipmentService.updateStatus(id, status);
      await loadEquipment();
      toast({
        title: "Status Updated",
        description: "Equipment status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update equipment status. Please try again.",
        variant: "destructive",
      });
    }
  }

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredEquipment.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.manufacturer} - {item.serialNumber}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Available")}>
                  Mark as Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(item.id, "In Use")}>
                  Mark as In Use
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Maintenance")}>
                  Schedule Maintenance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Tool className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Location: {item.location}</span>
              </div>
              {item.assignedTo && (
                <span className="text-muted-foreground">
                  Assigned to: {item.assignedTo.name}
                </span>
              )}
            </div>

            {item.maintenanceHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Maintenance</span>
                  <span>
                    {new Date(
                      item.maintenanceHistory[item.maintenanceHistory.length - 1].date
                    ).toLocaleDateString()}
                  </span>
                </div>
                <Progress
                  value={
                    ((new Date().getTime() -
                      new Date(
                        item.maintenanceHistory[item.maintenanceHistory.length - 1].date
                      ).getTime()) /
                      (30 * 24 * 60 * 60 * 1000)) *
                    100
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[item.status]}
            >
              {item.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance Log
            </Button>
          </div>
        </Card>
      ))}

      {filteredEquipment.length === 0 && (
        <Card className="col-span-full p-8 text-center">
          <p className="text-muted-foreground">No equipment found</p>
        </Card>
      )}
    </div>
  );
}