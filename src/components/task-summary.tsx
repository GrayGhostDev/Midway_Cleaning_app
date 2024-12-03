import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const tasks = [
  {
    name: "Office Cleaning",
    total: 12,
    completed: 8,
  },
  {
    name: "Deep Cleaning",
    total: 8,
    completed: 5,
  },
  {
    name: "Window Cleaning",
    total: 6,
    completed: 4,
  },
  {
    name: "Floor Maintenance",
    total: 4,
    completed: 1,
  },
];

export function TaskSummary() {
  return (
    <div className="space-y-8 pt-4">
      {tasks.map((task) => (
        <div key={task.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{task.name}</span>
            <span className="text-sm text-muted-foreground">
              {task.completed}/{task.total}
            </span>
          </div>
          <Progress value={(task.completed / task.total) * 100} />
        </div>
      ))}
    </div>
  );
}