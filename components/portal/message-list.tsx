"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageListProps {
  selectedThread: number | null;
  onThreadSelect: (threadId: number) => void;
}

const threads = [
  {
    id: 1,
    contact: {
      name: "Support Team",
      image: "https://i.pravatar.cc/150?u=support",
    },
    lastMessage: "Your cleaning schedule has been confirmed for next week.",
    timestamp: "2024-03-15T10:30:00",
    unread: true,
    status: "active",
  },
  {
    id: 2,
    contact: {
      name: "Scheduling",
      image: "https://i.pravatar.cc/150?u=scheduling",
    },
    lastMessage: "Would you like to reschedule your appointment?",
    timestamp: "2024-03-14T15:45:00",
    unread: false,
    status: "active",
  },
  {
    id: 3,
    contact: {
      name: "Billing Department",
      image: "https://i.pravatar.cc/150?u=billing",
    },
    lastMessage: "Your invoice for March services has been generated.",
    timestamp: "2024-03-13T09:15:00",
    unread: false,
    status: "closed",
  },
];

export function MessageList({ selectedThread, onThreadSelect }: MessageListProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={cn(
              "flex items-start space-x-4 p-4 cursor-pointer hover:bg-accent rounded-lg transition-colors",
              selectedThread === thread.id && "bg-accent"
            )}
            onClick={() => onThreadSelect(thread.id)}
          >
            <Avatar>
              <AvatarImage src={thread.contact.image} alt={thread.contact.name} />
              <AvatarFallback>{thread.contact.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{thread.contact.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(thread.timestamp), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {thread.lastMessage}
              </p>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={thread.status === "active" ? "default" : "secondary"}
                >
                  {thread.status}
                </Badge>
                {thread.unread && (
                  <Badge variant="destructive">Unread</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}