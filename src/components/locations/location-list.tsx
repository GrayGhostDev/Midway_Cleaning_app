import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/dashboard/ui/data-table';
import { AddLocationDialog } from './add-location-dialog';

interface Location {
  id: string;
  name: string;
  address: string;
  type: string;
  size: number;
  cleaningFrequency: string;
  lastCleaned: string;
  nextScheduled: string;
}

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Address',
    accessorKey: 'address',
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
  {
    header: 'Size (sq ft)',
    accessorKey: 'size',
    cell: (value: number) => value.toLocaleString(),
  },
  {
    header: 'Cleaning Frequency',
    accessorKey: 'cleaningFrequency',
  },
  {
    header: 'Last Cleaned',
    accessorKey: 'lastCleaned',
  },
  {
    header: 'Next Scheduled',
    accessorKey: 'nextScheduled',
  },
];

export function LocationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'Office Building A',
      address: '123 Business St, City, State',
      type: 'Office',
      size: 5000,
      cleaningFrequency: 'Daily',
      lastCleaned: '2024-01-15',
      nextScheduled: '2024-01-16',
    },
    {
      id: '2',
      name: 'Retail Store B',
      address: '456 Shopping Ave, City, State',
      type: 'Retail',
      size: 3000,
      cleaningFrequency: 'Weekly',
      lastCleaned: '2024-01-10',
      nextScheduled: '2024-01-17',
    },
    // Add more locations as needed
  ]);

  const handleAddLocation = (newLocation: Omit<Location, 'id'>) => {
    // Handle adding new location
    console.log('Adding new location:', newLocation);
  };

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = locations.reduce((sum, location) => sum + location.size, 0);
  const locationTypes = new Set(locations.map((location) => location.type));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Locations
          </div>
          <div className="text-2xl font-bold">{locations.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Area
          </div>
          <div className="text-2xl font-bold">
            {totalSize.toLocaleString()} sq ft
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Location Types
          </div>
          <div className="text-2xl font-bold">{locationTypes.size}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <AddLocationDialog onAdd={handleAddLocation} />
      </div>

      <DataTable
        title="Locations"
        description="View and manage cleaning locations"
        columns={columns}
        data={filteredLocations}
      />
    </div>
  );
}
