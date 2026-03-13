// Stubbed email sender -- nodemailer is not installed.
// Replace with a real provider (Resend, SendGrid, etc.) when needed.

export async function sendReportEmail(options: {
  to: string[];
  subject: string;
  templateName: string;
  data: unknown;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}) {
  console.log('[EMAIL STUB] sendReportEmail called:', {
    to: options.to,
    subject: options.subject,
    templateName: options.templateName,
  });
}
