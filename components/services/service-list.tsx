"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, DollarSign, Users, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceService, Service } from "@/lib/services/service.service";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "Under Review": "bg-yellow-100 text-yellow-800",
  Discontinued: "bg-red-100 text-red-800",
};

interface ServiceListProps {
  searchQuery: string;
}

export function ServiceList({ searchQuery }: ServiceListProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadServices = useCallback(async () => {
    try {
      const data = await ServiceService.getAllServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      {filteredServices.map((service) => (
        <Card key={service.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Service</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Manage Pricing</DropdownMenuItem>
                <DropdownMenuItem>View Analytics</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Duration: {service.duration}
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                Rate: ${service.rate}/{service.rateUnit}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                Staff Required: {service.staffRequired}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Utilization</span>
                <span>{service.utilization}%</span>
              </div>
              <Progress value={service.utilization} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[service.status as keyof typeof statusColors]}
            >
              {service.status}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              {service.lastUpdated}
            </div>
          </div>
        </Card>
      ))}

      {filteredServices.length === 0 && (
        <Card className="col-span-full p-8 text-center">
          <p className="text-muted-foreground">No services found</p>
        </Card>
      )}
    </div>
  );
}