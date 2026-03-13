import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Filters</CardTitle>
        <CardDescription>Filter and search services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Service filters component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Reset Filters</Button>
        <Button>Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}
