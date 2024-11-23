"use client";

import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", rating: 4.5, responses: 120 },
  { month: "Feb", rating: 4.6, responses: 145 },
  { month: "Mar", rating: 4.7, responses: 168 },
  { month: "Apr", rating: 4.6, responses: 155 },
  { month: "May", rating: 4.8, responses: 180 },
  { month: "Jun", rating: 4.8, responses: 190 },
];

export function CustomerSatisfaction() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Customer Satisfaction Trends</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="rating"
              stroke="#2563eb"
              fill="#93c5fd"
              name="Rating"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="responses"
              stroke="#16a34a"
              fill="#86efac"
              name="Responses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}