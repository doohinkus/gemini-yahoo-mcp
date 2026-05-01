# Yahoo Mail MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with Yahoo Mail. This server allows tools like Claude Desktop to read, search, and send emails directly through your Yahoo account using secure OAuth2 authentication.

## Features (Planned)

- **Read Emails**: Fetch recent messages from your inbox.
- **Search Emails**: Search for specific messages using keywords, senders, or dates.
- **Send Emails**: Compose and send emails using Yahoo's SMTP servers.

## Prerequisites

- **Node.js**: Version 20 or higher.
- **Yahoo Developer App**: You must create an app in the [Yahoo Developer Portal](https://developer.yahoo.com/apps/) to obtain OAuth2 credentials.

### Creating a Yahoo App for OAuth2

1. Go to the [Yahoo Developer Portal](https://developer.yahoo.com/apps/).
2. Create a new app.
3. Set the **API Permissions** to include `Mail` (Read and Write).
4. Set the **Redirect URI** to `https://localhost/callback` (or your preferred URI).
5. Note your **Client ID** and **Client Secret**.

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
   YAHOO_CLIENT_ID=your-client-id
   YAHOO_CLIENT_SECRET=your-client-secret
   YAHOO_REDIRECT_URI=https://localhost/callback
   ```

## Authentication

The first time you run the server, it will trigger an OAuth2 flow:
1. A browser window will open asking you to log in to Yahoo.
2. After authorizing, you will be redirected to your `REDIRECT_URI`.
3. The page might fail to load, but that's fine—**copy the `code` parameter from the address bar**.
4. Paste the code back into your terminal.
5. The server will exchange the code for tokens and save them securely in `.tokens.json`.

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

### Integration with Claude Desktop

To use this server with Claude Desktop, add it to your `claude_desktop_config.json`:

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
- `src/auth/`: OAuth2 flow and token management.
- `src/tools/`: Implementation of individual email tools.
- `src/lib/`: Helper libraries for IMAP and SMTP connections.

## License

ISC
