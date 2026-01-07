# GitHub MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with GitHub's REST API.

## Features

- **Repository Management**: Search, list, and get repository details
- **Issue Tracking**: Create, read, and update issues
- **Pull Requests**: Create, list, merge, and manage PRs
- **Search**: Search code, issues, and repositories across GitHub
- **User Profiles**: Get user information and activity
- **Commits**: List and view commit history

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set your GitHub Personal Access Token:
- Generate a token at https://github.com/settings/tokens
- Required scopes: `repo` (for full functionality) or specific permissions based on your needs
- Add the token to `.env`: `GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx`

## Building

```bash
npm run build
```

## Running

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## Transport Modes

The server supports two transport modes:

### stdio (default)
For local integrations and command-line tools.

### HTTP (remote deployment)
Set `TRANSPORT=http` in `.env` to run as an HTTP server:
```bash
TRANSPORT=http npm start
```

## Tools

The server provides the following tools:

### Repositories
- `github_search_repositories` - Search repositories
- `github_list_repositories` - List user/org repositories
- `github_get_repository` - Get repository details

### Issues
- `github_list_issues` - List repository issues
- `github_get_issue` - Get issue details
- `github_create_issue` - Create a new issue
- `github_update_issue` - Update an existing issue

### Pull Requests
- `github_list_pull_requests` - List repository PRs
- `github_get_pull_request` - Get PR details
- `github_create_pull_request` - Create a new PR
- `github_merge_pull_request` - Merge a PR

### Search
- `github_search_code` - Search code across repositories
- `github_search_issues` - Search issues across repositories

### Users
- `github_get_user` - Get user profile information

### Commits
- `github_list_commits` - List repository commits
- `github_get_commit` - Get commit details

All tools support both `markdown` (default) and `json` output formats via the `response_format` parameter.

## Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Design Document

See `DESIGN.md` for complete design specifications, API details, and implementation notes.

## License

MIT
