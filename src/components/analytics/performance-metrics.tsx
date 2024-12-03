import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface RevenuePerformanceProps {
  revenue: {
    total: number;
    trend: number;
    data: { date: string; value: number }[];
  };
}

export function RevenuePerformance({ revenue }: RevenuePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenue.total.toFixed(2)}</div>
                <p className={`text-xs ${revenue.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {revenue.trend >= 0 ? '↑' : '↓'} {Math.abs(revenue.trend).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="h-[200px]">
            <AreaChart
              data={revenue.data}
              index="date"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
