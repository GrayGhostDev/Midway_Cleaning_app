import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
}

export function Calendar({ mode = "single", selected, onSelect }: CalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>View and manage cleaning schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode={mode}
          selected={selected}
          onSelect={onSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}
