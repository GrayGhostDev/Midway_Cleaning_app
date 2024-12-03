import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface CostBreakdownProps {
  costs: {
    total: number;
    trend: number;
    data: { date: string; value: number }[];
  };
}

export function CostBreakdown({ costs }: CostBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${costs.total.toFixed(2)}</div>
                <p className={`text-xs ${costs.trend <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {costs.trend <= 0 ? '↓' : '↑'} {Math.abs(costs.trend).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="h-[200px]">
            <AreaChart
              data={costs.data}
              index="date"
              categories={["value"]}
              colors={["red"]}
              valueFormatter={(value) => `$${value.toFixed(2)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
