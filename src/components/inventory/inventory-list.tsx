import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/dashboard/ui/data-table';
import { AddInventoryDialog } from './add-inventory-dialog';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  lastRestocked: string;
  location: string;
}

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Category',
    accessorKey: 'category',
  },
  {
    header: 'Quantity',
    accessorKey: 'quantity',
    cell: ({ row }: { row: { original: InventoryItem } }) => (
      <span
        className={`${
          row.original.quantity <= row.original.reorderPoint
            ? 'text-red-600'
            : ''
        }`}
      >
        {row.original.quantity} {row.original.unit}
      </span>
    ),
  },
  {
    header: 'Reorder Point',
    accessorKey: 'reorderPoint',
  },
  {
    header: 'Last Restocked',
    accessorKey: 'lastRestocked',
  },
  {
    header: 'Location',
    accessorKey: 'location',
  },
];

export function InventoryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'All-Purpose Cleaner',
      category: 'Cleaning Solutions',
      quantity: 50,
      unit: 'bottles',
      reorderPoint: 20,
      lastRestocked: '2024-01-15',
      location: 'Storage Room A',
    },
    {
      id: '2',
      name: 'Microfiber Cloths',
      category: 'Cleaning Supplies',
      quantity: 15,
      unit: 'packs',
      reorderPoint: 25,
      lastRestocked: '2024-01-10',
      location: 'Storage Room B',
    },
    // Add more inventory items as needed
  ]);

  const handleAddInventory = (newItem: Omit<InventoryItem, 'id'>) => {
    // Handle adding new inventory item
    console.log('Adding new inventory item:', newItem);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.reorderPoint
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Items
          </div>
          <div className="text-2xl font-bold">{inventory.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="text-2xl font-bold text-red-600">
            {lowStockItems.length}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Categories
          </div>
          <div className="text-2xl font-bold">
            {new Set(inventory.map((item) => item.category)).size}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <AddInventoryDialog onAdd={handleAddInventory} />
      </div>

      <DataTable
        title="Inventory"
        description="Manage your cleaning supplies and materials"
        columns={columns}
        data={filteredInventory}
      />

      {lowStockItems.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Low Stock Alert</h3>
          <ul className="mt-2 space-y-1">
            {lowStockItems.map((item) => (
              <li key={item.id} className="text-sm text-red-700">
                {item.name} - Only {item.quantity} {item.unit} remaining
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
