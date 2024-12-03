import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/dashboard/ui/chart';

interface EmployeeMetricsProps {
  totalEmployees: number;
  activeEmployees: number;
  employeeGrowth: number;
  employeesByRole: {
    role: string;
    count: number;
  }[];
  employeeHistory: {
    date: string;
    value: number;
  }[];
}

export function EmployeeMetrics({
  totalEmployees,
  activeEmployees,
  employeeGrowth,
  employeesByRole,
  employeeHistory,
}: EmployeeMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className={`text-xs ${employeeGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {employeeGrowth >= 0 ? '↑' : '↓'} {Math.abs(employeeGrowth)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeEmployees}</div>
          <p className="text-xs text-muted-foreground">
            {((activeEmployees / totalEmployees) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Employee Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            title="Employee Growth"
            data={employeeHistory}
            valueFormatter={(value) => value.toString()}
            color="blue"
          />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Employees by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeesByRole.map((role) => (
              <div key={role.role} className="flex items-center">
                <div className="w-1/3 text-sm font-medium">{role.role}</div>
                <div className="w-2/3">
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(role.count / totalEmployees) * 100}%`,
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
  );
}
