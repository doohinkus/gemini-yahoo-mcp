import { connectIMAP } from "../lib/imap.js";
import { simpleParser } from "mailparser";
import imaps from "imap-simple";

export const readEmails = async (count: number = 10) => {
  const connection = await connectIMAP();

  try {
    await connection.openBox("INBOX");

    // Fetch last N messages
    const searchCriteria = ["ALL"];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT", ""],
      struct: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    // Sort by UID descending (newest first)
    messages.sort((a, b) => b.attributes.uid - a.attributes.uid);

    const limitedMessages = messages.slice(0, count);

    const results = await Promise.all(
      limitedMessages.map(async (item: imaps.Message) => {
        const all = item.parts.find((part: imaps.MessageBodyPart) => part.which === "");
        const id = item.attributes.uid;

        if (!all) return { id, error: "Could not fetch message body" };

        const parsed = await simpleParser(all.body);

        return {
          id,
          from: parsed.from?.text,
          subject: parsed.subject,
          date: parsed.date,
          snippet: parsed.text ? parsed.text.substring(0, 200).replace(/\s+/g, " ") + "..." : "",
        };
      })
    );

    return results;
  } finally {
    connection.end();
  }
};
