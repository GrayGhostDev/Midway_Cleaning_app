"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Plus, Filter } from "lucide-react";
import { EquipmentList } from "@/components/equipment/equipment-list";
import { AddEquipmentDialog } from "@/components/equipment/add-equipment-dialog";
import { EquipmentFilters } from "@/components/equipment/equipment-filters";
import { EquipmentMetrics } from "@/components/equipment/equipment-metrics";

export default function EquipmentPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
          <p className="text-muted-foreground">
            <Wrench className="mr-2 inline-block h-4 w-4" />
            Manage cleaning equipment and maintenance
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <EquipmentMetrics />
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search equipment..."
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

      {showFilters && <EquipmentFilters />}
      <EquipmentList searchQuery={search} />
      <AddEquipmentDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}