"use client";

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Button } from "@/components/ui/button";

interface DataPoint {
  name: string;
  Regular: number;
  'Deep Clean': number;
  Special: number;
}

const generateData = (days: number): DataPoint[] => {
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const entry = {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Regular: Math.floor(Math.random() * 30) + 20,
      'Deep Clean': Math.floor(Math.random() * 20) + 10,
      Special: Math.floor(Math.random() * 10) + 5,
    };
    data.unshift(entry);
  }
  return data;
};

export function Overview() {
  const [data, setData] = useState<DataPoint[]>(generateData(7));
  const [selectedTypes, setSelectedTypes] = useState(['Regular', 'Deep Clean', 'Special']);

  const toggleTaskType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const colors = {
    Regular: "var(--chart-1)",
    'Deep Clean': "var(--chart-2)",
    Special: "var(--chart-3)",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.keys(colors).map((type) => (
          <Button
            key={type}
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTaskType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
              axisLine={true}
              tickLine={true}
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${value}`}
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12 }}
              width={50}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{label}</div>
                        {payload.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.name}:
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {selectedTypes.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colors[type as keyof typeof colors]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}