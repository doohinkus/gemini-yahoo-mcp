import { connectSMTP } from "../lib/smtp.js";
import { config as appConfig } from "../lib/config.js";
import logger from "../lib/logger.js";

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  const transporter = await connectSMTP();

  const from = appConfig.YAHOO_EMAIL;

  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully", { messageId: info.messageId });
    return {
      messageId: info.messageId,
      status: "success",
    };
  } catch (error) {
    logger.error("Send Email Error", { error });
    throw error;
  }
};
