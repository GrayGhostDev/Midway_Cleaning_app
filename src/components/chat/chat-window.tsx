import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@clerk/nextjs';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

interface ChatWindowProps {
  roomId: string;
  title: string;
}

export function ChatWindow({ roomId, title }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { isConnected, joinRooms, sendMessage } = useWebSocket({
    onChatMessage: (message: Message) => {
      setMessages(prev => [...prev, message]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  useEffect(() => {
    if (isConnected) {
      joinRooms([`chat:${roomId}`]);
    }
  }, [isConnected, roomId, joinRooms]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    sendMessage({
      roomId: `chat:${roomId}`,
      message: inputMessage.trim(),
    });

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[500px] w-full max-w-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                msg.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.senderId !== user?.id && (
                <Avatar>
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                    {msg.senderName[0]}
                  </div>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.senderId === user?.id ? 'You' : msg.senderName}
                </div>
                <div className="text-sm break-words">{msg.message}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
