import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceBooking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Service</CardTitle>
        <CardDescription>Schedule your next cleaning service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Service booking component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  )
}
