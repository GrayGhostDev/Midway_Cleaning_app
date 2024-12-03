import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { ChatWindow } from '../chat-window';
import { useWebSocket } from '@/hooks/useWebSocket';

// Mock the useWebSocket hook
jest.mock('@/hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(),
}));

const mockUseWebSocket = useWebSocket as jest.Mock;

describe('ChatWindow', () => {
  const defaultProps = {
    roomId: 'test-room',
    title: 'Test Chat',
  };

  beforeEach(() => {
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      joinRooms: jest.fn(),
      sendMessage: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat window with title', () => {
    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('shows connection status', () => {
    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();

    mockUseWebSocket.mockReturnValue({
      isConnected: false,
      joinRooms: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('joins room on connection', () => {
    const mockJoinRooms = jest.fn();
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      joinRooms: mockJoinRooms,
      sendMessage: jest.fn(),
    });

    render(<ChatWindow {...defaultProps} />);
    expect(mockJoinRooms).toHaveBeenCalledWith([`chat:${defaultProps.roomId}`]);
  });

  it('sends message on button click', async () => {
    const mockSendMessage = jest.fn();
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      joinRooms: jest.fn(),
      sendMessage: mockSendMessage,
    });

    render(<ChatWindow {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    const button = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        roomId: `chat:${defaultProps.roomId}`,
        message: 'Hello, world!',
      });
    });

    expect(input).toHaveValue('');
  });

  it('sends message on Enter key press', async () => {
    const mockSendMessage = jest.fn();
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      joinRooms: jest.fn(),
      sendMessage: mockSendMessage,
    });

    render(<ChatWindow {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        roomId: `chat:${defaultProps.roomId}`,
        message: 'Hello, world!',
      });
    });

    expect(input).toHaveValue('');
  });

  it('displays received messages', () => {
    const messages = [
      {
        roomId: defaultProps.roomId,
        senderId: 'user1',
        senderName: 'John Doe',
        message: 'Hello!',
        timestamp: new Date().toISOString(),
      },
      {
        roomId: defaultProps.roomId,
        senderId: 'user2',
        senderName: 'Jane Smith',
        message: 'Hi there!',
        timestamp: new Date().toISOString(),
      },
    ];

    mockUseWebSocket.mockImplementation(({ onChatMessage }) => {
      // Simulate receiving messages
      messages.forEach(msg => onChatMessage(msg));
      
      return {
        isConnected: true,
        joinRooms: jest.fn(),
        sendMessage: jest.fn(),
      };
    });

    render(<ChatWindow {...defaultProps} />);

    messages.forEach(msg => {
      expect(screen.getByText(msg.message)).toBeInTheDocument();
      expect(screen.getByText(msg.senderName)).toBeInTheDocument();
    });
  });

  it('disables input and button when disconnected', () => {
    mockUseWebSocket.mockReturnValue({
      isConnected: false,
      joinRooms: jest.fn(),
      sendMessage: jest.fn(),
    });

    render(<ChatWindow {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Type a message...')).toBeDisabled();
    expect(screen.getByText('Send')).toBeDisabled();
  });
});
