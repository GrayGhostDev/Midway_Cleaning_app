import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ChatWindow } from '@/components/chat/chat-window';

interface ServiceUpdate {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  eta: string;
  location: string;
  cleaner: {
    id: string;
    name: string;
  };
  notes?: string;
  updatedAt: string;
}

interface ServiceTrackerProps {
  serviceId: string;
  initialData: ServiceUpdate;
}

export function ServiceTracker({ serviceId, initialData }: ServiceTrackerProps) {
  const [serviceData, setServiceData] = useState<ServiceUpdate>(initialData);

  const { isConnected, joinRooms } = useWebSocket({
    onServiceUpdate: (update: ServiceUpdate) => {
      if (update.id === serviceId) {
        setServiceData(update);
      }
    },
    onError: (error) => {
      console.error('Service tracking error:', error);
    },
  });

  useEffect(() => {
    if (isConnected) {
      joinRooms([`service:${serviceId}`]);
    }
  }, [isConnected, serviceId, joinRooms]);

  const getStatusColor = (status: ServiceUpdate['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Service Status</h2>
          <Badge className={getStatusColor(serviceData.status)}>
            {serviceData.status}
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Progress</h3>
            <Progress value={serviceData.progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">
              {serviceData.progress}% Complete
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Estimated Completion</h3>
            <p className="text-lg">
              {new Date(serviceData.eta).toLocaleTimeString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Location</h3>
            <p className="text-lg">{serviceData.location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Cleaner</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                  {serviceData.cleaner.name[0]}
                </div>
              </Avatar>
              <div>
                <p className="font-medium">{serviceData.cleaner.name}</p>
                <p className="text-sm text-gray-500">Professional Cleaner</p>
              </div>
            </div>
          </div>

          {serviceData.notes && (
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <p className="text-gray-600">{serviceData.notes}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            Last updated: {new Date(serviceData.updatedAt).toLocaleString()}
          </div>
        </div>
      </Card>

      <ChatWindow
        roomId={`service:${serviceId}`}
        title="Service Chat"
      />
    </div>
  );
}
