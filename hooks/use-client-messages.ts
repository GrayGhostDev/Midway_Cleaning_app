import { useState, useEffect } from 'react';
import { ClientService, ClientMessage } from '@/lib/services/client.service';
import { useToast } from '@/components/ui/use-toast';

export function useClientMessages(params?: {
  status?: string;
  department?: string;
}) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, [params?.status, params?.department]);

  async function loadMessages() {
    try {
      const data = await ClientService.getMessages(params);
      setMessages(data);
    } catch (error) {
      setError(error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(data: Parameters<typeof ClientService.sendMessage>[0]) {
    try {
      const newMessage = await ClientService.sendMessage(data);
      setMessages(prev => [...prev, newMessage]);
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      return newMessage;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function markAsRead(messageId: number) {
    try {
      await ClientService.markMessageAsRead(messageId);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refresh: loadMessages,
  };
}