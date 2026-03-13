'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ActivityType = 'completed' | 'scheduled' | 'in-progress';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  user: { name: string };
  location?: string;
}

interface RawTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  cleaner: string;
  service?: string;
  dueDate?: string;
}

function taskToActivity(task: RawTask): Activity {
  const statusMap: Record<string, ActivityType> = {
    COMPLETED: 'completed',
    IN_PROGRESS: 'in-progress',
    PENDING: 'scheduled',
  };
  const type: ActivityType = statusMap[task.status] ?? 'scheduled';
  const time =
    task.status === 'IN_PROGRESS'
      ? 'In progress'
      : task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : 'Pending';
  return {
    id: task.id,
    type,
    title: task.title,
    description: task.service ? `Service: ${task.service}` : (task.description ?? ''),
    time,
    user: { name: task.cleaner || 'Unassigned' },
  };
}

function ActivityIcon({ type }: { type: ActivityType }) {
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/tasks?limit=5')
      .then((r) => r.json())
      .then((data) => {
        const tasks: RawTask[] = data?.tasks ?? [];
        setActivities(tasks.map(taskToActivity));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {activity.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
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
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
