import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, MapPin, User } from "lucide-react"
import { ServiceService, Service } from "@/lib/services/service.service"
import { useToast } from "@/components/ui/use-toast"

interface TaskListProps {
  searchQuery?: string;
}

export function TaskList({ searchQuery }: TaskListProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await ServiceService.getAllServices()
        setServices(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services. Please try again."
        })
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [toast])

  const filteredServices = services.filter((service) =>
    searchQuery
      ? service.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredServices.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </div>
              <Badge variant="secondary">{service.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{service.staffRequired} staff required</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{service.category}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Service Utilization</span>
                  <span>{service.utilization}%</span>
                </div>
                <Progress value={service.utilization} className="h-2" />
              </div>

              {service.checklist && service.checklist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Checklist</h4>
                  <div className="space-y-1">
                    {service.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{item.task}</span>
                        {item.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No services found
          </CardContent>
        </Card>
      )}
    </div>
  )
}
