import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PaymentMethods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Payment methods component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Payment Method</Button>
      </CardFooter>
    </Card>
  )
}
