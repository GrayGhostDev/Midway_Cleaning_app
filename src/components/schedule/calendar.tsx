import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  className?: string;
}

export function Calendar({ mode = "single", selected, onSelect, className }: CalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>View and manage cleaning schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode={mode as "single"}
          selected={selected as Date | undefined}
          onSelect={onSelect as ((date: Date | undefined) => void) | undefined}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}
