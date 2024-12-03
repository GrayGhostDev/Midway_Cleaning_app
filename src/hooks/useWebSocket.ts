import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

interface WebSocketOptions {
  onServiceUpdate?: (data: any) => void;
  onChatMessage?: (data: any) => void;
  onNotification?: (data: any) => void;
  onError?: (error: any) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket(options: WebSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { getToken } = useAuth();

  const {
    onServiceUpdate,
    onChatMessage,
    onNotification,
    onError,
    autoReconnect = true,
    reconnectInterval = 5000,
  } = options;

  const connect = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
        auth: { token },
        reconnection: false, // We'll handle reconnection manually
        timeout: 10000,
      });

      // Set up event listeners
      socketRef.current.on('connect', () => {
        console.log('WebSocket connected');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        if (autoReconnect && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      });

      socketRef.current.on('error', (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
        toast.error('Connection error: ' + error.message);
      });

      if (onServiceUpdate) {
        socketRef.current.on('serviceUpdate', onServiceUpdate);
      }

      if (onChatMessage) {
        socketRef.current.on('chatMessage', onChatMessage);
      }

      if (onNotification) {
        socketRef.current.on('notification', onNotification);
      }

    } catch (error) {
      console.error('WebSocket connection error:', error);
      onError?.(error);
      toast.error('Failed to connect: ' + (error as Error).message);

      if (autoReconnect && !reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    }
  }, [getToken, onServiceUpdate, onChatMessage, onNotification, onError, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Join rooms
  const joinRooms = useCallback((rooms: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join', rooms);
    } else {
      console.error('Cannot join rooms: Socket not connected');
    }
  }, []);

  // Send a service update
  const updateService = useCallback((data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('updateService', data);
    } else {
      console.error('Cannot update service: Socket not connected');
    }
  }, []);

  // Send a chat message
  const sendMessage = useCallback((data: { roomId: string; message: string }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', data);
    } else {
      console.error('Cannot send message: Socket not connected');
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: socketRef.current?.connected ?? false,
    socket: socketRef.current,
    connect,
    disconnect,
    joinRooms,
    updateService,
    sendMessage,
  };
}
