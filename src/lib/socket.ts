// Socket.io server stub -- ioredis and @socket.io/redis-adapter are not installed.
// The Next.js App Router doesn't natively support a persistent WebSocket server.
// Use Supabase Realtime or a separate WebSocket service when ready.

export interface ServerToClientEvents {
  statusUpdate: (status: string) => void;
  scheduleUpdate: (schedule: unknown) => void;
  notification: (notification: unknown) => void;
  chatMessage: (message: unknown) => void;
}

export interface ClientToServerEvents {
  updateStatus: (status: string) => void;
  updateSchedule: (schedule: unknown) => void;
  sendMessage: (message: unknown) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

// Stub IO object that implements basic emit/to interface
const stubIO = {
  to(_room: string) {
    return {
      emit(_event: string, _data: unknown) {
        // no-op
      },
    };
  },
  emit(_event: string, _data: unknown) {
    // no-op
  },
};

export const initializeSocket = (_httpServer: unknown) => {
  console.log('[SOCKET STUB] initializeSocket -- no-op');
  return stubIO;
};

export const getIO = () => {
  return stubIO;
};
