import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

interface MessageThreadProps {
  threadId?: number;
}

export function MessageThread({ threadId }: MessageThreadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Thread</CardTitle>
        <CardDescription>View conversation history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-gray-500">
          Message thread component coming soon
        </div>
      </CardContent>
    </Card>
  )
}
