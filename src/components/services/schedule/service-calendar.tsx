import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

interface ServiceCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function ServiceCalendar({ selected, onSelect }: ServiceCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Calendar</CardTitle>
        <CardDescription>View service bookings calendar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Service calendar component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
