"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { ClientService } from "@/lib/services/client.service";
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

  useEffect(() => {
    loadThread();
  }, [threadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread?.messages]);

  async function loadThread() {
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
  }

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

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {thread?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender.role === "client" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                {msg.sender.avatar && (
                  <AvatarImage
                    src={msg.sender.avatar}
                    alt={msg.sender.name}
                  />
                )}
                <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col space-y-1 ${
                  msg.sender.role === "client" ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    msg.sender.role === "client"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline"
                        >
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(msg.timestamp), "h:mm a")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={sending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={sending}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {files.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              {files.length} file(s) selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}