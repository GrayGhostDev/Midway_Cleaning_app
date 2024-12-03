'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface Activity {
  id: string;
  type: 'completed' | 'scheduled' | 'in-progress';
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    image?: string;
  };
  location?: string;
}

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Office Cleaning Completed',
    description: 'Regular cleaning service completed',
    time: '2 hours ago',
    user: {
      name: 'John Smith',
      image: '/avatars/john-smith.jpg',
    },
    location: '123 Business Ave',
  },
  {
    id: '2',
    type: 'scheduled',
    title: 'Deep Clean Scheduled',
    description: 'Monthly deep cleaning service',
    time: 'Tomorrow, 9:00 AM',
    user: {
      name: 'Sarah Johnson',
    },
    location: '456 Corporate Blvd',
  },
  {
    id: '3',
    type: 'in-progress',
    title: 'Window Cleaning',
    description: 'External window cleaning service',
    time: 'In progress',
    user: {
      name: 'Mike Wilson',
      image: '/avatars/mike-wilson.jpg',
    },
    location: '789 Tower St',
  },
];

function ActivityIcon({ type }: { type: Activity['type'] }) {
  switch (type) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'scheduled':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
}

export function RecentActivities() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.image} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <ActivityIcon type={activity.type} />
                    <p className="text-sm font-medium">{activity.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                    {activity.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{activity.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
