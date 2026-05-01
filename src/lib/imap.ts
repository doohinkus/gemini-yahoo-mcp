import imaps from 'imap-simple';
import dotenv from 'dotenv';

dotenv.config();

const YAHOO_IMAP_HOST = 'imap.mail.yahoo.com';
const YAHOO_IMAP_PORT = 993;

export const connectIMAP = async (): Promise<imaps.ImapSimple> => {
  const email = process.env.YAHOO_EMAIL;
  const password = process.env.YAHOO_APP_PASSWORD;

  console.log('Connecting with Email:', email);
  console.log('Password length:', password?.length);

  if (!email || !password) {
    throw new Error('YAHOO_EMAIL and YAHOO_APP_PASSWORD environment variables must be set');
  }

  const config = {
    imap: {
      user: email,
      password: password,
      host: YAHOO_IMAP_HOST,
      port: YAHOO_IMAP_PORT,
      tls: true,
      authTimeout: 10000,
    },
  };

  try {
    const connection = await imaps.connect(config);
    return connection;
  } catch (error) {
    console.error('IMAP Connection Error:', error);
    throw error;
  }
};
