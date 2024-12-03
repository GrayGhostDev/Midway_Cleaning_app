"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceService, ServicePackage } from "@/lib/services/service.service";
import { useToast } from "@/components/ui/use-toast";

interface PackageListProps {
  searchQuery: string;
}

export function PackageList({ searchQuery }: PackageListProps) {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPackages = useCallback(async () => {
    try {
      const data = await ServiceService.getServicePackages();
      setPackages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service packages. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      {filteredPackages.map((pkg) => (
        <Card key={pkg.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{pkg.name}</h3>
              <div className="flex flex-wrap gap-2">
                {pkg.services.map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service.frequency}
                  </Badge>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Package</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Manage Services</DropdownMenuItem>
                <DropdownMenuItem>View Analytics</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  {pkg.services.length} Services
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  Multiple Frequencies
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm font-medium">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  Pricing
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly:</span>
                    <span>${pkg.pricing.monthly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quarterly:</span>
                    <span>${pkg.pricing.quarterly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual:</span>
                    <span>${pkg.pricing.annual}</span>
                  </div>
                </div>
              </div>
            </div>

            {pkg.discounts && pkg.discounts.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Available Discounts</h4>
                <div className="flex flex-wrap gap-2">
                  {pkg.discounts.map((discount, index) => (
                    <Badge key={index} variant="outline">
                      {discount.value}% {discount.type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </Card>
      ))}

      {filteredPackages.length === 0 && (
        <Card className="col-span-full p-8 text-center">
          <p className="text-muted-foreground">No packages found</p>
        </Card>
      )}
    </div>
  );
}