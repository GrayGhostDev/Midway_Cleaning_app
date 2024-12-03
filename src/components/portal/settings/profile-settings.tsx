import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProfileSettings() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Profile Settings</Card.Title>
        <Card.Description>Manage your profile information</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Profile settings component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save Profile</Button>
      </Card.Footer>
    </Card>
  )
}
