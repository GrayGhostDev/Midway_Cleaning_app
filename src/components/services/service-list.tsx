import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceList() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Services</Card.Title>
        <Card.Description>View and manage cleaning services</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Service list component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Add Service</Button>
      </Card.Footer>
    </Card>
  )
}
