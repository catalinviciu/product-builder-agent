#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HttpStoreAdapter } from "./adapters/HttpStoreAdapter.js";
import { registerTools } from "./tools/register.js";

/**
 * Product Agent MCP server entry point.
 *
 * Transport: stdio (Claude Code launches this as a subprocess).
 * Storage:   HTTP adapter pointing at the local Next.js dev server.
 *
 * Future cloud variant: same entry point, but PA_API_URL points at
 * the hosted API and PA_AUTH_TOKEN is loaded from the OS keychain.
 */
async function main(): Promise<void> {
  const baseUrl = process.env.PA_API_URL ?? "http://localhost:3000";
  const authToken = process.env.PA_AUTH_TOKEN; // optional in local dev

  const adapter = new HttpStoreAdapter({ baseUrl, authToken });

  const server = new McpServer({
    name: "product-agent-mcp",
    version: "0.1.0",
  });

  registerTools(server, adapter);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stderr only — stdout is reserved for the MCP protocol
  process.stderr.write(`[product-agent-mcp] connected (api=${baseUrl})\n`);
}

main().catch((err) => {
  process.stderr.write(`[product-agent-mcp] fatal: ${err?.stack ?? err}\n`);
  process.exit(1);
});
