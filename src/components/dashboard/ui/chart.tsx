import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface ChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  valueFormatter?: (value: number) => string;
  color?: string;
}

export function Chart({ title, data, valueFormatter, color = "blue" }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <AreaChart
            data={data}
            index="date"
            categories={["value"]}
            colors={[color]}
            valueFormatter={valueFormatter}
          />
        </div>
      </CardContent>
    </Card>
  );
}
