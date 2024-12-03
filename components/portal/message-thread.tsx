"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { ClientService, ClientMessage } from "@/lib/services/client.service";
import { useToast } from "@/components/ui/use-toast";

interface MessageThreadProps {
  threadId: number;
}

export function MessageThread({ threadId }: MessageThreadProps) {
  const [thread, setThread] = useState<ClientMessage['thread'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadThread = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ClientService.getMessageThread(threadId);
      setThread(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load message thread.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [threadId, toast]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread?.messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    try {
      setSending(true);
      await ClientService.sendMessage({
        threadId,
        content: message,
        attachments: files,
      });
      setMessage("");
      setFiles([]);
      await loadThread();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {thread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender.role === "client" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                <AvatarFallback>
                  {msg.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col space-y-1 ${
                  msg.sender.role === "client" ? "items-end" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{msg.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    msg.sender.role === "client"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={sending}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="text-xs bg-muted rounded-full px-2 py-1"
              >
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}