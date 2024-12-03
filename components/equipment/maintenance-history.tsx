'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'repair' | 'maintenance' | 'inspection';
  description: string;
  technician: string;
  cost: number;
  status: 'completed' | 'pending' | 'in-progress';
}

interface MaintenanceHistoryProps {
  equipmentId: string;
}

export function MaintenanceHistory({ equipmentId }: MaintenanceHistoryProps) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Implement actual data fetching
  // useEffect(() => {
  //   fetchMaintenanceHistory(equipmentId).then(data => {
  //     setRecords(data);
  //     setIsLoading(false);
  //   });
  // }, [equipmentId]);

  const getStatusColor = (status: MaintenanceRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading maintenance history...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{record.type}</TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell>{record.technician}</TableCell>
              <TableCell>${record.cost.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No maintenance records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
