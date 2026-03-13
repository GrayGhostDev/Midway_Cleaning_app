import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecurringBooking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Service</CardTitle>
        <CardDescription>Set up regular cleaning services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Recurring booking component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Schedule Recurring Service</Button>
      </CardFooter>
    </Card>
  )
}
