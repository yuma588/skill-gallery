/**
 * Response Formatters for Markdown and JSON outputs
 */
import { ResponseFormat } from "../constants.js";
export { ResponseFormat };
import { GitHubRepository, GitHubIssue, GitHubPullRequest, GitHubUser, GitHubCommit, GitHubSearchResult } from "../types.js";
export declare function formatRepository(repo: GitHubRepository): string;
export declare function formatRepositoryList(repos: GitHubRepository[], total?: number): string;
export declare function formatIssue(issue: GitHubIssue): string;
export declare function formatIssueList(issues: GitHubIssue[], total?: number): string;
export declare function formatPullRequest(pr: GitHubPullRequest): string;
export declare function formatPullRequestList(prs: GitHubPullRequest[], total?: number): string;
export declare function formatUser(user: GitHubUser): string;
export declare function formatCommit(commit: GitHubCommit): string;
export declare function formatCommitList(commits: GitHubCommit[]): string;
export declare function formatSearchResults<T>(result: GitHubSearchResult<T>, formatter: (item: T) => string): string;
export declare function formatResponse<T>(data: T, format: ResponseFormat, markdownFormatter: (data: T) => string): {
    text: string;
    structured?: T;
};
//# sourceMappingURL=formatters.d.ts.map