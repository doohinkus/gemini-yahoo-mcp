import { server } from "./server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Yahoo Mail MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
