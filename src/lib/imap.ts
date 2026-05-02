import imaps from "imap-simple";
import { config as appConfig } from "./config.js";
import logger from "./logger.js";

const YAHOO_IMAP_HOST = "imap.mail.yahoo.com";
const YAHOO_IMAP_PORT = 993;

export const connectIMAP = async (): Promise<imaps.ImapSimple> => {
  const email = appConfig.YAHOO_EMAIL;
  const password = appConfig.YAHOO_APP_PASSWORD;

  logger.debug("Connecting to IMAP", { email });

  const imapConfig = {
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
    const connection = await imaps.connect(imapConfig);
    return connection;
  } catch (error) {
    logger.error("IMAP Connection Error", { error });
    throw error;
  }
};
