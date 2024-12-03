import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceCustomization() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Customize Your Service</Card.Title>
        <Card.Description>Tailor your cleaning service to your needs</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Service customization component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Preferences</Button>
      </Card.Footer>
    </Card>
  )
}
