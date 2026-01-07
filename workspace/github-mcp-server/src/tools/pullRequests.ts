/**
 * Pull Request Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { githubClient } from "../services/githubClient.js";
import { formatPullRequest, formatPullRequestList, ResponseFormat } from "../services/formatters.js";
import { GitHubPullRequest } from "../types.js";

// ============== List Pull Requests ==============

const ListPullRequestsSchema = z.object({
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
    .describe("PR state: 'open', 'closed', or 'all' (default: 'open')"),
  head: z.string()
    .optional()
    .describe("Filter by head branch name"),
  base: z.string()
    .optional()
    .describe("Filter by base branch name"),
  sort: z.enum(["created", "updated", "popularity", "long-running"])
    .default("created")
    .describe("Sort by: 'created', 'updated', 'popularity', or 'long-running'"),
  direction: z.enum(["asc", "desc"])
    .default("desc")
    .describe("Sort direction: 'asc' or 'desc'"),
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

type ListPullRequestsInput = z.infer<typeof ListPullRequestsSchema>;

// ============== Get Pull Request ==============

const GetPullRequestSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  pull_number: z.number()
    .int()
    .min(1)
    .describe("Pull request number"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' or 'json'")
}).strict();

type GetPullRequestInput = z.infer<typeof GetPullRequestSchema>;

// ============== Create Pull Request ==============

const CreatePullRequestSchema = z.object({
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
    .describe("PR title"),
  head: z.string()
    .min(1, "Head branch is required")
    .max(256, "Head branch must not exceed 256 characters")
    .describe("Branch name with changes"),
  base: z.string()
    .min(1, "Base branch is required")
    .max(256, "Base branch must not exceed 256 characters")
    .describe("Branch to merge into"),
  body: z.string()
    .max(65536, "Body must not exceed 65536 characters")
    .optional()
    .describe("PR description in Markdown format"),
  draft: z.boolean()
    .default(false)
    .describe("Create as draft PR (default: false)")
}).strict();

type CreatePullRequestInput = z.infer<typeof CreatePullRequestSchema>;

// ============== Merge Pull Request ==============

const MergePullRequestSchema = z.object({
  owner: z.string()
    .min(1, "Owner is required")
    .max(39, "Owner must not exceed 39 characters")
    .describe("Repository owner"),
  repo: z.string()
    .min(1, "Repository name is required")
    .max(100, "Repository name must not exceed 100 characters")
    .describe("Repository name"),
  pull_number: z.number()
    .int()
    .min(1)
    .describe("Pull request number"),
  commit_title: z.string()
    .max(256, "Commit title must not exceed 256 characters")
    .optional()
    .describe("Title for the merge commit"),
  commit_message: z.string()
    .max(65536, "Commit message must not exceed 65536 characters")
    .optional()
    .describe("Message for the merge commit"),
  merge_method: z.enum(["merge", "squash", "rebase"])
    .default("merge")
    .describe("Merge method: 'merge', 'squash', or 'rebase' (default: 'merge')")
}).strict();

type MergePullRequestInput = z.infer<typeof MergePullRequestSchema>;

// ============== Register Tools ==============

export function registerPullRequestTools(server: McpServer): void {
  // List Pull Requests
  server.registerTool(
    "github_list_pull_requests",
    {
      title: "List Repository Pull Requests",
      description: `List pull requests in a GitHub repository with filtering and pagination options.

This tool retrieves PRs from a specific repository, supporting filtering by state, branch, and sorting by various criteria.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - state (string): PR state - 'open', 'closed', or 'all' (default: 'open')
  - head (string): Filter by head branch name (optional)
  - base (string): Filter by base branch name (optional)
  - sort (string): Sort by 'created', 'updated', 'popularity', or 'long-running' (default: 'created')
  - direction (string): 'asc' or 'desc' (default: 'desc')
  - per_page (number): Results per page, 1-100 (default: 30)
  - page (number): Page number (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "count": number,              // Number of PRs in this response
    "offset": number,            // Current page number
    "pull_requests": [PR objects],
    "has_more": boolean,         // Whether more PRs available
    "next_page": number          // Next page number if has_more is true
  }

Examples:
  - List open PRs: owner='facebook', repo='react', state='open'
  - List PRs targeting main branch: owner='microsoft', repo='vscode', base='main'
  - List recently updated PRs: owner='owner', repo='repo', sort='updated', per_page=10

Error Handling:
  - Returns "Error: Resource not found" if repository doesn't exist (404)
  - Returns "Error: Permission denied" for private repos without access (403)`,
      inputSchema: ListPullRequestsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListPullRequestsInput) => {
      try {
        const pagination = githubClient.validatePagination(params.per_page, params.page);
        const queryParams: any = {
          state: params.state,
          sort: params.sort,
          direction: params.direction,
          per_page: pagination.per_page,
          page: pagination.page
        };

        if (params.head) {
          queryParams.head = params.head;
        }
        if (params.base) {
          queryParams.base = params.base;
        }

        const prs = await githubClient.request<GitHubPullRequest[]>(
          `/repos/${params.owner}/${params.repo}/pulls`,
          "GET",
          undefined,
          queryParams
        );

        if (!prs || prs.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No ${params.state} pull requests found for '${params.owner}/${params.repo}'`
            }]
          };
        }

        const outputData = { count: prs.length, offset: params.page, pull_requests: prs, has_more: prs.length === pagination.per_page, next_page: params.page + 1 };
        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatPullRequestList(prs)
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

  // Get Pull Request
  server.registerTool(
    "github_get_pull_request",
    {
      title: "Get Pull Request Details",
      description: `Get detailed information about a specific GitHub pull request.

This tool retrieves complete information about a single PR, including status, mergeability, and commit counts.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - pull_number (number): Pull request number (required)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete PR object with fields:
  {
    "id": number,
    "number": number,
    "state": "open" | "closed",
    "title": string,
    "user": {login, id, avatar_url},
    "body": string | null,
    "mergeable": boolean | null,
    "draft": boolean,
    "head": {label, ref, sha, repo},
    "base": {label, ref, sha, repo},
    "commits": number,
    "additions": number,
    "deletions": number,
    "changed_files": number,
    "created_at": string,
    "updated_at": string,
    "merged_at": string | null,
    "html_url": string,
    ...
  }

Examples:
  - Get PR details: owner='facebook', repo='react', pull_number=1234
  - Get PR for review: owner='owner', repo='repo', pull_number=567

Error Handling:
  - Returns "Error: Resource not found" if PR doesn't exist (404)`,
      inputSchema: GetPullRequestSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetPullRequestInput) => {
      try {
        const pr = await githubClient.request<GitHubPullRequest>(
          `/repos/${params.owner}/${params.repo}/pulls/${params.pull_number}`
        );

        const textContent = params.response_format === ResponseFormat.MARKDOWN
          ? formatPullRequest(pr)
          : JSON.stringify(pr, null, 2);

        const response: { content: Array<{ type: "text"; text: string }> } = {
          content: [{ type: "text", text: textContent }]
        };

        if (params.response_format === ResponseFormat.JSON) {
          (response as any).structuredContent = pr;
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

  // Create Pull Request
  server.registerTool(
    "github_create_pull_request",
    {
      title: "Create New Pull Request",
      description: `Create a new pull request in a GitHub repository.

This tool creates a new PR from a head branch to a base branch with the specified title and optional description.

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - title (string): PR title (required, max 256 characters)
  - head (string): Branch name with changes (required)
  - base (string): Branch to merge into (required)
  - body (string): PR description in Markdown format (optional, max 65536 characters)
  - draft (boolean): Create as draft PR (default: false)

Returns:
  Created PR object with complete details including the new PR number and URL.

Examples:
  - Create simple PR: owner='owner', repo='repo', title='Fix bug', head='feature-branch', base='main'
  - Create draft PR: owner='owner', repo='repo', title='WIP feature', head='wip-branch', base='main', draft=true
  - Create detailed PR: owner='owner', repo='repo', title='Add new feature', head='feature', base='main', body='Description...'

Error Handling:
  - Returns "Error: Permission denied" if you don't have write access (403)
  - Returns "Error: Validation failed" for invalid branches or input (422)`,
      inputSchema: CreatePullRequestSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: CreatePullRequestInput) => {
      try {
        const pr = await githubClient.request<GitHubPullRequest>(
          `/repos/${params.owner}/${params.repo}/pulls`,
          "POST",
          {
            title: params.title,
            head: params.head,
            base: params.base,
            body: params.body,
            draft: params.draft
          }
        );

        const textContent = formatPullRequest(pr);

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

  // Merge Pull Request
  server.registerTool(
    "github_merge_pull_request",
    {
      title: "Merge Pull Request",
      description: `Merge a pull request in a GitHub repository.

This tool merges an existing PR using the specified merge method (merge, squash, or rebase).

Args:
  - owner (string): Repository owner's username or organization (required)
  - repo (string): Repository name (required)
  - pull_number (number): Pull request number (required)
  - commit_title (string): Title for the merge commit (optional, max 256 characters)
  - commit_message (string): Message for the merge commit (optional, max 65536 characters)
  - merge_method (string): Merge method - 'merge', 'squash', or 'rebase' (default: 'merge')

Returns:
  Success message with merge details including SHA and merged status.

Examples:
  - Merge with default method: owner='owner', repo='repo', pull_number=123
  - Squash merge: owner='owner', repo='repo', pull_number=123, merge_method='squash'
  - Rebase with custom message: owner='owner', repo='repo', pull_number=123, merge_method='rebase', commit_message='Rebase PR #123'

Error Handling:
  - Returns "Error: Permission denied" if you don't have write access (403)
  - Returns "Error: PR is not mergeable" if the PR has conflicts (405)
  - Returns "Error: Resource not found" if PR doesn't exist (404)`,
      inputSchema: MergePullRequestSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: MergePullRequestInput) => {
      try {
        const result = await githubClient.request<any>(
          `/repos/${params.owner}/${params.repo}/pulls/${params.pull_number}/merge`,
          "PUT",
          {
            commit_title: params.commit_title,
            commit_message: params.commit_message,
            merge_method: params.merge_method
          }
        );

        const pr = await githubClient.request<GitHubPullRequest>(
          `/repos/${params.owner}/${params.repo}/pulls/${params.pull_number}`
        );

        const textContent = `✅ Pull request #${params.pull_number} merged successfully!\n\n` + formatPullRequest(pr);

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
