import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface ResourceMetricsProps {
  utilization: {
    rate: number;
    trend: number;
    data: { date: string; value: number }[];
  };
}

export function ResourceMetrics({ utilization }: ResourceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(utilization.rate * 100).toFixed(1)}%</div>
                <p className={`text-xs ${utilization.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {utilization.trend >= 0 ? '↑' : '↓'} {Math.abs(utilization.trend).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="h-[200px]">
            <AreaChart
              data={utilization.data}
              index="date"
              categories={["value"]}
              colors={["purple"]}
              valueFormatter={(value) => `${value.toFixed(0)} tasks`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
