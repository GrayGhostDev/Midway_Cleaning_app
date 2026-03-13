import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Certifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
        <CardDescription>Manage employee certifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Certifications component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Add Certification</Button>
      </CardFooter>
    </Card>
  )
}
