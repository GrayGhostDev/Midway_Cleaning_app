import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/dashboard/ui/data-table';
import { AddEquipmentDialog } from './add-equipment-dialog';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  lastMaintenance: string;
}

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'available'
              ? 'bg-green-100 text-green-800'
              : status === 'in-use'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: 'Location',
    accessorKey: 'location',
  },
  {
    header: 'Last Maintenance',
    accessorKey: 'lastMaintenance',
  },
];

export function EquipmentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Vacuum Cleaner A1',
      type: 'Vacuum',
      status: 'available',
      location: 'Storage Room 1',
      lastMaintenance: '2024-01-15',
    },
    {
      id: '2',
      name: 'Floor Scrubber B2',
      type: 'Scrubber',
      status: 'in-use',
      location: 'Building B',
      lastMaintenance: '2024-01-10',
    },
    // Add more equipment as needed
  ]);

  const handleAddEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    // Handle adding new equipment
    console.log('Adding new equipment:', newEquipment);
  };

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <AddEquipmentDialog onAdd={handleAddEquipment} />
      </div>

      <DataTable
        title="Equipment"
        description="Manage your cleaning equipment inventory"
        columns={columns}
        data={filteredEquipment}
      />
    </div>
  );
}
