"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "@/components/portal/message-list";
import { MessageThread } from "@/components/portal/message-thread";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { NewMessageDialog } from "@/components/portal/new-message-dialog";

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with our team and get support
          </p>
        </div>
        <Button onClick={() => setNewMessageOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="p-4">
          <MessageList
            selectedThread={selectedThread}
            onThreadSelect={setSelectedThread}
          />
        </Card>
        <Card className="p-6">
          {selectedThread ? (
            <MessageThread threadId={selectedThread} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No Conversation Selected</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          )}
        </Card>
      </div>

      <NewMessageDialog open={newMessageOpen} onOpenChange={setNewMessageOpen} />
    </div>
  );
}