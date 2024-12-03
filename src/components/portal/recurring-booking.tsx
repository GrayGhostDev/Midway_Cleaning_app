import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecurringBooking() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Recurring Service</Card.Title>
        <Card.Description>Set up regular cleaning services</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Recurring booking component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Schedule Recurring Service</Button>
      </Card.Footer>
    </Card>
  )
}
