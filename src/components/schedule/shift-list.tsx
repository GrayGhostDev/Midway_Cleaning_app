import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ShiftListProps {
  selectedDate?: Date;
}

export function ShiftList({ selectedDate }: ShiftListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shifts</CardTitle>
        <CardDescription>View and manage cleaning shifts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Shift list component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Shift</Button>
      </CardFooter>
    </Card>
  )
}
