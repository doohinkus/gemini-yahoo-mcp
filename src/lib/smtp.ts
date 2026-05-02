import nodemailer from "nodemailer";
import { config as appConfig } from "./config.js";
import logger from "./logger.js";

const YAHOO_SMTP_HOST = "smtp.mail.yahoo.com";
const YAHOO_SMTP_PORT = 465;

export const connectSMTP = async () => {
  const email = appConfig.YAHOO_EMAIL;
  const password = appConfig.YAHOO_APP_PASSWORD;

  logger.debug("Connecting to SMTP", { email });

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
