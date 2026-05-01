# Yahoo Mail MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with Yahoo Mail via IMAP and SMTP. This server allows tools like Claude Desktop to read, search, and send emails directly through your Yahoo account.

## Features (Planned)

- **Read Emails**: Fetch recent messages from your inbox.
- **Search Emails**: Search for specific messages using keywords, senders, or dates.
- **Send Emails**: Compose and send emails using Yahoo's SMTP servers.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **Yahoo App Password**: Yahoo requires an [App Password](https://help.yahoo.com/kb/SLN15241.html) for third-party applications to access your mail. Standard account passwords will not work.

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
   Create a `.env` file in the root directory and add your Yahoo credentials:
   ```env
   YAHOO_EMAIL=your-email@yahoo.com
   YAHOO_APP_PASSWORD=your-app-password
   ```

## Usage

### Development
To run the server in development mode with `vite-node`:
```bash
npm run dev
```

### Build
To build the project for production:
```bash
npm run build
```

### Production
To start the built server:
```bash
npm start
```

## Integration with Claude Desktop

To use this server with Claude Desktop, add it to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yahoo-mail": {
      "command": "node",
      "args": ["/path/to/yahoo-mail-mcp/dist/index.js"],
      "env": {
        "YAHOO_EMAIL": "your-email@yahoo.com",
        "YAHOO_APP_PASSWORD": "your-app-password"
      }
    }
  }
}
```

## Project Structure

- `src/index.ts`: Entry point for the MCP server.
- `src/server.ts`: MCP server initialization and tool registration.
- `src/tools/`: Implementation of individual email tools.
- `src/lib/`: Helper libraries for IMAP and SMTP connections.

## License

ISC
