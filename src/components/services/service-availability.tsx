import { Card } from "@/components/ui/card"

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
}

const weekAvailability: DayAvailability[] = [
  {
    date: "2024-01-22",
    slots: [
      { id: "1", time: "09:00", available: true },
      { id: "2", time: "11:00", available: false },
      { id: "3", time: "13:00", available: true },
      { id: "4", time: "15:00", available: true }
    ]
  },
  {
    date: "2024-01-23",
    slots: [
      { id: "5", time: "09:00", available: true },
      { id: "6", time: "11:00", available: true },
      { id: "7", time: "13:00", available: false },
      { id: "8", time: "15:00", available: true }
    ]
  },
  // Add more days as needed
]

export function ServiceAvailability() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Service Availability</Card.Title>
        <Card.Description>Available time slots for booking</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {weekAvailability.map((day) => (
            <div key={day.date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium mb-2">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {day.slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    className={`p-2 text-sm rounded-md text-center ${
                      slot.available
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
