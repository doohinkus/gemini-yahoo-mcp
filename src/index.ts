import { server } from "./server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";
import logger from "./lib/logger.js";
import "./lib/config.js"; // Ensure config is validated at startup

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Yahoo Mail MCP server running on stdio");
}

main().catch((error) => {
  logger.error("Server error:", error);
  process.exit(1);
});
