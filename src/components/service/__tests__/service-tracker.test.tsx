import React from 'react';
import { render, screen, waitFor } from '@/test/test-utils';
import { ServiceTracker } from '../service-tracker';
import {
  createMockWebSocketServer,
  createMockServiceUpdate,
  createMockChatMessage,
} from '@/test/test-utils';
import { useAuth } from '@clerk/nextjs';

// Mock Clerk auth
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('ServiceTracker', () => {
  const mockUserId = 'user_123';
  const mockServiceId = 'service_123';
  let mockWebSocketServer: ReturnType<typeof createMockWebSocketServer>;

  const defaultProps = {
    serviceId: mockServiceId,
    initialData: createMockServiceUpdate(),
  };

  beforeEach(() => {
    mockWebSocketServer = createMockWebSocketServer();
    (useAuth as jest.Mock).mockReturnValue({
      userId: mockUserId,
      isSignedIn: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial service data', () => {
    render(<ServiceTracker {...defaultProps} />);

    expect(screen.getByText('Service Status')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('50% Complete')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('updates service status in real-time', async () => {
    render(<ServiceTracker {...defaultProps} />);

    const updatedService = createMockServiceUpdate({
      status: 'COMPLETED',
      progress: 100,
      notes: 'Service completed successfully',
    });

    mockWebSocketServer.broadcast({
      type: 'serviceUpdate',
      data: updatedService,
    });

    await waitFor(() => {
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('100% Complete')).toBeInTheDocument();
      expect(screen.getByText('Service completed successfully')).toBeInTheDocument();
    });
  });

  it('handles chat messages', async () => {
    render(<ServiceTracker {...defaultProps} />);

    const message = createMockChatMessage({
      senderId: 'cleaner_123',
      senderName: 'John Doe',
      message: 'I will arrive in 10 minutes',
    });

    mockWebSocketServer.broadcast({
      type: 'chatMessage',
      data: message,
    });

    await waitFor(() => {
      expect(screen.getByText('I will arrive in 10 minutes')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Send a message
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Okay, thank you!' } });
    fireEvent.click(sendButton);

    // Verify the message was sent through WebSocket
    await waitFor(() => {
      expect(screen.getByText('Okay, thank you!')).toBeInTheDocument();
    });
  });

  it('shows connection status', async () => {
    render(<ServiceTracker {...defaultProps} />);

    expect(screen.getByText('Connected')).toBeInTheDocument();

    // Simulate disconnection
    mockWebSocketServer.broadcast({
      type: 'disconnect',
    });

    await waitFor(() => {
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });

  it('handles service cancellation', async () => {
    render(<ServiceTracker {...defaultProps} />);

    const cancelledService = createMockServiceUpdate({
      status: 'CANCELLED',
      notes: 'Service cancelled by customer',
    });

    mockWebSocketServer.broadcast({
      type: 'serviceUpdate',
      data: cancelledService,
    });

    await waitFor(() => {
      expect(screen.getByText('CANCELLED')).toBeInTheDocument();
      expect(screen.getByText('Service cancelled by customer')).toBeInTheDocument();
    });
  });

  it('updates ETA', async () => {
    render(<ServiceTracker {...defaultProps} />);

    const newEta = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now
    const updatedService = createMockServiceUpdate({
      eta: newEta,
      notes: 'Delayed due to traffic',
    });

    mockWebSocketServer.broadcast({
      type: 'serviceUpdate',
      data: updatedService,
    });

    await waitFor(() => {
      expect(screen.getByText('Delayed due to traffic')).toBeInTheDocument();
      expect(screen.getByText(new Date(newEta).toLocaleTimeString())).toBeInTheDocument();
    });
  });

  it('handles cleaner updates', async () => {
    render(<ServiceTracker {...defaultProps} />);

    const updatedService = createMockServiceUpdate({
      cleaner: {
        id: 'cleaner_456',
        name: 'Jane Smith',
      },
      notes: 'Cleaner reassigned',
    });

    mockWebSocketServer.broadcast({
      type: 'serviceUpdate',
      data: updatedService,
    });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Cleaner reassigned')).toBeInTheDocument();
    });
  });
});
