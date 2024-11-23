"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Filter } from "lucide-react";
import { InventoryList } from "@/components/inventory/inventory-list";
import { AddInventoryDialog } from "@/components/inventory/add-inventory-dialog";
import { InventoryFilters } from "@/components/inventory/inventory-filters";

export default function InventoryPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            <Package className="mr-2 inline-block h-4 w-4" />
            Manage cleaning supplies and equipment
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search inventory..."
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

      {showFilters && <InventoryFilters />}
      <InventoryList searchQuery={search} />
      <AddInventoryDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}