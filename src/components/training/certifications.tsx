import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Certifications() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Certifications</Card.Title>
        <Card.Description>Manage employee certifications</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Certifications component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Add Certification</Button>
      </Card.Footer>
    </Card>
  )
}
