import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SecuritySettings() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Security Settings</Card.Title>
        <Card.Description>Manage your account security</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Security settings component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Update Security</Button>
      </Card.Footer>
    </Card>
  )
}
