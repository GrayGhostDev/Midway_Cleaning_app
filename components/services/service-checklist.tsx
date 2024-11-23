"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  task: string;
  required: boolean;
}

interface ServiceChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

export function ServiceChecklist({ items, onUpdate }: ServiceChecklistProps) {
  const [newTask, setNewTask] = useState("");

  const addItem = () => {
    if (!newTask.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      task: newTask,
      required: false,
    };
    onUpdate([...items, newItem]);
    setNewTask("");
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const toggleRequired = (id: string) => {
    onUpdate(items.map(item => 
      item.id === id ? { ...item, required: !item.required } : item
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add new checklist item..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.required}
                  onCheckedChange={() => toggleRequired(item.id)}
                />
                <span className="text-sm">{item.task}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}