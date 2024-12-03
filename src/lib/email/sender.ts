import nodemailer from 'nodemailer';
import { compileTemplate } from './templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReportEmail(options: {
  to: string[];
  subject: string;
  templateName: string;
  data: any;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}) {
  const { to, subject, templateName, data, attachments } = options;
  const html = await compileTemplate(templateName, data);

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to.join(", "),
    subject,
    html,
    attachments: attachments?.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  };

  return transporter.sendMail(mailOptions);
}