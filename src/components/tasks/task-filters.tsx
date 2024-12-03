import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TaskFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Filters</CardTitle>
        <CardDescription>Filter and search tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Task filters component coming soon
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset Filters</Button>
        <Button>Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}
