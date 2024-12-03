import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceFilters() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Service Filters</Card.Title>
        <Card.Description>Filter and search services</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Service filters component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="outline">Reset Filters</Button>
        <Button>Apply Filters</Button>
      </Card.Footer>
    </Card>
  )
}
