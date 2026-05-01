import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const YAHOO_SMTP_HOST = 'smtp.mail.yahoo.com';
const YAHOO_SMTP_PORT = 465;

export const connectSMTP = async () => {
  const email = process.env.YAHOO_EMAIL;
  const password = process.env.YAHOO_APP_PASSWORD;

  if (!email || !password) {
    throw new Error('YAHOO_EMAIL and YAHOO_APP_PASSWORD must be set');
  }

  const transporter = nodemailer.createTransport({
    host: YAHOO_SMTP_HOST,
    port: YAHOO_SMTP_PORT,
    secure: true, // use TLS
    auth: {
      user: email,
      pass: password,
    },
  });

  return transporter;
};
