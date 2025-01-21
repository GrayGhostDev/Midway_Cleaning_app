import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PaymentForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Payment form component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Submit Payment</Button>
      </CardFooter>
    </Card>
  )
}
