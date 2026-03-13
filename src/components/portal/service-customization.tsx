import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ServiceCustomization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Service</CardTitle>
        <CardDescription>Tailor your cleaning service to your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Service customization component coming soon
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
