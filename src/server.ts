import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readEmails } from "./tools/readEmails.js";
import { searchEmails } from "./tools/searchEmails.js";
import { sendEmail } from "./tools/sendEmail.js";

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
    const emails = await readEmails(count);
    return {
      content: [{ type: "text", text: JSON.stringify(emails, null, 2) }],
    };
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
    const emails = await searchEmails(args);
    return {
      content: [{ type: "text", text: JSON.stringify(emails, null, 2) }],
    };
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
    const result = await sendEmail(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);
