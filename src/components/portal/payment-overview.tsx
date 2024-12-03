import { Card } from "@/components/ui/card"

interface Payment {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
  method: string
  description: string
}

const payments: Payment[] = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 99,
    status: "paid",
    method: "Credit Card",
    description: "Regular Cleaning Service - January"
  },
  {
    id: "2",
    date: "2024-01-08",
    amount: 299,
    status: "pending",
    method: "Bank Transfer",
    description: "Deep Cleaning Service - January"
  },
  {
    id: "3",
    date: "2023-12-31",
    amount: 149,
    status: "overdue",
    method: "Invoice",
    description: "Window Cleaning Service - December"
  }
]

export function PaymentOverview() {
  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const totalPending = payments
    .filter((payment) => payment.status === "pending" || payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Total Paid</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold text-green-600">${totalPaid}</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Outstanding Balance</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold text-red-600">${totalPending}</div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Recent Payments</Card.Title>
          <Card.Description>Your payment history and pending charges</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{payment.description}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()} • {payment.method}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className="text-lg font-bold">${payment.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
