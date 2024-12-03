import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GeneralSettings() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>General Settings</Card.Title>
        <Card.Description>Manage your account preferences</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          General settings component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Settings</Button>
      </Card.Footer>
    </Card>
  )
}
