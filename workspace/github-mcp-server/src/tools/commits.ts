/**
 * Commit Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatCommit, formatCommitList, ResponseFormat } from "../services/formatters.js";
import { GitHubCommit } from "../types.js";

// ============== List Commits ==============

const ListCommitsSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  sha: z.string()
    .max(40, "SHA must not exceed 40 characters")
    .optional()
    .describe("Branch name, tag, or SHA to start listing from"),
  path: z.string()
    .max(100, "Path must not exceed 100 characters")
    .optional()
    .describe("Only commits containing changes to this path"),
  since: z.string()
    .optional()
    .describe("ISO 8601 timestamp (e.g., '2024-01-01T00:00:00Z')"),
  until: z.string()
    .optional()
    .describe("ISO 8601 timestamp (e.g., '2024-12-31T23:59:59Z')"),
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

type ListCommitsInput = z.infer<typeof ListCommitsSchema>;

// ============== Get Commit ==============

const GetCommitSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  ref: z.string()
    .min(1, "Reference is required")
    .max(40, "Reference must not exceed 40 characters")
    .describe("SHA, branch name, or tag"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' or 'json'")
}).strict();

type GetCommitInput = z.infer<typeof GetCommitSchema>;

// ============== Register Tools ==============

export function registerCommitTools(server: McpServer): void {
  // List Commits
  server.registerTool(
    "github_list_commits",
    {
      title: "List Repository Commits",
      description: `List commits in a GitHub repository with filtering and pagination options.

This tool retrieves commit history from a repository, supporting filtering by path, date range, and branch/SHA.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - sha (string): Branch name, tag, or SHA to start listing from (optional, max 40 chars)
  - path (string): Only show commits that affect this path (optional, max 100 chars)
  - since (string): ISO 8601 timestamp to only show commits after this time (optional)
  - until (string): ISO 8601 timestamp to only show commits before this time (optional)
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "count": number,              // Number of commits in this response
    "offset": number,            // Current page number
    "commits": [Commit objects],
    "has_more": boolean,         // Whether more commits available
    "next_page": number          // Next page number if has_more is true
  }

Examples:
  - List commits on main branch: owner='facebook', repo='react', sha='main'
  - List recent commits: owner='microsoft', repo='vscode', per_page=20
  - Filter by file path: owner='owner', repo='repo', path='src/components/'
  - Filter by date: owner='owner', repo='repo', since='2024-01-01T00:00:00Z'

Error Handling:
  - Returns "Error: Resource not found" if repository doesn't exist (404)
  - Returns "Error: Permission denied" for private repos without access (403)`,
      inputSchema: ListCommitsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListCommitsInput) => {
      try {
        const pagination = githubClient.validatePagination(params.per_page, params.page);
        const queryParams: any = {
          per_page: pagination.per_page,
          page: pagination.page
        };

        if (params.sha) {
          queryParams.sha = params.sha;
        }
        if (params.path) {
          queryParams.path = params.path;
        }
        if (params.since) {
          queryParams.since = params.since;
        }
        if (params.until) {
          queryParams.until = params.until;
        }

        const commits = await githubClient.request<GitHubCommit[]>(
          `/repos/${params.owner}/${params.repo}/commits`,
          "GET",
          undefined,
          queryParams
        );

        if (!commits || commits.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No commits found for '${params.owner}/${params.repo}'${params.sha ? ` starting from ${params.sha}` : ''}`
            }]
          };
        }

        const outputData = { count: commits.length, offset: params.page, commits, has_more: commits.length === pagination.per_page, next_page: params.page + 1 };
        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatCommitList(commits)
          : JSON.stringify(outputData, null, 2);

        const response: { content: Array<{ type: "text"; text: string }> } = {
          content: [{ type: "text", text: textContent }]
        };

        if (params.response_format === ResponseFormat.JSON) {
          (response as any).structuredContent = outputData;
        }

        return response;
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : "An unknown error occurred"
          }]
        };
      }
    }
  );

  // Get Commit
  server.registerTool(
    "github_get_commit",
    {
      title: "Get Commit Details",
      description: `Get detailed information about a specific GitHub commit.

This tool retrieves complete information about a single commit, including message, author, committer, and changes.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - ref (string): SHA, branch name, or tag (required, max 40 characters)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete commit object with fields:
  {
    "sha": string,
    "node_id": string,
    "commit": {
      "author": {name, email, date},
      "committer": {name, email, date},
      "message": string,
      "tree": {sha, url},
      "url": string,
      "comment_count": number
    },
    "url": string,
    "html_url": string,
    "comments_url": string,
    "author": {login, id, avatar_url} | null,
    "committer": {login, id, avatar_url} | null,
    ...
  }

Examples:
  - Get commit by SHA: owner='facebook', repo='react', ref='a1b2c3d4'
  - Get latest commit on main: owner='microsoft', repo='vscode', ref='main'
  - Get tag commit: owner='owner', repo='repo', ref='v1.0.0'

Error Handling:
  - Returns "Error: Resource not found" if commit doesn't exist (404)`,
      inputSchema: GetCommitSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetCommitInput) => {
      try {
        const commit = await githubClient.request<GitHubCommit>(
          `/repos/${params.owner}/${params.repo}/commits/${params.ref}`
        );

        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatCommit(commit)
          : JSON.stringify(commit, null, 2);

        const response: { content: Array<{ type: "text"; text: string }> } = {
          content: [{ type: "text", text: textContent }]
        };

        if (params.response_format === ResponseFormat.JSON) {
          (response as any).structuredContent = commit;
        }

        return response;
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : "An unknown error occurred"
          }]
        };
      }
    }
  );
}
