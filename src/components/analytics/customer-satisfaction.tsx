import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface SatisfactionMetricsProps {
  satisfaction: {
    average: number;
    trend: number;
    data: { date: string; value: number }[];
  };
}

export function SatisfactionMetrics({ satisfaction }: SatisfactionMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Satisfaction Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{satisfaction.average.toFixed(1)}/5</div>
                <p className={`text-xs ${satisfaction.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {satisfaction.trend >= 0 ? '↑' : '↓'} {Math.abs(satisfaction.trend).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="h-[200px]">
            <AreaChart
              data={satisfaction.data}
              index="date"
              categories={["value"]}
              colors={["green"]}
              valueFormatter={(value) => `${value.toFixed(1)}/5`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
