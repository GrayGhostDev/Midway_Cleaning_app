import { format } from 'date-fns';
import { Schedule } from '../schedule';
import { FileMetadata } from '../storage';

interface EmailTemplate {
  subject: string;
  html: string;
}

export function generateScheduleReminder(schedule: Schedule): EmailTemplate {
  const date = format(new Date(schedule.startTime), 'MMMM do, yyyy');
  const time = format(new Date(schedule.startTime), 'h:mm a');

  return {
    subject: `Cleaning Service Reminder - ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Upcoming Cleaning Service Reminder</h2>
        <p>Hello,</p>
        <p>This is a reminder about your upcoming cleaning service:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Location:</strong> ${schedule.location}</p>
          <p><strong>Service Type:</strong> ${schedule.type}</p>
          ${schedule.notes ? `<p><strong>Notes:</strong> ${schedule.notes}</p>` : ''}
        </div>
        <p>If you need to make any changes, please contact us as soon as possible.</p>
        <p>Best regards,<br>Midway Cleaning Co.</p>
      </div>
    `,
  };
}

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
}

export function generateInvoiceEmail(invoice: InvoiceData): EmailTemplate {
  const dueDate = format(new Date(invoice.dueDate), 'MMMM do, yyyy');

  return {
    subject: `Invoice #${invoice.invoiceNumber} from Midway Cleaning Co.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Invoice #${invoice.invoiceNumber}</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>To:</strong> ${invoice.customerName}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #e9ecef;">
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: right;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Rate</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
            ${invoice.items.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${item.description}</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$${item.rate.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; text-align: right;">$${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          
          <div style="margin-left: auto; width: 200px;">
            <p><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> $${invoice.tax.toFixed(2)}</p>
            <p style="font-size: 1.2em;"><strong>Total:</strong> $${invoice.total.toFixed(2)}</p>
          </div>
        </div>
        
        <p>Please make payment by ${dueDate}.</p>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>Midway Cleaning Co.</p>
      </div>
    `,
  };
}

export function generateFileShareNotification(file: FileMetadata, sharedByName: string): EmailTemplate {
  return {
    subject: `${sharedByName} shared a file with you`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New File Shared</h2>
        <p>${sharedByName} has shared a file with you:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>File Name:</strong> ${file.originalName}</p>
          <p><strong>Type:</strong> ${file.mimeType}</p>
          <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
          ${file.tags?.length ? `<p><strong>Tags:</strong> ${file.tags.join(', ')}</p>` : ''}
        </div>
        <p>You can access this file by logging into your account.</p>
        <p>Best regards,<br>Midway Cleaning Co.</p>
      </div>
    `,
  };
}

export function generateStatusUpdateNotification(schedule: Schedule): EmailTemplate {
  return {
    subject: `Service Status Update - ${schedule.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Service Status Update</h2>
        <p>Your cleaning service status has been updated:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Status:</strong> <span style="color: ${
            schedule.status === 'COMPLETED' ? '#28a745' :
            schedule.status === 'IN_PROGRESS' ? '#ffc107' :
            schedule.status === 'CANCELLED' ? '#dc3545' : '#6c757d'
          };">${schedule.status}</span></p>
          <p><strong>Service Type:</strong> ${schedule.type}</p>
          <p><strong>Location:</strong> ${schedule.location}</p>
          <p><strong>Date:</strong> ${format(new Date(schedule.startTime), 'MMMM do, yyyy')}</p>
          ${schedule.notes ? `<p><strong>Notes:</strong> ${schedule.notes}</p>` : ''}
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Midway Cleaning Co.</p>
      </div>
    `,
  };
}

export function generateWelcomeEmail(customerName: string): EmailTemplate {
  return {
    subject: 'Welcome to Midway Cleaning Co.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to Midway Cleaning Co.!</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for choosing Midway Cleaning Co. for your cleaning needs. We're excited to have you as our customer!</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>Schedule your first cleaning service</li>
            <li>Download our mobile app</li>
            <li>Set up your preferences</li>
            <li>Explore our additional services</li>
          </ul>
        </div>
        <p>If you have any questions or need assistance, our customer support team is here to help.</p>
        <p>Best regards,<br>Midway Cleaning Co.</p>
      </div>
    `,
  };
}
