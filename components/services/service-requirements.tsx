"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface Requirements {
  equipment: string[];
  supplies: string[];
  certifications: string[];
}

interface ServiceRequirementsProps {
  requirements: Requirements;
  onUpdate: (requirements: Requirements) => void;
}

export function ServiceRequirements({ requirements, onUpdate }: ServiceRequirementsProps) {
  const [newItem, setNewItem] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof Requirements>("equipment");

  const addItem = () => {
    if (!newItem.trim()) return;
    const updatedRequirements = {
      ...requirements,
      [activeCategory]: [...requirements[activeCategory], newItem],
    };
    onUpdate(updatedRequirements);
    setNewItem("");
  };

  const removeItem = (category: keyof Requirements, item: string) => {
    const updatedRequirements = {
      ...requirements,
      [category]: requirements[category].filter((i) => i !== item),
    };
    onUpdate(updatedRequirements);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex space-x-2">
          {(Object.keys(requirements) as Array<keyof Requirements>).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              size="sm"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder={`Add new ${activeCategory}...`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {(Object.keys(requirements) as Array<keyof Requirements>).map((category) => (
            <div key={category} className={category !== activeCategory ? "hidden" : undefined}>
              <h3 className="text-sm font-medium mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {requirements[category].map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {item}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItem(category, item)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {requirements[category].length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No {category} added
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}