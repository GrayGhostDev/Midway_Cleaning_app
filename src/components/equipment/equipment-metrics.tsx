import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/dashboard/ui/chart';

interface EquipmentMetricsProps {
  totalEquipment?: number;
  availableEquipment?: number;
  utilizationRate?: number;
  equipmentByType?: {
    type: string;
    count: number;
  }[];
  utilizationHistory?: {
    date: string;
    value: number;
  }[];
}

export function EquipmentMetrics({
  totalEquipment = 0,
  availableEquipment = 0,
  utilizationRate = 0,
  equipmentByType = [],
  utilizationHistory = [],
}: EquipmentMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEquipment}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableEquipment}</div>
          <p className="text-xs text-muted-foreground">
            {totalEquipment > 0 ? ((availableEquipment / totalEquipment) * 100).toFixed(1) : 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{utilizationRate}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Equipment Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{equipmentByType.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
