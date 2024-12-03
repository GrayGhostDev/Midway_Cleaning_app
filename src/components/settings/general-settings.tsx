import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure general application settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          General settings component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}
