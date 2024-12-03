import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export function TrainingMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Metrics</CardTitle>
        <CardDescription>View training performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Training metrics component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
