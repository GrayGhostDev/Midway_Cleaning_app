import { FeedbackHistory } from "@/components/portal/feedback-history"

export const metadata = {
  title: 'Feedback History | Midway Cleaning Service',
  description: 'View past service feedback and responses',
}

export default function FeedbackHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <FeedbackHistory />
    </div>
  )
}
