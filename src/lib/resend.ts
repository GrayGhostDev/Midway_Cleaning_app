// Resend email stub -- resend package is not installed.
// Install resend when transactional email is needed.

export const resend = {
  emails: {
    async send(options: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) {
      console.log('[RESEND STUB] send email:', {
        from: options.from,
        to: options.to,
        subject: options.subject,
      });
      return { id: 'stub-' + Date.now() };
    },
  },
};
