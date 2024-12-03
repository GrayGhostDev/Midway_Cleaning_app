import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PackageList() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Service Packages</Card.Title>
        <Card.Description>View and manage cleaning service packages</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Package list component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Add Package</Button>
      </Card.Footer>
    </Card>
  )
}
