import { Card } from "@/components/ui/card"

interface Feedback {
  id: string
  serviceId: string
  serviceType: string
  date: string
  rating: number
  cleanliness: number
  timeliness: number
  communication: number
  comment: string
  response?: string
}

const feedbackHistory: Feedback[] = [
  {
    id: "1",
    serviceId: "s1",
    serviceType: "Regular Cleaning",
    date: "2024-01-15",
    rating: 5,
    cleanliness: 5,
    timeliness: 4,
    communication: 5,
    comment: "Excellent service as always. The team was very thorough and professional.",
    response: "Thank you for your kind feedback! We're glad you're satisfied with our service."
  },
  {
    id: "2",
    serviceId: "s2",
    serviceType: "Deep Cleaning",
    date: "2024-01-08",
    rating: 4,
    cleanliness: 4,
    timeliness: 4,
    communication: 4,
    comment: "Good deep cleaning service. Would recommend some attention to corner areas."
  },
  {
    id: "3",
    serviceId: "s3",
    serviceType: "Window Cleaning",
    date: "2024-01-01",
    rating: 5,
    cleanliness: 5,
    timeliness: 5,
    communication: 5,
    comment: "Windows are spotless! Very satisfied with the service.",
    response: "We appreciate your feedback! Our team takes pride in delivering excellent results."
  }
]

export function FeedbackHistory() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Feedback History</Card.Title>
        <Card.Description>Your past service feedback and our responses</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {feedbackHistory.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 border rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{feedback.serviceType}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.date).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(feedback.rating)}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cleanliness</p>
                  {renderStars(feedback.cleanliness)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timeliness</p>
                  {renderStars(feedback.timeliness)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Communication</p>
                  {renderStars(feedback.communication)}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">{feedback.comment}</p>
                {feedback.response && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Response: </span>
                      {feedback.response}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
