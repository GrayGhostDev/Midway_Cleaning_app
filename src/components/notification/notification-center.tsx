import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  bookingId?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { isConnected } = useWebSocket({
    onNotification: (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(count => count + 1);
      
      // Show toast for new notifications when the center is closed
      if (!isOpen) {
        toast(notification.title, {
          description: notification.message,
          action: {
            label: 'View',
            onClick: () => setIsOpen(true),
          },
        });
      }
    },
    onError: (error) => {
      console.error('Notification error:', error);
    },
  });

  useEffect(() => {
    // Fetch initial notifications
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      })
      .catch(error => {
        console.error('Failed to fetch notifications:', error);
      });
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
      });

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
      });

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center justify-between">
            Notifications
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                Clear all
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.isRead ? 'bg-muted/50' : 'bg-muted'
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Badge variant="default">New</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
