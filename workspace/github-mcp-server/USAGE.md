# GitHub MCP Server - Quick Usage Guide

## 🎯 Available Tools (16 Total)

### Repositories (3 tools)
- `github_search_repositories` - Search for repositories
- `github_list_repositories` - List user/org repositories
- `github_get_repository` - Get repository details

### Issues (4 tools)
- `github_list_issues` - List repository issues
- `github_get_issue` - Get issue details
- `github_create_issue` - Create a new issue
- `github_update_issue` - Update an existing issue

### Pull Requests (4 tools)
- `github_list_pull_requests` - List repository PRs
- `github_get_pull_request` - Get PR details
- `github_create_pull_request` - Create a new PR
- `github_merge_pull_request` - Merge a PR

### Search (2 tools)
- `github_search_code` - Search code across all repositories
- `github_search_issues` - Search issues across all repositories

### Users (1 tool)
- `github_get_user` - Get user profile

### Commits (2 tools)
- `github_list_commits` - List repository commits
- `github_get_commit` - Get commit details

## 📝 Usage Examples

### Example 1: Search Popular React Repositories
```
Tool: github_search_repositories
Params: {
  query: "stars:>10000 language:react",
  per_page: 10,
  response_format: "markdown"
}
```

### Example 2: List Issues in a Repository
```
Tool: github_list_issues
Params: {
  owner: "facebook",
  repo: "react",
  state: "open",
  per_page: 20,
  response_format: "markdown"
}
```

### Example 3: Create a New Issue
```
Tool: github_create_issue
Params: {
  owner: "owner",
  repo: "repo",
  title: "Fix authentication bug",
  body: "Users cannot login after timeout...",
  labels: ["bug", "high-priority"],
  assignees: ["developer"]
}
```

### Example 4: List Pull Requests
```
Tool: github_list_pull_requests
Params: {
  owner: "microsoft",
  repo: "vscode",
  state: "open",
  base: "main",
  per_page: 10,
  response_format: "markdown"
}
```

### Example 5: Search Code
```
Tool: github_search_code
Params: {
  query: "language:typescript useEffect",
  per_page: 20,
  response_format: "markdown"
}
```

### Example 6: Get User Profile
```
Tool: github_get_user
Params: {
  username: "torvalds",
  response_format: "markdown"
}
```

### Example 7: List Commits
```
Tool: github_list_commits
Params: {
  owner: "facebook",
  repo: "react",
  sha: "main",
  per_page: 20,
  response_format: "markdown"
}
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd github-mcp-server
npm install
```

### 2. Build Project
```bash
npm run build
```

### 3. Configure GitHub Token
Create a `.env` file:
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Get your token from: https://github.com/settings/tokens

### 4. Start Server
```bash
# stdio mode (for MCP clients)
npm start

# HTTP mode (for web access)
TRANSPORT=http PORT=3000 npm start
```

### 5. Test with Inspector
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## 🎨 Response Format Options

All tools support two output formats:

### Markdown (default)
- Human-readable formatted text
- Headers, lists, and formatting
- Good for reading by humans
- Example: `response_format: "markdown"`

### JSON
- Machine-readable structured data
- Complete data objects
- Good for programmatic processing
- Example: `response_format: "json"`

## ⚠️ Common Errors and Solutions

### 401 - Invalid Token
**Error**: "Error: Invalid GitHub token"
**Solution**: Check `GITHUB_TOKEN` in `.env` file, ensure it's valid and not expired.

### 403 - Permission Denied
**Error**: "Error: Permission denied"
**Solution**: Your token lacks required permissions. Ensure token has `repo` scope.

### 404 - Not Found
**Error**: "Error: Resource not found"
**Solution**: Check owner, repository name, or issue/PR number for typos.

### 422 - Validation Error
**Error**: "Error: Validation failed"
**Solution**: Check input parameters - field lengths, enum values, etc.

### 429 - Rate Limit
**Error**: "Error: Rate limit exceeded"
**Solution**: Wait for the reset time shown in the error message. Authenticated requests get 5000/hour.

## 📊 Rate Limits

| Authentication Type | Limit |
|-------------------|--------|
| Authenticated      | 5,000 requests/hour |
| Unauthenticated    | 60 requests/hour |
| Search API        | 30 requests/minute |

## 🎓 Best Practices

1. **Use Authentication**: Always use a GitHub token for higher rate limits
2. **Filter Results**: Use `per_page` parameter to limit response size
3. **Use Qualifiers**: In search queries, use qualifiers like `language:`, `stars:`, etc.
4. **Handle Pagination**: Check `has_more` field to determine if more results available
5. **Cache Responses**: Cache read-only responses to reduce API calls
6. **Use JSON Format**: For programmatic processing, use `response_format: "json"`

## 🔍 GitHub Search Qualifiers

### Repository Search
- `stars:>1000` - Repos with 1000+ stars
- `language:typescript` - TypeScript repositories
- `user:facebook` - Repos by Facebook
- `fork:true` - Only forked repos
- `is:public` - Only public repos

### Issue Search
- `is:open` - Only open issues
- `is:pr` - Only pull requests
- `label:bug` - Issues with bug label
- `author:username` - Issues by specific author
- `created:>2024-01-01` - Issues created after date

### Code Search
- `language:python` - Python code only
- `filename:package.json` - Only package.json files
- `repo:facebook/react` - Search in specific repo
- `org:microsoft` - Search in Microsoft org repos

---

**Ready to use! Start the server and connect with your MCP client.**
