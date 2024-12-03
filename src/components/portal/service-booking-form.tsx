import { useState } from "react"
import { Card } from "@/components/ui/card"

interface BookingFormData {
  date: string
  time: string
  location: string
  serviceType: string
  notes: string
}

export function ServiceBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    time: "",
    location: "",
    serviceType: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Book a Service</Card.Title>
        <Card.Description>Schedule your next cleaning service</Card.Description>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter service location"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a service type</option>
              <option value="regular">Regular Cleaning</option>
              <option value="deep">Deep Cleaning</option>
              <option value="window">Window Cleaning</option>
              <option value="carpet">Carpet Cleaning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Special Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Any special requirements or notes"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Book Service
          </button>
        </form>
      </Card.Content>
    </Card>
  )
}
