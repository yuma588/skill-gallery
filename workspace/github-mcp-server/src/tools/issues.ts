/**
 * Issue Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatIssue, formatIssueList, ResponseFormat } from "../services/formatters.js";
import { GitHubIssue } from "../types.js";

// ============== List Issues ==============

const ListIssuesSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  state: z.enum(["open", "closed", "all"])
    .default("open")
    .describe("Issue state: 'open', 'closed', or 'all' (default: 'open')"),
  labels: z.string()
    .optional()
    .describe("Comma-separated label names to filter by"),
  sort: z.enum(["created", "updated", "comments"])
    .default("created")
    .describe("Sort by: 'created', 'updated', or 'comments'"),
  direction: z.enum(["asc", "desc"])
    .default("desc")
    .describe("Sort direction: 'asc' or 'desc'"),
  since: z.string()
    .optional()
    .describe("ISO 8601 timestamp (e.g., '2024-01-01T00:00:00Z')"),
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

type ListIssuesInput = z.infer<typeof ListIssuesSchema>;

// ============== Get Issue ==============

const GetIssueSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  issue_number: z.number()
    .int()
    .min(1)
    .describe("Issue number"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' or 'json'")
}).strict();

type GetIssueInput = z.infer<typeof GetIssueSchema>;

// ============== Create Issue ==============

const CreateIssueSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  title: z.string()
    .min(1, "Title is required")
    .max(256, "Title must not exceed 256 characters")
    .describe("Issue title"),
  body: z.string()
    .max(65536, "Body must not exceed 65536 characters")
    .optional()
    .describe("Issue body in Markdown format"),
  labels: z.array(z.string())
    .max(100, "Cannot add more than 100 labels")
    .optional()
    .describe("Array of label names"),
  assignees: z.array(z.string())
    .max(10, "Cannot assign to more than 10 users")
    .optional()
    .describe("Array of usernames to assign")
}).strict();

type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

// ============== Update Issue ==============

const UpdateIssueSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  issue_number: z.number()
    .int()
    .min(1)
    .describe("Issue number"),
  title: z.string()
    .min(1)
    .max(256, "Title must not exceed 256 characters")
    .optional()
    .describe("New issue title"),
  body: z.string()
    .max(65536, "Body must not exceed 65536 characters")
    .optional()
    .describe("New issue body in Markdown format"),
  state: z.enum(["open", "closed"])
    .optional()
    .describe("Set issue state: 'open' or 'closed'"),
  labels: z.array(z.string())
    .max(100, "Cannot add more than 100 labels")
    .optional()
    .describe("Array of label names"),
  assignees: z.array(z.string())
    .max(10, "Cannot assign to more than 10 users")
    .optional()
    .describe("Array of usernames to assign")
}).strict();

type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;

// ============== Register Tools ==============

export function registerIssueTools(server: McpServer): void {
  // List Issues
  server.registerTool(
    "github_list_issues",
    {
      title: "List Repository Issues",
      description: `List issues in a GitHub repository with filtering and pagination options.

This tool retrieves issues from a specific repository, supporting filtering by state, labels, and sorting by various criteria.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - state (string): Issue state - 'open', 'closed', or 'all' (default: 'open')
  - labels (string): Comma-separated label names to filter by (optional)
  - sort (string): Sort by 'created', 'updated', or 'comments' (default: 'created')
  - direction (string): 'asc' or 'desc' (default: 'desc')
  - since (string): ISO 8601 timestamp for filtering issues updated after this time (optional)
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "count": number,              // Number of issues in this response
    "offset": number,            // Current page number
    "issues": [Issue objects],
    "has_more": boolean,         // Whether more issues available
    "next_page": number          // Next page number if has_more is true
  }

Examples:
  - List open issues: owner='facebook', repo='react', state='open'
  - List recently updated issues: owner='microsoft', repo='vscode', sort='updated', per_page=10
  - List issues with specific label: owner='owner', repo='repo', labels='bug,enhancement'

Error Handling:
  - Returns "Error: Resource not found" if repository doesn't exist (404)
  - Returns "Error: Permission denied" for private repos without access (403)`,
      inputSchema: ListIssuesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListIssuesInput) => {
      try {
        const pagination = githubClient.validatePagination(params.per_page, params.page);
        const queryParams: any = {
          state: params.state,
          sort: params.sort,
          direction: params.direction,
          per_page: pagination.per_page,
          page: pagination.page
        };

        if (params.labels) {
          queryParams.labels = params.labels;
        }
        if (params.since) {
          queryParams.since = params.since;
        }

        const issues = await githubClient.request<GitHubIssue[]>(
          `/repos/${params.owner}/${params.repo}/issues`,
          "GET",
          undefined,
          queryParams
        );

        if (!issues || issues.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No ${params.state} issues found for '${params.owner}/${params.repo}'`
            }]
          };
        }

        const outputData = { count: issues.length, offset: params.page, issues, has_more: issues.length === pagination.per_page, next_page: params.page + 1 };
        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatIssueList(issues)
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

  // Get Issue
  server.registerTool(
    "github_get_issue",
    {
      title: "Get Issue Details",
      description: `Get detailed information about a specific GitHub issue.

This tool retrieves complete information about a single issue, including title, body, labels, assignees, and comments.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - issue_number (number): Issue number (required)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete issue object with fields:
  {
    "id": number,
    "number": number,
    "title": string,
    "user": {login, id, avatar_url},
    "state": "open" | "closed",
    "body": string | null,
    "labels": [{id, name, color}],
    "assignees": [{login, id, avatar_url}],
    "milestone": {id, title, state} | null,
    "comments": number,
    "created_at": string,
    "updated_at": string,
    "closed_at": string | null,
    "html_url": string,
    ...
  }

Examples:
  - Get issue details: owner='facebook', repo='react', issue_number=1234
  - Get a specific bug report: owner='owner', repo='repo', issue_number=567

Error Handling:
  - Returns "Error: Resource not found" if issue doesn't exist (404)`,
      inputSchema: GetIssueSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetIssueInput) => {
      try {
        const issue = await githubClient.request<GitHubIssue>(
          `/repos/${params.owner}/${params.repo}/issues/${params.issue_number}`
        );

        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatIssue(issue)
          : JSON.stringify(issue, null, 2);

        const response: { content: Array<{ type: "text"; text: string }> } = {
          content: [{ type: "text", text: textContent }]
        };

        if (params.response_format === ResponseFormat.JSON) {
          (response as any).structuredContent = issue;
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

  // Create Issue
  server.registerTool(
    "github_create_issue",
    {
      title: "Create New Issue",
      description: `Create a new issue in a GitHub repository.

This tool creates a new issue with the specified title and optional body, labels, and assignees.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - title (string): Issue title (required, max 256 characters)
  - body (string): Issue body in Markdown format (optional, max 65536 characters)
  - labels (array of strings): Array of label names to add (optional, max 100 labels)
  - assignees (array of strings): Array of usernames to assign (optional, max 10 users)

Returns:
  Created issue object with complete details including the new issue number.

Examples:
  - Create simple issue: owner='owner', repo='repo', title='Fix bug in login'
  - Create detailed issue: owner='owner', repo='repo', title='Add new feature', body='Description...', labels=['enhancement']

Error Handling:
  - Returns "Error: Permission denied" if you don't have write access (403)
  - Returns "Error: Validation failed" for invalid input (422)`,
      inputSchema: CreateIssueSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: CreateIssueInput) => {
      try {
        const issue = await githubClient.request<GitHubIssue>(
          `/repos/${params.owner}/${params.repo}/issues`,
          "POST",
          {
            title: params.title,
            body: params.body,
            labels: params.labels,
            assignees: params.assignees
          }
        );

        const textContent = formatIssue(issue);

        return {
          content: [{ type: "text", text: textContent }]
        };
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

  // Update Issue
  server.registerTool(
    "github_update_issue",
    {
      title: "Update Issue",
      description: `Update an existing issue in a GitHub repository.

This tool modifies an existing issue's title, body, state, labels, or assignees.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - issue_number (number): Issue number (required)
  - title (string): New issue title (optional, max 256 characters)
  - body (string): New issue body in Markdown format (optional, max 65536 characters)
  - state (string): Set issue state - 'open' or 'closed' (optional)
  - labels (array of strings): Array of label names (optional, replaces existing labels)
  - assignees (array of strings): Array of usernames to assign (optional, replaces existing assignees)

Returns:
  Updated issue object with complete details.

Examples:
  - Close an issue: owner='owner', repo='repo', issue_number=123, state='closed'
  - Update title: owner='owner', repo='repo', issue_number=123, title='New title'
  - Add labels: owner='owner', repo='repo', issue_number=123, labels=['bug', 'high-priority']

Error Handling:
  - Returns "Error: Permission denied" if you don't have write access (403)
  - Returns "Error: Resource not found" if issue doesn't exist (404)`,
      inputSchema: UpdateIssueSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: UpdateIssueInput) => {
      try {
        const issue = await githubClient.request<GitHubIssue>(
          `/repos/${params.owner}/${params.repo}/issues/${params.issue_number}`,
          "PATCH",
          {
            title: params.title,
            body: params.body,
            state: params.state,
            labels: params.labels,
            assignees: params.assignees
          }
        );

        const textContent = formatIssue(issue);

        return {
          content: [{ type: "text", text: textContent }]
        };
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
