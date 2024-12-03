import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceBooking() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Book a Service</Card.Title>
        <Card.Description>Schedule your next cleaning service</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Service booking component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Book Now</Button>
      </Card.Footer>
    </Card>
  )
}
