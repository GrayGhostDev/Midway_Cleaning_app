import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface FeedbackFormData {
  serviceId: string
  rating: number
  cleanliness: number
  timeliness: number
  communication: number
  comment: string
}

export function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    serviceId: "",
    rating: 0,
    cleanliness: 0,
    timeliness: 0,
    communication: 0,
    comment: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log("Feedback submitted:", formData)
  }

  const handleRatingChange = (
    field: keyof Omit<FeedbackFormData, "serviceId" | "comment">,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStars = (
    field: keyof Omit<FeedbackFormData, "serviceId" | "comment">,
    value: number
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(field, star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${
                star <= value ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Feedback</CardTitle>
        <CardDescription>Help us improve our service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Service</label>
            <select
              value={formData.serviceId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, serviceId: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose a service</option>
              <option value="1">Regular Cleaning - Jan 15, 2024</option>
              <option value="2">Deep Cleaning - Jan 8, 2024</option>
              <option value="3">Window Cleaning - Jan 1, 2024</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Overall Rating</label>
            {renderStars("rating", formData.rating)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cleanliness Quality</label>
            {renderStars("cleanliness", formData.cleanliness)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timeliness</label>
            {renderStars("timeliness", formData.timeliness)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Communication</label>
            {renderStars("communication", formData.communication)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Comments</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Share your experience with our service..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
