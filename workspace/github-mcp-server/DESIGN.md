# GitHub MCP Server Design

## Phase 1: Deep Research and Planning

### 1.1 GitHub API Overview

**Base URL**: `https://api.github.com`
**API Version**: `2022-11-28`
**Accept Header**: `application/vnd.github+json`

#### Authentication Methods
1. **Personal Access Token (PAT)** - Recommended for MCP server
   - Fine-grained PATs (preferred): More precise permission control
   - Classic PATs: Scope-based permissions

#### Rate Limits
- **Authenticated**: 5,000 requests/hour
- **Unauthenticated**: 60 requests/hour
- Search API: 30 requests/minute

### 1.2 Tool Selection Strategy

According to the MCP best practices, we prioritize **comprehensive API coverage** with workflow-focused tools. The GitHub MCP server will cover:

#### Core Domains
1. **Repositories** - Most fundamental operations
2. **Issues** - Issue tracking and management
3. **Pull Requests** - Code review and merging
4. **Search** - Finding code, repos, issues, users
5. **Users** - User profile and activity
6. **Commits** - Git commit operations

#### Tool Naming Convention
Following `{service}_{action}_{resource}` pattern:
- `github_search_repositories`
- `github_list_repositories`
- `github_get_repository`
- `github_create_issue`
- `github_list_issues`
- `github_get_issue`
- `github_update_issue`
- `github_create_pull_request`
- `github_list_pull_requests`
- `github_get_pull_request`
- `github_merge_pull_request`
- `github_search_code`
- `github_search_issues`
- `github_get_user`
- `github_list_commits`
- `github_get_commit`

### 1.3 Technology Stack

Based on the TypeScript implementation guide:
- **Language**: TypeScript (recommended)
- **SDK**: `@modelcontextprotocol/sdk` v1.x (stable)
- **Transport**: Streamable HTTP (for remote deployment) with stdio fallback
- **Validation**: Zod for runtime input validation
- **HTTP Client**: axios with 30s timeout

### 1.4 Project Structure

```
github-mcp-server/
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
├── src/
│   ├── index.ts              # Main entry point
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # API_URL, CHARACTER_LIMIT
│   ├── tools/
│   │   ├── repositories.ts   # Repository tools
│   │   ├── issues.ts         # Issue tools
│   │   ├── pullRequests.ts   # PR tools
│   │   ├── search.ts         # Search tools
│   │   ├── users.ts          # User tools
│   │   └── commits.ts        # Commit tools
│   └── services/
│       ├── githubClient.ts   # Shared API client
│       └── errorHandler.ts    # Error handling
└── dist/                     # Compiled JavaScript
```

---

## Phase 2: Implementation Plan

### 2.1 Core Infrastructure

#### Constants
```typescript
const API_BASE_URL = "https://api.github.com";
const API_VERSION = "2022-11-28";
const CHARACTER_LIMIT = 25000;
const DEFAULT_PER_PAGE = 30;
const MAX_PER_PAGE = 100;
```

#### Shared Utilities

1. **GitHub API Client**
   - Centralized axios instance
   - Automatic header injection (Authorization, Accept, X-GitHub-Api-Version)
   - Response timeout handling (30s)
   - Rate limit detection from response headers

2. **Error Handler**
   - 401: Invalid authentication
   - 403: Permission denied
   - 404: Resource not found
   - 422: Validation error
   - 429: Rate limit exceeded (include reset time)
   - 500+: Server error

3. **Pagination Support**
   - Handle Link header
   - Support `per_page` and `page` parameters
   - Return `has_more`, `next_page`, `total_count` in responses

4. **Response Formatter**
   - Support both `markdown` and `json` formats via `response_format` parameter
   - Markdown: Human-readable with headers, lists, timestamps formatted
   - JSON: Complete structured data for programmatic processing

### 2.2 Tool Specifications

#### Repository Tools

**1. github_search_repositories**
- **Description**: Search for GitHub repositories by name, description, topics, and more
- **Input Schema**:
  - `query` (string, required): Search query with qualifiers (e.g., "stars:>1000 language:typescript")
  - `sort` (string, optional): Sort by 'stars', 'forks', 'help-wanted-issues', 'updated' (default: 'best-match')
  - `order` (string, optional): 'asc' or 'desc' (default: 'desc')
  - `per_page` (number, default: 30): 1-100
  - `page` (number, default: 1): Page number
  - `response_format` (enum: 'markdown'|'json', default: 'markdown'): Output format
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`
- **Returns**: Search results with repository details

**2. github_list_repositories**
- **Description**: List repositories for a user or organization
- **Input Schema**:
  - `owner` (string, required): Username or organization name
  - `type` (string, optional): 'all', 'public', 'private', 'forks', 'sources', 'member' (default: 'all')
  - `sort` (string, optional): 'created', 'updated', 'pushed', 'full_name' (default: 'created')
  - `direction` (string, optional): 'asc' or 'desc' (default: 'desc')
  - `per_page` (number, default: 30): 1-100
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

**3. github_get_repository**
- **Description**: Get detailed information about a single repository
- **Input Schema**:
  - `owner` (string, required): Repository owner
  - `repo` (string, required): Repository name
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `idempotentHint: true`

#### Issue Tools

**4. github_list_issues**
- **Description**: List issues in a repository
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `state` (string, optional): 'open', 'closed', 'all' (default: 'open')
  - `labels` (string, optional): Comma-separated label names
  - `sort` (string, optional): 'created', 'updated', 'comments' (default: 'created')
  - `direction` (string, optional): 'asc' or 'desc' (default: 'desc')
  - `since` (string, optional): ISO 8601 timestamp
  - `per_page` (number, default: 30)
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

**5. github_get_issue**
- **Description**: Get detailed information about a single issue
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `issue_number` (number, required): Issue number
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `idempotentHint: true`

**6. github_create_issue**
- **Description**: Create a new issue in a repository
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `title` (string, required): Issue title
  - `body` (string, optional): Issue body in Markdown
  - `labels` (array of strings, optional): Label names
  - `assignees` (array of strings, optional): Usernames to assign
- **Annotations**: `destructiveHint: true`, `openWorldHint: true`
- **Returns**: Created issue details

**7. github_update_issue**
- **Description**: Update an existing issue
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `issue_number` (number, required)
  - `title` (string, optional)
  - `body` (string, optional)
  - `state` (string, optional): 'open' or 'closed'
  - `labels` (array of strings, optional)
  - `assignees` (array of strings, optional)
- **Annotations**: `destructiveHint: true`, `openWorldHint: true`

#### Pull Request Tools

**8. github_list_pull_requests**
- **Description**: List pull requests in a repository
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `state` (string, optional): 'open', 'closed', 'all' (default: 'open')
  - `head` (string, optional): Filter by head branch
  - `base` (string, optional): Filter by base branch
  - `sort` (string, optional): 'created', 'updated', 'popularity', 'long-running'
  - `direction` (string, optional): 'asc' or 'desc'
  - `per_page` (number, default: 30)
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

**9. github_get_pull_request**
- **Description**: Get detailed information about a pull request
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `pull_number` (number, required): PR number
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `idempotentHint: true`

**10. github_create_pull_request**
- **Description**: Create a new pull request
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `title` (string, required): PR title
  - `head` (string, required): Branch name with changes
  - `base` (string, required): Branch to merge into
  - `body` (string, optional): PR description in Markdown
  - `draft` (boolean, optional): Create as draft (default: false)
- **Annotations**: `destructiveHint: true`, `openWorldHint: true`

**11. github_merge_pull_request**
- **Description**: Merge a pull request
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `pull_number` (number, required)
  - `commit_title` (string, optional): Merge commit title
  - `commit_message` (string, optional): Merge commit message
  - `merge_method` (string, optional): 'merge', 'squash', 'rebase' (default: 'merge')
- **Annotations**: `destructiveHint: true`, `idempotentHint: false`

#### Search Tools

**12. github_search_code**
- **Description**: Search for code across all repositories
- **Input Schema**:
  - `query` (string, required): Search query with qualifiers
  - `sort` (string, optional): 'indexed' (default: 'best-match')
  - `order` (string, optional): 'asc' or 'desc'
  - `per_page` (number, default: 30)
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

**13. github_search_issues**
- **Description**: Search for issues across all repositories
- **Input Schema**:
  - `query` (string, required): Search query
  - `sort` (string, optional): 'comments', 'created', 'updated' (default: 'best-match')
  - `order` (string, optional): 'asc' or 'desc'
  - `per_page` (number, default: 30)
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

#### User Tools

**14. github_get_user**
- **Description**: Get a user's profile information
- **Input Schema**:
  - `username` (string, required): GitHub username
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `idempotentHint: true`

#### Commit Tools

**15. github_list_commits**
- **Description**: List commits in a repository
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `sha` (string, optional): Branch name or SHA
  - `path` (string, optional): Only commits for this path
  - `since` (string, optional): ISO 8601 timestamp
  - `until` (string, optional): ISO 8601 timestamp
  - `per_page` (number, default: 30)
  - `page` (number, default: 1)
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `openWorldHint: true`

**16. github_get_commit**
- **Description**: Get a single commit
- **Input Schema**:
  - `owner` (string, required)
  - `repo` (string, required)
  - `ref` (string, required): SHA, branch name, or tag
  - `response_format` (enum, default: 'markdown')
- **Annotations**: `readOnlyHint: true`, `idempotentHint: true`

---

## Phase 3: Quality Checklist

### 3.1 Strategic Design
- [x] Tools enable complete workflows (search → list → get → create/update)
- [x] Tool names follow `{service}_{action}_{resource}` pattern
- [x] Response formats support both markdown and json
- [x] Error messages guide agents toward solutions
- [x] Comprehensive API coverage across 6 domains

### 3.2 Implementation Requirements
- [ ] All tools registered using `server.registerTool`
- [ ] All tools include `title`, `description`, `inputSchema`, `annotations`
- [ ] All tools use Zod schemas with `.strict()` enforcement
- [ ] Proper constraints and validation for all inputs
- [ ] Comprehensive descriptions with examples
- [ ] Actionable error messages for all error cases

### 3.3 TypeScript Requirements
- [ ] Strict TypeScript enabled in tsconfig.json
- [ ] No use of `any` type
- [ ] Proper interfaces for all data structures
- [ ] Zod schemas for runtime validation
- [ ] Proper error type guards

### 3.4 Code Quality
- [ ] Pagination properly implemented
- [ ] CHARACTER_LIMIT checked and enforced
- [ ] Filtering options for large result sets
- [ ] Timeout handling (30s)
- [ ] Shared utilities for API client and error handling
- [ ] No code duplication

### 3.5 Testing
- [ ] `npm run build` succeeds
- [ ] dist/index.js executable
- [ ] Server runs successfully
- [ ] Sample tool calls work

---

## Phase 4: Next Steps

1. **Set up project structure** (package.json, tsconfig.json)
2. **Implement core infrastructure** (API client, error handler, formatters)
3. **Implement tools domain by domain**
   - Start with repositories (most fundamental)
   - Then issues and pull requests
   - Then search functionality
   - Finally users and commits
4. **Build and test** with MCP Inspector
5. **Create evaluations** following the evaluation guide

---

## Environment Variables

Required environment variable:
- `GITHUB_TOKEN`: GitHub Personal Access Token with appropriate permissions

Optional:
- `TRANSPORT`: 'stdio' (default) or 'http'
- `PORT`: Port for HTTP server (default: 3000)
