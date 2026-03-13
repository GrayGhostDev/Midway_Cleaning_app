import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface WeeklyScheduleProps {
  selectedDate?: Date;
}

export function WeeklySchedule({ selectedDate }: WeeklyScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>View and manage weekly cleaning schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Weekly schedule component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
