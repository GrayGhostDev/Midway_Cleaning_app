import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PaymentMethods() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Payment Methods</Card.Title>
        <Card.Description>Manage your payment methods</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Payment methods component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Add Payment Method</Button>
      </Card.Footer>
    </Card>
  )
}
