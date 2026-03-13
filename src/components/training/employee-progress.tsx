import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export function EmployeeProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Progress</CardTitle>
        <CardDescription>Track employee training progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Employee progress component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
