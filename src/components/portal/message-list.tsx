import { Card } from "@/components/ui/card"

export function MessageList() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Messages</Card.Title>
        <Card.Description>Your message history</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Message list component coming soon
        </div>
      </Card.Content>
    </Card>
  )
}
