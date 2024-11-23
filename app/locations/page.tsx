"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus } from "lucide-react";
import { LocationList } from "@/components/locations/location-list";
import { AddLocationDialog } from "@/components/locations/add-location-dialog";

export default function LocationsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            <Building2 className="mr-2 inline-block h-4 w-4" />
            Manage cleaning locations and facilities
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <LocationList searchQuery={search} />
      <AddLocationDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}