'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface Metric {
  label: string
  value: number
  change: number
  unit?: string
}

const metrics: Metric[] = [
  {
    label: "Total Services",
    value: 24,
    change: 4,
    unit: "services"
  },
  {
    label: "Average Rating",
    value: 4.8,
    change: 0.2,
    unit: "stars"
  },
  {
    label: "On-Time Rate",
    value: 98,
    change: 3,
    unit: "%"
  },
  {
    label: "Total Savings",
    value: 450,
    change: 150,
    unit: "USD"
  }
]

export function ClientMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle>{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metric.value}
                {metric.unit && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {metric.unit}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {metric.change > 0 ? (
                  <svg
                    className="w-4 h-4 text-green-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(metric.change)}
                  {metric.unit && ` ${metric.unit}`} increase
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Service Frequency</CardTitle>
          <CardDescription>Your cleaning service patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-gray-500">
            [Service frequency chart placeholder]
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Popular Services</CardTitle>
          <CardDescription>Your most requested cleaning services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Regular Cleaning</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Deep Cleaning</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Window Cleaning</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Carpet Cleaning</span>
              <span className="font-medium">10%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Service Locations</CardTitle>
          <CardDescription>Where we clean for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Office Building A</span>
              <span className="font-medium">Weekly</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Retail Store</span>
              <span className="font-medium">Bi-weekly</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Medical Center</span>
              <span className="font-medium">Daily</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
