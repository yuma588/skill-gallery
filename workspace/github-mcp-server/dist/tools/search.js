/**
 * Search Tools
 */
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatIssue, formatSearchResults, ResponseFormat } from "../services/formatters.js";
// ============== Search Code ==============
const SearchCodeSchema = z.object({
    query: z.string()
        .min(1, "Query is required")
        .max(256, "Query must not exceed 256 characters")
        .describe("Search query with qualifiers (e.g., 'filename:package.json language:typescript')"),
    sort: z.enum(["indexed"])
        .optional()
        .describe("Sort by: 'indexed' (default: 'best-match')"),
    order: z.enum(["asc", "desc"])
        .optional()
        .describe("Order: 'asc' or 'desc'"),
    per_page: z.number()
        .int()
        .min(1)
        .max(100)
        .default(30)
        .describe("Results per page (1-100)"),
    page: z.number()
        .int()
        .min(1)
        .default(1)
        .describe("Page number"),
    response_format: z.nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format: 'markdown' or 'json'")
}).strict();
// ============== Search Issues ==============
const SearchIssuesSchema = z.object({
    query: z.string()
        .min(1, "Query is required")
        .max(256, "Query must not exceed 256 characters")
        .describe("Search query with qualifiers (e.g., 'is:open label:bug')"),
    sort: z.enum(["comments", "created", "updated"])
        .optional()
        .describe("Sort by: 'comments', 'created', or 'updated' (default: 'best-match')"),
    order: z.enum(["asc", "desc"])
        .optional()
        .describe("Order: 'asc' or 'desc'"),
    per_page: z.number()
        .int()
        .min(1)
        .max(100)
        .default(30)
        .describe("Results per page (1-100)"),
    page: z.number()
        .int()
        .min(1)
        .default(1)
        .describe("Page number"),
    response_format: z.nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format: 'markdown' or 'json'")
}).strict();
// ============== Register Tools ==============
export function registerSearchTools(server) {
    // Search Code
    server.registerTool("github_search_code", {
        title: "Search Code Across Repositories",
        description: `Search for code across all public repositories on GitHub.

This tool searches for code snippets using GitHub's advanced search syntax with qualifiers for language, file name, repository, and more.

Args:
  - query (string): Search query with qualifiers (required). Examples:
    * 'language:typescript filename:package.json' - TypeScript package.json files
    * 'repo:facebook/react useState' - 'useState' in React repo
    * 'language:python filename:app.py main' - 'main' in Python app files
    * 'org:microsoft security:true' - Security issues in Microsoft repos
  - sort (string): Sort by 'indexed' (default: 'best-match')
  - order (string): 'asc' or 'desc'
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "total_count": number,      // Total matching code results
    "incomplete_results": boolean,  // Whether results may be incomplete
    "items": [Code result objects],
    "has_more": boolean,        // Whether more pages available
    "next_page": number         // Next page number if has_more is true
  }

Examples:
  - Search for React hooks: query='language:typescript "useEffect"'
  - Search in specific repo: query='repo:vuejs/vue composition api'
  - Find function definitions: query='language:javascript "export function"'

Error Handling:
  - Returns "Error: Rate limit exceeded" if too many requests (429)
  - Returns "No code found matching '<query>'" if search returns empty`,
        inputSchema: SearchCodeSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true
        }
    }, async (params) => {
        try {
            const pagination = githubClient.validatePagination(params.per_page, params.page);
            const queryParams = {
                q: params.query,
                per_page: pagination.per_page,
                page: pagination.page
            };
            if (params.sort) {
                queryParams.sort = params.sort;
                if (params.order) {
                    queryParams.order = params.order;
                }
            }
            const data = await githubClient.request(`/search/code`, "GET", undefined, queryParams);
            if (!data.items || data.items.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: `No code found matching '${params.query}'`
                        }]
                };
            }
            const outputData = { ...data, has_more: data.items.length === pagination.per_page, next_page: pagination.page + 1 };
            // Simple markdown formatter for code search results
            let markdownContent = `# Code Search Results\n\n**Total**: ${data.total_count} matches\n**Showing**: ${data.items.length} results\n\n`;
            for (const item of data.items) {
                markdownContent += `## ${item.name}\n`;
                markdownContent += `- **Repository**: ${item.repository?.full_name || "Unknown"}\n`;
                markdownContent += `- **Path**: ${item.path}\n`;
                markdownContent += `- **URL**: ${item.html_url}\n`;
                markdownContent += `\n`;
            }
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? markdownContent
                : JSON.stringify(outputData, null, 2);
            const response = {
                content: [{ type: "text", text: textContent }]
            };
            if (params.response_format === ResponseFormat.JSON) {
                response.structuredContent = outputData;
            }
            return response;
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: error instanceof Error ? error.message : "An unknown error occurred"
                    }]
            };
        }
    });
    // Search Issues
    server.registerTool("github_search_issues", {
        title: "Search Issues Across Repositories",
        description: `Search for issues across all public repositories on GitHub.

This tool searches for issues using GitHub's advanced search syntax with qualifiers for state, labels, author, and more.

Args:
  - query (string): Search query with qualifiers (required). Examples:
    * 'is:open label:bug' - Open bug issues
    * 'repo:facebook/react is:issue' - Issues in React repo
    * 'author:github created:>2024-01-01' - Issues by GitHub author created after 2024
    * 'is:pr merged:>2024-01-01' - PRs merged after 2024
  - sort (string): Sort by 'comments', 'created', or 'updated' (default: 'best-match')
  - order (string): 'asc' or 'desc'
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "total_count": number,      // Total matching issues
    "incomplete_results": boolean,  // Whether results may be incomplete
    "items": [Issue objects],
    "has_more": boolean,        // Whether more pages available
    "next_page": number         // Next page number if has_more is true
  }

Examples:
  - Search for open bugs: query='is:open label:bug'
  - Search in React repo: query='repo:facebook/react is:issue'
  - Find recently updated issues: query='is:open updated:>2024-01-01'

Error Handling:
  - Returns "Error: Rate limit exceeded" if too many requests (429)
  - Returns "No issues found matching '<query>'" if search returns empty`,
        inputSchema: SearchIssuesSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true
        }
    }, async (params) => {
        try {
            const pagination = githubClient.validatePagination(params.per_page, params.page);
            const queryParams = {
                q: params.query,
                per_page: pagination.per_page,
                page: pagination.page
            };
            if (params.sort) {
                queryParams.sort = params.sort;
                if (params.order) {
                    queryParams.order = params.order;
                }
            }
            const data = await githubClient.request(`/search/issues`, "GET", undefined, queryParams);
            if (!data.items || data.items.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: `No issues found matching '${params.query}'`
                        }]
                };
            }
            const outputData = { ...data, has_more: data.items.length === pagination.per_page, next_page: pagination.page + 1 };
            // Use issue formatter
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? formatSearchResults(data, (item) => formatIssue(item))
                : JSON.stringify(outputData, null, 2);
            const response = {
                content: [{ type: "text", text: textContent }]
            };
            if (params.response_format === ResponseFormat.JSON) {
                response.structuredContent = outputData;
            }
            return response;
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: error instanceof Error ? error.message : "An unknown error occurred"
                    }]
            };
        }
    });
}
//# sourceMappingURL=search.js.map