import {
  sendScheduleReminder,
  sendInvoice,
  sendFileShareNotification,
  sendStatusUpdate,
  sendWelcomeEmail,
  sendBatchScheduleReminders,
  sendEmergencyNotification,
} from '@/lib/email/sender';
import { Resend } from 'resend';
import { Schedule } from '@/lib/schedule';
import { FileMetadata } from '@/lib/storage';

describe('Email Service', () => {
  const mockResend = new Resend('test-key');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendScheduleReminder', () => {
    const mockSchedule: Schedule = {
      id: 'schedule123',
      userId: 'user123',
      type: 'CLEANING',
      status: 'PENDING',
      startTime: new Date('2024-01-01T10:00:00Z'),
      endTime: new Date('2024-01-01T12:00:00Z'),
      location: '123 Test St',
    };

    it('should send schedule reminder email', async () => {
      const result = await sendScheduleReminder(mockSchedule, 'test@example.com');

      expect(result).toBe(true);
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['test@example.com'],
          subject: expect.stringContaining('Cleaning Service Reminder'),
        })
      );
    });
  });

  describe('sendInvoice', () => {
    const mockInvoice = {
      invoiceNumber: 'INV-2024-001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      items: [
        {
          description: 'House Cleaning',
          quantity: 1,
          rate: 150,
          amount: 150,
        },
      ],
      subtotal: 150,
      tax: 12,
      total: 162,
      dueDate: new Date('2024-02-01'),
    };

    it('should send invoice email', async () => {
      const result = await sendInvoice(mockInvoice);

      expect(result).toBe(true);
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [mockInvoice.customerEmail],
          subject: expect.stringContaining('Invoice #'),
          replyTo: 'billing@midwaycleaning.com',
        })
      );
    });
  });

  describe('sendFileShareNotification', () => {
    const mockFile: FileMetadata = {
      id: 'file123',
      originalName: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      uploadedBy: 'user123',
      uploadedAt: new Date(),
      folder: 'documents',
    };

    it('should send file share notification', async () => {
      const recipients = ['user1@example.com', 'user2@example.com'];
      const result = await sendFileShareNotification(mockFile, 'John Doe', recipients);

      expect(result).toBe(true);
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipients,
          subject: expect.stringContaining('shared a file with you'),
        })
      );
    });
  });

  describe('sendEmergencyNotification', () => {
    it('should send emergency notification to multiple recipients', async () => {
      const message = 'Emergency: Service disruption';
      const recipients = ['user1@example.com', 'user2@example.com'];

      const result = await sendEmergencyNotification(message, recipients);

      expect(result).toBe(true);
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipients,
          subject: expect.stringContaining('Emergency'),
          from: expect.stringContaining('emergency@midwaycleaning.com'),
        })
      );
    });
  });

  describe('sendBatchScheduleReminders', () => {
    const mockSchedules = [
      {
        schedule: {
          id: 'schedule1',
          userId: 'user1',
          type: 'CLEANING',
          status: 'PENDING',
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T12:00:00Z'),
          location: '123 Test St',
        },
        email: 'user1@example.com',
      },
      {
        schedule: {
          id: 'schedule2',
          userId: 'user2',
          type: 'MAINTENANCE',
          status: 'PENDING',
          startTime: new Date('2024-01-02T10:00:00Z'),
          endTime: new Date('2024-01-02T12:00:00Z'),
          location: '456 Test Ave',
        },
        email: 'user2@example.com',
      },
    ];

    it('should send batch schedule reminders', async () => {
      const results = await sendBatchScheduleReminders(mockSchedules);

      expect(results).toHaveLength(mockSchedules.length);
      expect(results.every(result => result === true)).toBe(true);
      expect(mockResend.emails.send).toHaveBeenCalledTimes(mockSchedules.length);
    });
  });
});
