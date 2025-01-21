"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { ClipboardCheck, MoreVertical, MapPin, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { QualityService, Inspection } from "@/lib/services/quality.service";
import { useToast } from "../../components/ui/use-toast";

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};

interface InspectionListProps {
  searchQuery: string;
}

export function InspectionList({ searchQuery }: InspectionListProps) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInspections = useCallback(async () => {
    try {
      const data = await QualityService.getInspections();
      setInspections(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inspections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInspections();
  }, [loadInspections]);

  const filteredInspections = inspections.filter((inspection) =>
    inspection.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-muted" />
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
    <div className="space-y-4">
      {filteredInspections.map((inspection) => (
        <Card key={inspection.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{inspection.location}</h3>
                <Badge variant="outline">{inspection.type}</Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {inspection.location}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Inspection</DropdownMenuItem>
                <DropdownMenuItem>Download Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={inspection.inspector.image}
                    alt={inspection.inspector.name}
                  />
                  <AvatarFallback>{inspection.inspector.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{inspection.inspector.name}</p>
                  <p className="text-xs text-muted-foreground">Inspector</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {inspection.date}
              </div>
            </div>

            {inspection.items && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Checklist Progress</span>
                  <span>
                    {inspection.items.passed} / {inspection.items.total} Items
                  </span>
                </div>
                <Progress
                  value={(inspection.items.passed / inspection.items.total) * 100}
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[inspection.status as keyof typeof statusColors]}
            >
              {inspection.status}
            </Badge>
            {inspection.score && (
              <div className="flex items-center">
                <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-medium">Score: {inspection.score}%</span>
              </div>
            )}
          </div>
        </Card>
      ))}

      {filteredInspections.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No inspections found</p>
        </Card>
      )}
    </div>
  );
}