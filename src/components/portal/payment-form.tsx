import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PaymentForm() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Payment Details</Card.Title>
        <Card.Description>Enter your payment information</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="text-center text-gray-500">
          Payment form component coming soon
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Submit Payment</Button>
      </Card.Footer>
    </Card>
  )
}
