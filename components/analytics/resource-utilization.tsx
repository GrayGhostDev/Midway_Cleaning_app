"use client";

import { Card } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { subject: "Staff", current: 85, optimal: 90 },
  { subject: "Equipment", current: 92, optimal: 95 },
  { subject: "Supplies", current: 88, optimal: 85 },
  { subject: "Vehicles", current: 82, optimal: 85 },
  { subject: "Storage", current: 90, optimal: 88 },
];

export function ResourceUtilization() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Resource Utilization</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Current Usage"
              dataKey="current"
              stroke="#2563eb"
              fill="#93c5fd"
              fillOpacity={0.6}
            />
            <Radar
              name="Optimal Usage"
              dataKey="optimal"
              stroke="#16a34a"
              fill="#86efac"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}