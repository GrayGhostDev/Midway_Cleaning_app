import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CourseList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Courses</CardTitle>
        <CardDescription>View and manage training courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Course list component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Course</Button>
      </CardFooter>
    </Card>
  )
}
