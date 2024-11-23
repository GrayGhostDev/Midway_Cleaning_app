"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Filter } from "lucide-react";
import { PackageList } from "@/components/services/packages/package-list";
import { AddPackageDialog } from "@/components/services/packages/add-package-dialog";
import { PackageMetrics } from "@/components/services/packages/package-metrics";

export default function ServicePackagesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Service Packages</h1>
          <p className="text-muted-foreground">
            <Package className="mr-2 inline-block h-4 w-4" />
            Manage and customize cleaning service packages
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </div>

      <PackageMetrics />
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <PackageList searchQuery={search} />
      <AddPackageDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}