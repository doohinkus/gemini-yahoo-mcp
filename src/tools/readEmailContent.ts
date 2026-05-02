import { connectIMAP } from "../lib/imap.js";
import { simpleParser } from "mailparser";
import imaps from "imap-simple";

export const readEmailContent = async (uid: number) => {
  const connection = await connectIMAP();

  try {
    await connection.openBox("INBOX");

    const searchCriteria = [["UID", uid]];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT", ""],
      struct: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    if (messages.length === 0) {
      return { error: `Email with UID ${uid} not found` };
    }

    const item = messages[0];
    const all = item.parts.find((part: imaps.MessageBodyPart) => part.which === "");

    if (!all) return { error: "Could not fetch message body" };

    const parsed = await simpleParser(all.body);

    return {
      id: item.attributes.uid,
      from: parsed.from?.text,
      subject: parsed.subject,
      date: parsed.date,
      body: parsed.text,
      html: parsed.html,
    };
  } finally {
    connection.end();
  }
};
