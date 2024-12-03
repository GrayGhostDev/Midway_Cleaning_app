import { Card } from "@/components/ui/card"

interface UpcomingService {
  id: string
  date: string
  time: string
  location: string
  serviceType: string
  status: "scheduled" | "in-progress" | "arriving-soon"
}

const upcomingServices: UpcomingService[] = [
  {
    id: "1",
    date: "2024-01-25",
    time: "09:00 AM",
    location: "123 Main St, Office 4B",
    serviceType: "Regular Cleaning",
    status: "scheduled"
  },
  {
    id: "2",
    date: "2024-01-22",
    time: "02:00 PM",
    location: "456 Park Ave, Suite 201",
    serviceType: "Deep Cleaning",
    status: "arriving-soon"
  },
  {
    id: "3",
    date: "2024-01-22",
    time: "10:30 AM",
    location: "789 Business Blvd",
    serviceType: "Window Cleaning",
    status: "in-progress"
  }
]

export function UpcomingServices() {
  const getStatusColor = (status: UpcomingService["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "arriving-soon":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Upcoming Services</Card.Title>
        <Card.Description>Your scheduled cleaning services</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {upcomingServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{service.serviceType}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {formatStatus(service.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{service.location}</p>
                <p className="text-sm text-gray-500">
                  {new Date(service.date).toLocaleDateString()} at {service.time}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  Reschedule
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}
