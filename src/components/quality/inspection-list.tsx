import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function InspectionList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Inspections</CardTitle>
        <CardDescription>View and manage quality inspections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Inspection list component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Inspection</Button>
      </CardFooter>
    </Card>
  )
}
