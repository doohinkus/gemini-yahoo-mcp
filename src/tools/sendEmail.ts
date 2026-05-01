import { connectSMTP } from '../lib/smtp.js';

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  const transporter = await connectSMTP();
  
  const from = process.env.YAHOO_EMAIL;
  
  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      messageId: info.messageId,
      status: 'success'
    };
  } catch (error) {
    console.error('Send Email Error:', error);
    throw error;
  }
};
