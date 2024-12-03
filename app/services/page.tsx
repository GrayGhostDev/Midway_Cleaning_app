"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Plus, Filter } from "lucide-react";
import { ServiceList } from "@/components/services/service-list";
import { AddServiceDialog } from "@/components/services/add-service-dialog";
import { ServiceMetrics } from "@/components/services/service-metrics";
import { ServiceFilters } from "@/components/services/service-filters";

export default function ServicesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            <Briefcase className="mr-2 inline-block h-4 w-4" />
            Manage cleaning services and packages
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <ServiceMetrics />
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search services..."
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

      {showFilters && <ServiceFilters />}
      <ServiceList searchQuery={search} />
      <AddServiceDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}