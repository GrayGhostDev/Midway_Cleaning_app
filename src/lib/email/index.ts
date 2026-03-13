// Email service stub -- no email provider is configured yet.
// Replace with Resend, SendGrid, or similar when ready.

export async function sendEmail(options: {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, string>;
}) {
  console.log('[EMAIL STUB] sendEmail:', {
    to: options.to,
    subject: options.subject,
    template: options.template,
  });
}

export { sendReportEmail } from './sender';
