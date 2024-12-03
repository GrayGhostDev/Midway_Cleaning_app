import { EmailService } from '@/services/email';
import { Resend } from 'resend';
import { Redis } from 'ioredis';
import { jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';

// Mock Resend
jest.mock('resend');
const mockResend = {
  emails: {
    send: jest.fn(),
  },
} as jest.Mocked<Resend>;

// Mock Redis
const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
} as jest.Mocked<Redis>;

jest.mock('ioredis', () => ({
  Redis: jest.fn(() => mockRedis),
}));

describe('EmailService Integration Tests', () => {
  let emailService: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    (Resend as jest.Mock).mockImplementation(() => mockResend);
    emailService = new EmailService();
  });

  describe('sendEmail', () => {
    it('should successfully send an email', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      mockResend.emails.send.mockResolvedValueOnce({
        id: 'test-email-id',
        from: 'notifications@midwaycleaning.com',
        ...emailData,
      });

      const result = await emailService.sendEmail(emailData);

      expect(result).toEqual({
        success: true,
        messageId: 'test-email-id',
      });

      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: 'Midway Cleaning <notifications@midwaycleaning.com>',
        ...emailData,
      });
    });

    it('should handle email sending failures', async () => {
      const emailData = {
        to: 'invalid@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      mockResend.emails.send.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(emailService.sendEmail(emailData))
        .rejects
        .toThrow('Failed to send email');
    });

    it('should validate email addresses', async () => {
      const emailData = {
        to: 'invalid-email',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      await expect(emailService.sendEmail(emailData))
        .rejects
        .toThrow('Invalid email address');
    });
  });

  describe('sendTemplatedEmail', () => {
    const templateName = 'booking-confirmation';
    const templateContent = readFileSync(
      join(__dirname, '../../templates/emails/booking-confirmation.hbs'),
      'utf-8'
    );

    beforeEach(() => {
      mockRedis.get.mockResolvedValue(templateContent);
    });

    it('should send email using template', async () => {
      const templateData = {
        customerName: 'John Doe',
        bookingDate: '2024-03-15',
        serviceType: 'Deep Cleaning',
      };

      const compiledTemplate = Handlebars.compile(templateContent);
      const expectedHtml = compiledTemplate(templateData);

      mockResend.emails.send.mockResolvedValueOnce({
        id: 'test-email-id',
        from: 'notifications@midwaycleaning.com',
        to: 'customer@example.com',
        subject: 'Booking Confirmation',
        html: expectedHtml,
      });

      const result = await emailService.sendTemplatedEmail({
        to: 'customer@example.com',
        templateName,
        templateData,
      });

      expect(result).toEqual({
        success: true,
        messageId: 'test-email-id',
      });

      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: 'Midway Cleaning <notifications@midwaycleaning.com>',
        to: 'customer@example.com',
        subject: 'Booking Confirmation',
        html: expectedHtml,
      });
    });

    it('should handle missing templates', async () => {
      mockRedis.get.mockResolvedValue(null);

      await expect(emailService.sendTemplatedEmail({
        to: 'customer@example.com',
        templateName: 'non-existent-template',
        templateData: {},
      }))
        .rejects
        .toThrow('Email template not found');
    });

    it('should handle template compilation errors', async () => {
      mockRedis.get.mockResolvedValue('{{#each items}}{{/if}}'); // Invalid template

      await expect(emailService.sendTemplatedEmail({
        to: 'customer@example.com',
        templateName,
        templateData: {},
      }))
        .rejects
        .toThrow('Failed to compile email template');
    });
  });

  describe('Email Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      // Mock Redis to simulate rate limit exceeded
      mockRedis.get.mockResolvedValue('10'); // Assume limit is 5 emails per minute

      await expect(emailService.sendEmail(emailData))
        .rejects
        .toThrow('Rate limit exceeded');
    });

    it('should allow emails within rate limit', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      // Mock Redis to simulate within rate limit
      mockRedis.get.mockResolvedValue('2'); // Assume limit is 5 emails per minute

      mockResend.emails.send.mockResolvedValueOnce({
        id: 'test-email-id',
        from: 'notifications@midwaycleaning.com',
        ...emailData,
      });

      const result = await emailService.sendEmail(emailData);
      expect(result.success).toBe(true);
    });
  });

  describe('Email Tracking', () => {
    it('should track email status', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
        trackingId: 'track-123',
      };

      mockResend.emails.send.mockResolvedValueOnce({
        id: 'test-email-id',
        from: 'notifications@midwaycleaning.com',
        ...emailData,
      });

      const result = await emailService.sendEmail(emailData);

      expect(mockRedis.set).toHaveBeenCalledWith(
        expect.stringContaining('email:status:'),
        expect.any(String)
      );

      expect(result).toEqual({
        success: true,
        messageId: 'test-email-id',
      });
    });

    it('should retrieve email status', async () => {
      const trackingId = 'track-123';
      const emailStatus = {
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
      };

      mockRedis.get.mockResolvedValueOnce(JSON.stringify(emailStatus));

      const status = await emailService.getEmailStatus(trackingId);
      expect(status).toEqual(emailStatus);
    });
  });
});
