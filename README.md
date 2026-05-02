# Yahoo Mail MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with Yahoo Mail. This server allows tools like Gemini CLI or Claude Desktop to read, search, and send emails directly through your Yahoo account.

## Features

- **Read Emails**: Fetch recent messages from your inbox.
- **Search Emails**: Search for specific messages using keywords, senders, or dates.
- **Send Emails**: Compose and send emails using Yahoo's SMTP servers.
- **Production Ready**: Includes Docker support, structured logging, environment validation, and automated tests.

## Prerequisites

- **Node.js**: Version 20 or higher (or Docker).
- **Yahoo App Password**: For security and ease of use, this server uses Yahoo App Passwords instead of traditional OAuth2 for personal integrations.

### Generating a Yahoo App Password

1. Go to your [Yahoo Account Security](https://login.yahoo.com/account/security) page.
2. Select **Generate app password**.
3. Choose **Other App** and name it "Gemini CLI" (or any name you prefer).
4. Copy the **16-character password** provided.

## Setup

### Local Development

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
   LOG_LEVEL=info
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

### Docker Setup (Recommended for Production)

Build and run the server using Docker to ensure a consistent environment:

1. **Build the image:**

   ```bash
   docker build -t yahoo-mail-mcp .
   ```

2. **Run the container (for testing build):**
   ```bash
   docker run --env-file .env yahoo-mail-mcp
   ```

## Development Commands

- `npm run dev`: Start the server in development mode.
- `npm run lint`: Lint the codebase using ESLint.
- `npm run format`: Format the codebase using Prettier.
- `npm run test`: Run the test suite using Vitest.
- `npm run build`: Build the project for production.

## Integration with Gemini CLI

### 1. Register the Server (Local)

```bash
gemini mcp add yahoo-mail node $(pwd)/dist/index.js
```

### 2. Register the Server (Docker)

```bash
gemini mcp add yahoo-mail-docker docker -- run -i --rm --env-file $(pwd)/.env yahoo-mail-mcp
```

## Example Usage

Once registered, you can use natural language to interact with your mail.

### Reading Emails

**You:** "Show me my 5 most recent emails from Yahoo."

### Searching Emails

**You:** "Find any emails from 'Amazon' about my recent order."

### Sending Emails

**You:** "Send an email to <your-email>@yahoo.com with the subject 'Hello' and the body 'Checking in from my CLI!'"

## Project Structure

- `src/index.ts`: Entry point for the MCP server.
- `src/server.ts`: MCP server initialization and tool registration.
- `src/tools/`: Implementation of `read_emails`, `search_emails`, and `send_email`.
- `src/lib/`:
  - `imap.ts`: IMAP connection helper.
  - `smtp.ts`: SMTP connection helper.
  - `logger.ts`: Winston-based structured logging.
  - `config.ts`: Zod-based environment validation.

## License

ISC
