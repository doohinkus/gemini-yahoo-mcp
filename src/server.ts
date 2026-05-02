import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readEmails } from "./tools/readEmails.js";
import { searchEmails } from "./tools/searchEmails.js";
import { sendEmail } from "./tools/sendEmail.js";
import { readEmailContent } from "./tools/readEmailContent.js";
import { getCoupons } from "./tools/getCoupons.js";
import logger from "./lib/logger.js";

export const server = new McpServer({
  name: "yahoo-mail-mcp",
  version: "1.0.0",
});

// Register read_emails tool
server.tool(
  "read_emails",
  "Fetch recent emails from the inbox",
  {
    count: z.number().optional().default(10).describe("Number of emails to fetch"),
  },
  async ({ count }) => {
    logger.info("Fetching recent emails", { count });
    try {
      const emails = await readEmails(count);
      return {
        content: [{ type: "text", text: JSON.stringify(emails, null, 2) }],
      };
    } catch (error) {
      logger.error("Error reading emails", { error });
      throw error;
    }
  }
);

// Register read_email_content tool
server.tool(
  "read_email_content",
  "Fetch the full content of a specific email by UID",
  {
    uid: z.number().describe("The UID of the email to fetch"),
  },
  async ({ uid }) => {
    logger.info("Fetching email content", { uid });
    try {
      const email = await readEmailContent(uid);
      return {
        content: [{ type: "text", text: JSON.stringify(email, null, 2) }],
      };
    } catch (error) {
      logger.error("Error reading email content", { uid, error });
      throw error;
    }
  }
);

// Register get_coupons tool
server.tool(
  "get_coupons",
  "Search for coupon-related emails and extract potential promo codes",
  {
    limit: z.number().optional().default(5).describe("Maximum number of emails to scan"),
  },
  async ({ limit }) => {
    logger.info("Searching for coupons", { limit });
    try {
      const coupons = await getCoupons(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(coupons, null, 2) }],
      };
    } catch (error) {
      logger.error("Error getting coupons", { error });
      throw error;
    }
  }
);

// Register search_emails tool
server.tool(
  "search_emails",
  "Search for emails using keywords, sender, or subject",
  {
    query: z.string().optional().describe("Search keywords for message body"),
    from: z.string().optional().describe("Filter by sender email address"),
    subject: z.string().optional().describe("Filter by subject keyword"),
    since: z.string().optional().describe("Filter by date (e.g., 'May 20, 2024')"),
    limit: z.number().optional().default(10).describe("Maximum number of results to return"),
  },
  async (args) => {
    logger.info("Searching emails", args);
    try {
      const emails = await searchEmails(args);
      return {
        content: [{ type: "text", text: JSON.stringify(emails, null, 2) }],
      };
    } catch (error) {
      logger.error("Error searching emails", { args, error });
      throw error;
    }
  }
);

// Register send_email tool
server.tool(
  "send_email",
  "Send an email to a recipient",
  {
    to: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Email body content"),
  },
  async (args) => {
    logger.info("Sending email", { to: args.to, subject: args.subject });
    try {
      const result = await sendEmail(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      logger.error("Error sending email", { to: args.to, error });
      throw error;
    }
  }
);
