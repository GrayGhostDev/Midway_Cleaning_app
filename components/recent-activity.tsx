import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    user: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john",
    },
    action: "completed",
    task: "Office Cleaning at Tech Corp HQ",
    time: "2 hours ago",
  },
  {
    user: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah",
    },
    action: "started",
    task: "Deep Cleaning at Medical Center",
    time: "3 hours ago",
  },
  {
    user: {
      name: "Mike Wilson",
      image: "https://i.pravatar.cc/150?u=mike",
    },
    action: "reported issue",
    task: "Window Cleaning at Downtown Office",
    time: "4 hours ago",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8 pt-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.action} {activity.task}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}