# Yahoo Mail MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with Yahoo Mail. This server allows tools like Gemini CLI or Claude Desktop to read, search, and send emails directly through your Yahoo account.

## Features

- **Read Emails**: Fetch recent messages from your inbox.
- **Search Emails**: Search for specific messages using keywords, senders, or dates.
- **Send Emails**: Compose and send emails using Yahoo's SMTP servers.

## Prerequisites

- **Node.js**: Version 20 or higher.
- **Yahoo App Password**: For security and ease of use, this server uses Yahoo App Passwords instead of traditional OAuth2 for personal integrations.

### Generating a Yahoo App Password

1. Go to your [Yahoo Account Security](https://login.yahoo.com/account/security) page.
2. Select **Generate app password**.
3. Choose **Other App** and name it "Gemini CLI" (or any name you prefer).
4. Copy the **16-character password** provided.

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd yahoo-mail-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   YAHOO_EMAIL=your-email@yahoo.com
   YAHOO_APP_PASSWORD=your-16-character-app-password
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## Integration with Gemini CLI

### 1. Register the Server
Add the server to your Gemini CLI configuration using the `mcp add` command:

```bash
gemini mcp add yahoo-mail node $(pwd)/dist/index.js
```

### 2. Reload Tools
Inside a Gemini CLI session, reload the tools to make the Yahoo Mail tools available:
```
/mcp reload
```

## Example Usage

Once registered, you can use natural language to interact with your mail.

### Reading Emails
**You:** "Show me my 5 most recent emails from Yahoo."
**Gemini:** *Fetches and displays the subject lines, senders, and snippets of your latest 5 messages.*

### Searching Emails
**You:** "Find any emails from 'Amazon' about my recent order."
**Gemini:** *Searches your inbox for 'Amazon' and returns matching results.*

### Sending Emails
**You:** "Send an email to rafaeliscoding@yahoo.com with the subject 'Hello' and the body 'Checking in from my CLI!'"
**Gemini:** *Composes and sends the email through Yahoo's SMTP server.*

## Integration with Claude Desktop

Add the server to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yahoo-mail": {
      "command": "node",
      "args": ["/path/to/yahoo-mail-mcp/dist/index.js"]
    }
  }
}
```

## Project Structure

- `src/index.ts`: Entry point for the MCP server.
- `src/server.ts`: MCP server initialization and tool registration.
- `src/tools/`: Implementation of `read_emails`, `search_emails`, and `send_email`.
- `src/lib/`: IMAP and SMTP connection helpers.

## License

ISC
