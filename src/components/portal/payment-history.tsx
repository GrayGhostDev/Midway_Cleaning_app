import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View your payment history and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Payment history component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
