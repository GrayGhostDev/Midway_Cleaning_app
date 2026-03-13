import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Security settings component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Update Security</Button>
      </CardFooter>
    </Card>
  )
}
