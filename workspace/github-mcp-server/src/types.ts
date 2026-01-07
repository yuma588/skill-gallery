/**
 * GitHub API Type Definitions
 */

// Base repository type
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
  };
  description: string | null;
  private: boolean;
  fork: boolean;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  license: {
    key: string;
    name: string;
    url: string | null;
  } | null;
  parent?: GitHubRepository;
  source?: GitHubRepository;
}

// Issue type
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  state: "open" | "closed";
  locked: boolean;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  body: string | null;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    id: number;
    avatar_url: string;
  }>;
  milestone: {
    id: number;
    title: string;
    state: string;
  } | null;
  pull_request?: {
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
  html_url: string;
}

// Pull Request type
export interface GitHubPullRequest {
  id: number;
  number: number;
  state: "open" | "closed";
  title: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  mergeable: boolean | null;
  draft: boolean;
  head: {
    label: string;
    ref: string;
    sha: string;
    repo: {
      name: string;
      full_name: string;
    };
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    repo: {
      name: string;
      full_name: string;
    };
  };
  html_url: string;
  diff_url: string;
  patch_url: string;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

// User type
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: "User" | "Organization";
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// Commit type
export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
}

// Search result types
export interface GitHubSearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

// Rate limit info
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}
