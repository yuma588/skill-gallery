#!/usr/bin/env node
/**
 * GitHub MCP Server
 *
 * This server provides tools to interact with GitHub's REST API, including:
 * - Repository management
 * - Issue tracking
 * - Pull request operations
 * - Search functionality
 * - User profiles
 * - Commit history
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { registerRepositoryTools } from "./tools/repositories.js";
import { registerIssueTools } from "./tools/issues.js";
import { registerPullRequestTools } from "./tools/pullRequests.js";
import { registerSearchTools } from "./tools/search.js";
import { registerUserTools } from "./tools/users.js";
import { registerCommitTools } from "./tools/commits.js";
// Create MCP server instance
const server = new McpServer({
    name: "github-mcp-server",
    version: "1.0.0"
});
// Register all tools
registerRepositoryTools(server);
registerIssueTools(server);
registerPullRequestTools(server);
registerSearchTools(server);
registerUserTools(server);
registerCommitTools(server);
// Main function for stdio (local)
async function runStdio() {
    if (!process.env.GITHUB_TOKEN) {
        console.error("WARNING: GITHUB_TOKEN environment variable not set. Some endpoints may have limited access.");
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("GitHub MCP server running via stdio");
}
// Main function for HTTP (remote)
async function runHTTP() {
    if (!process.env.GITHUB_TOKEN) {
        console.error("WARNING: GITHUB_TOKEN environment variable not set. Some endpoints may have limited access.");
    }
    const app = express();
    app.use(express.json());
    app.post('/mcp', async (req, res) => {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });
        res.on('close', () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    const port = parseInt(process.env.PORT || '3000');
    app.listen(port, () => {
        console.error(`GitHub MCP server running on http://localhost:${port}/mcp`);
    });
}
// Choose transport based on environment
const transport = process.env.TRANSPORT || 'stdio';
if (transport === 'http') {
    runHTTP().catch(error => {
        console.error("Server error:", error);
        process.exit(1);
    });
}
else {
    runStdio().catch(error => {
        console.error("Server error:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map