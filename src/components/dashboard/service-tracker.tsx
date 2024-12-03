'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ServiceUpdate {
  id: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  eta?: string;
  location: string;
  cleaner: {
    name: string;
    phone: string;
  };
  notes?: string;
  updatedAt: string;
}

export function ServiceTracker() {
  const [services, setServices] = useState<ServiceUpdate[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001');
    
    socketInstance.on('connect', () => {
      console.log('Connected to service updates');
    });

    socketInstance.on('serviceUpdate', (update: ServiceUpdate) => {
      setServices(prev => {
        const existing = prev.findIndex(s => s.id === update.id);
        if (existing !== -1) {
          const newServices = [...prev];
          newServices[existing] = update;
          return newServices;
        }
        return [...prev, update];
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const getStatusColor = (status: ServiceUpdate['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ServiceUpdate['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Service #{service.id}</CardTitle>
              <Badge 
                variant="secondary"
                className={`${getStatusColor(service.status)} text-white`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(service.status)}
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </Badge>
            </div>
            <CardDescription>Last updated: {new Date(service.updatedAt).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {service.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {service.cleaner.name} • {service.cleaner.phone}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{service.progress}%</span>
                </div>
                <Progress value={service.progress} className="h-2" />
              </div>

              {service.eta && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>ETA: {service.eta}</span>
                </div>
              )}

              {service.notes && (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Notes:</p>
                  <p>{service.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {services.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p>No active services at the moment</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
