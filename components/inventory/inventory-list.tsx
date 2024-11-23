"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const inventory = [
  {
    id: 1,
    name: "All-Purpose Cleaner",
    category: "Cleaning Solutions",
    quantity: 45,
    minQuantity: 20,
    unit: "bottles",
    location: "Main Storage",
    lastRestocked: "2024-03-10",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Microfiber Cloths",
    category: "Supplies",
    quantity: 150,
    minQuantity: 100,
    unit: "pieces",
    location: "Supply Room B",
    lastRestocked: "2024-03-08",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Floor Buffer",
    category: "Equipment",
    quantity: 3,
    minQuantity: 2,
    unit: "units",
    location: "Equipment Room",
    lastRestocked: "2024-02-28",
    status: "In Stock",
  },
];

const statusColors = {
  "In Stock": "bg-green-100 text-green-800",
  "Low Stock": "bg-yellow-100 text-yellow-800",
  "Out of Stock": "bg-red-100 text-red-800",
};

interface InventoryListProps {
  searchQuery: string;
}

export function InventoryList({ searchQuery }: InventoryListProps) {
  const filteredItems = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Update Stock</DropdownMenuItem>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>View History</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock Level</span>
                <span>
                  {item.quantity} / {item.minQuantity} {item.unit}
                </span>
              </div>
              <Progress
                value={(item.quantity / item.minQuantity) * 100}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span>{item.location}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Restocked</span>
              <span>{item.lastRestocked}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge
              variant="outline"
              className={statusColors[item.status as keyof typeof statusColors]}
            >
              {item.status}
            </Badge>
            {item.quantity <= item.minQuantity && (
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="mr-1 h-4 w-4" />
                <span className="text-xs">Reorder needed</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}