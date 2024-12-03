import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Notification Settings</Card.Title>
        <Card.Description>Configure notification preferences</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Notification settings component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Preferences</Button>
      </Card.Footer>
    </Card>
  )
}
