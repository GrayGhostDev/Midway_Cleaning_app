import { DataTable } from '@/components/dashboard/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/dashboard/ui/chart';

interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  taskDescription: string;
  date: string;
  technician: string;
  cost: number;
  notes: string;
}

const columns = [
  {
    header: 'Equipment',
    accessorKey: 'equipmentName',
  },
  {
    header: 'Task',
    accessorKey: 'taskDescription',
  },
  {
    header: 'Date',
    accessorKey: 'date',
  },
  {
    header: 'Technician',
    accessorKey: 'technician',
  },
  {
    header: 'Cost',
    accessorKey: 'cost',
    cell: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    header: 'Notes',
    accessorKey: 'notes',
  },
];

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
  costTrend: {
    date: string;
    value: number;
  }[];
  maintenancesByEquipment: {
    equipment: string;
    count: number;
  }[];
}

export function MaintenanceHistory({
  records,
  costTrend,
  maintenancesByEquipment,
}: MaintenanceHistoryProps) {
  const totalCost = records.reduce((sum, record) => sum + record.cost, 0);
  const averageCost = totalCost / records.length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Maintenance Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Cost per Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Cost Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              title="Cost Trend"
              data={costTrend}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
              color="blue"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenancesByEquipment.map((item) => (
                <div key={item.equipment} className="flex items-center">
                  <div className="w-1/3 text-sm font-medium">
                    {item.equipment}
                  </div>
                  <div className="w-2/3">
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(item.count / records.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Maintenance History"
        description="View detailed maintenance records"
        columns={columns}
        data={records}
      />
    </div>
  );
}
