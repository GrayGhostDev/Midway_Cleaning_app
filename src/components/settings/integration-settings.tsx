import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function IntegrationSettings() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Integration Settings</Card.Title>
        <Card.Description>Configure third-party integrations</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Integration settings component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Settings</Button>
      </Card.Footer>
    </Card>
  )
}
