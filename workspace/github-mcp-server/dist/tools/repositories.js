/**
 * Repository Tools
 */
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatRepository, formatRepositoryList, formatSearchResults, ResponseFormat } from "../services/formatters.js";
// ============== Search Repositories ==============
const SearchRepositoriesSchema = z.object({
    query: z.string()
        .min(1, "Query is required")
        .max(256, "Query must not exceed 256 characters")
        .describe("Search query with qualifiers (e.g., 'stars:>1000 language:typescript user:facebook')"),
    sort: z.enum(["stars", "forks", "help-wanted-issues", "updated"])
        .optional()
        .describe("Sort by: 'stars', 'forks', 'help-wanted-issues', 'updated'"),
    order: z.enum(["asc", "desc"])
        .optional()
        .describe("Order: 'asc' or 'desc' (default: 'desc')"),
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
// ============== List Repositories ==============
const ListRepositoriesSchema = z.object({
    owner: z.string()
        .min(1, "Owner is required")
        .max(39, "Owner must not exceed 39 characters")
        .describe("Username or organization name"),
    type: z.enum(["all", "public", "private", "forks", "sources", "member"])
        .default("all")
        .describe("Repository type"),
    sort: z.enum(["created", "updated", "pushed", "full_name"])
        .default("created")
        .describe("Sort by"),
    direction: z.enum(["asc", "desc"])
        .default("desc")
        .describe("Sort direction"),
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
// ============== Get Repository ==============
const GetRepositorySchema = z.object({
    owner: z.string()
        .min(1, "Owner is required")
        .max(39, "Owner must not exceed 39 characters")
        .describe("Repository owner"),
    repo: z.string()
        .min(1, "Repository name is required")
        .max(100, "Repository name must not exceed 100 characters")
        .describe("Repository name"),
    response_format: z.nativeEnum(ResponseFormat)
        .default(ResponseFormat.MARKDOWN)
        .describe("Output format: 'markdown' or 'json'")
}).strict();
// ============== Register Tools ==============
export function registerRepositoryTools(server) {
    // Search Repositories
    server.registerTool("github_search_repositories", {
        title: "Search GitHub Repositories",
        description: `Search for GitHub repositories by name, description, topics, and more using GitHub's search syntax.

This tool searches across all repositories on GitHub, supporting advanced qualifiers like language, stars, forks, user/org, and more.

Args:
  - query (string): Search query with qualifiers (required). Examples:
    * 'stars:>1000 language:typescript' - TypeScript repos with 1000+ stars
    * 'user:facebook topic:react' - React repositories by Facebook
    * 'created:>2024-01-01 forks:>100' - Repos created after 2024 with 100+ forks
    * 'is:public is:mirror' - Public mirror repositories
  - sort (string): Sort by 'stars', 'forks', 'help-wanted-issues', or 'updated' (default: 'best-match')
  - order (string): 'asc' or 'desc' (default: 'desc')
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "total_count": number,      // Total matching repositories
    "incomplete_results": boolean,  // Whether results may be incomplete
    "items": [Repository objects],
    "has_more": boolean,        // Whether more pages available
    "next_page": number         // Next page number if has_more is true
  }

Examples:
  - Find popular React repos: query='language:react stars:>10000'
  - Search Facebook's repos: query='user:facebook'
  - Find trending Python repos: query='language:python created:>2024-01-01'

Error Handling:
  - Returns "Error: Rate limit exceeded" if too many requests (429 status)
  - Returns "No repositories found matching '<query>'" if search returns empty`,
        inputSchema: SearchRepositoriesSchema,
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
            const data = await githubClient.request(`/search/repositories`, "GET", undefined, queryParams);
            if (!data.items || data.items.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: `No repositories found matching '${params.query}'`
                        }]
                };
            }
            const outputData = { ...data, has_more: data.items.length === pagination.per_page, next_page: pagination.page + 1 };
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? formatSearchResults(data, formatRepository)
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
    // List Repositories
    server.registerTool("github_list_repositories", {
        title: "List User/Organization Repositories",
        description: `List all repositories for a specific user or organization.

This tool retrieves repositories belonging to a user or organization, with options to filter by type and sort by various criteria.

Args:
  - owner (string): Username or organization name (required)
  - type (string): Repository type - 'all', 'public', 'private', 'forks', 'sources', 'member' (default: 'all')
  - sort (string): Sort by 'created', 'updated', 'pushed', or 'full_name' (default: 'created')
  - direction (string): 'asc' or 'desc' (default: 'desc')
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "count": number,              // Number of repositories in this response
    "offset": number,            // Current page number
    "repositories": [Repository objects],
    "has_more": boolean,         // Whether more repositories available
    "next_page": number          // Next page number if has_more is true
  }

Examples:
  - List all public repos for Microsoft: owner='microsoft', type='public'
  - List recently updated repos for a user: owner='username', sort='updated'
  - List forked repositories: owner='username', type='forks'

Error Handling:
  - Returns "Error: Resource not found" if user/org doesn't exist (404)
  - Returns "Error: Permission denied" for private repos without access (403)`,
        inputSchema: ListRepositoriesSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true
        }
    }, async (params) => {
        try {
            const pagination = githubClient.validatePagination(params.per_page, params.page);
            const repos = await githubClient.request(`/users/${params.owner}/repos`, "GET", undefined, {
                type: params.type,
                sort: params.sort,
                direction: params.direction,
                per_page: pagination.per_page,
                page: pagination.page
            });
            if (!repos || repos.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: `No repositories found for '${params.owner}'`
                        }]
                };
            }
            const outputData = { count: repos.length, offset: params.page, repositories: repos, has_more: repos.length === pagination.per_page, next_page: params.page + 1 };
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? formatRepositoryList(repos)
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
    // Get Repository
    server.registerTool("github_get_repository", {
        title: "Get Repository Details",
        description: `Get detailed information about a specific GitHub repository.

This tool retrieves complete information about a single repository, including description, owner, stats, topics, license, and more.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete repository object with fields:
  {
    "id": number,
    "name": string,
    "full_name": string,
    "owner": {login, id, avatar_url},
    "description": string | null,
    "private": boolean,
    "fork": boolean,
    "created_at": string,
    "updated_at": string,
    "pushed_at": string | null,
    "size": number,
    "stargazers_count": number,
    "watchers_count": number,
    "language": string | null,
    "forks_count": number,
    "open_issues_count": number,
    "default_branch": string,
    "topics": string[],
    "license": {key, name, url} | null,
    "parent": Repository | null,  // If forked
    "source": Repository | null,  // If forked
    ...
  }

Examples:
  - Get React repo details: owner='facebook', repo='react'
  - Get VS Code repo: owner='microsoft', repo='vscode'

Error Handling:
  - Returns "Error: Resource not found" if repository doesn't exist (404)`,
        inputSchema: GetRepositorySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        try {
            const repo = await githubClient.request(`/repos/${params.owner}/${params.repo}`);
            const textContent = params.response_format === ResponseFormat.MARKDOWN
                ? formatRepository(repo)
                : JSON.stringify(repo, null, 2);
            const response = {
                content: [{ type: "text", text: textContent }]
            };
            if (params.response_format === ResponseFormat.JSON) {
                response.structuredContent = repo;
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
//# sourceMappingURL=repositories.js.map