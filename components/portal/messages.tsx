"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const messages = [
  {
    id: 1,
    sender: {
      name: "John Smith",
      image: "https://i.pravatar.cc/150?u=john",
      role: "Cleaning Supervisor",
    },
    content: "Your scheduled deep cleaning has been confirmed for next week.",
    timestamp: "2024-03-15T10:30:00",
    isCustomer: false,
  },
  {
    id: 2,
    sender: {
      name: "You",
      role: "Customer",
    },
    content: "Can we adjust the cleaning schedule for next month?",
    timestamp: "2024-03-15T10:35:00",
    isCustomer: true,
  },
  {
    id: 3,
    sender: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?u=sarah",
      role: "Customer Service",
    },
    content: "Of course! I'll check the available slots and get back to you shortly.",
    timestamp: "2024-03-15T10:40:00",
    isCustomer: false,
  },
];

export function Messages() {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      // Add message handling logic here
      setNewMessage("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isCustomer ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.isCustomer ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.sender.image && (
                    <AvatarImage src={message.sender.image} alt={message.sender.name} />
                  )}
                  <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.isCustomer
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm font-semibold">{message.sender.name}</p>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </Card>
  );
}