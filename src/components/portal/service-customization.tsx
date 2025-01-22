"use client";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Settings2, Plus, Save } from "lucide-react"

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export function ServiceCustomization() {
  const [options, setOptions] = useState<ServiceOption[]>([
    {
      id: "1",
      name: "Green Cleaning Products",
      description: "Eco-friendly cleaning solutions",
      price: 25,
      selected: false,
    },
    {
      id: "2",
      name: "Extended Duration",
      description: "+30 minutes of cleaning time",
      price: 35,
      selected: false,
    },
    {
      id: "3",
      name: "Weekend Service",
      description: "Service during weekends",
      price: 45,
      selected: false,
    },
  ]);

  const [preferences, setPreferences] = useState({
    specialInstructions: "",
    accessCode: "",
    petInfo: "",
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Service Add-ons</h3>
          <Settings2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <Checkbox
                checked={option.selected}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  setOptions(
                    options.map((opt) =>
                      opt.id === option.id
                        ? { ...opt, selected: checked === true }
                        : opt
                    )
                  );
                }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{option.name}</h4>
                  <span className="text-sm font-medium">+${option.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Option
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Service Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Special Instructions</label>
            <Textarea
              placeholder="Any specific requirements or preferences..."
              value={preferences.specialInstructions}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  specialInstructions: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Access Code/Instructions</label>
            <Input
              placeholder="Building access code or key location"
              value={preferences.accessCode}
              onChange={(e) =>
                setPreferences({ ...preferences, accessCode: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pet Information</label>
            <Input
              placeholder="Any pets present during service?"
              value={preferences.petInfo}
              onChange={(e) =>
                setPreferences({ ...preferences, petInfo: e.target.value })
              }
            />
          </div>
          <Button className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  )
}
