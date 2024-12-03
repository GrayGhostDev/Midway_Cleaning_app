import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TaskListProps {
  searchQuery?: string;
}

export function TaskList({ searchQuery }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>View and manage cleaning tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Task list component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Task</Button>
      </CardFooter>
    </Card>
  )
}
