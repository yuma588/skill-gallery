/**
 * Response Formatters for Markdown and JSON outputs
 */
import { ResponseFormat } from "../constants.js";
export { ResponseFormat };
// Format date to human-readable string
function formatDate(isoDate) {
    if (!isoDate)
        return "N/A";
    return new Date(isoDate).toLocaleString();
}
// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}
// ============== Repository Formatters ==============
export function formatRepository(repo) {
    const lines = [
        `# ${repo.full_name}`,
        "",
        `**Description**: ${repo.description || "No description"}`,
        `**Owner**: ${repo.owner.login}`,
        `**Language**: ${repo.language || "N/A"}`,
        `**Stars**: ${formatNumber(repo.stargazers_count)} ⭐`,
        `**Forks**: ${formatNumber(repo.forks_count)} 🍴`,
        `**Open Issues**: ${repo.open_issues_count}`,
        `**Created**: ${formatDate(repo.created_at)}`,
        `**Updated**: ${formatDate(repo.updated_at)}`,
        "",
        `**URL**: ${repo.html_url}`,
        "",
        `**Topics**: ${repo.topics.length > 0 ? repo.topics.join(", ") : "None"}`,
        ""
    ];
    if (repo.license) {
        lines.push(`**License**: ${repo.license.name}`);
        lines.push("");
    }
    return lines.join("\n");
}
export function formatRepositoryList(repos, total) {
    const lines = [
        `# Repositories${total ? ` (${total} total)` : ""}`,
        ""
    ];
    for (const repo of repos) {
        lines.push(`## ${repo.full_name}`);
        lines.push(`- **Description**: ${repo.description || "No description"}`);
        lines.push(`- **Language**: ${repo.language || "N/A"}`);
        lines.push(`- **Stars**: ${formatNumber(repo.stargazers_count)} ⭐`);
        lines.push(`- **Forks**: ${formatNumber(repo.forks_count)} 🍴`);
        lines.push(`- **Updated**: ${formatDate(repo.updated_at)}`);
        lines.push(`- **URL**: ${repo.html_url}`);
        lines.push("");
    }
    return lines.join("\n");
}
// ============== Issue Formatters ==============
export function formatIssue(issue) {
    const isPR = !!issue.pull_request;
    const lines = [
        `# ${isPR ? "Pull Request" : "Issue"} #${issue.number}: ${issue.title}`,
        "",
        `**State**: ${issue.state === "open" ? "🟢 Open" : "✅ Closed"}`,
        `**Author**: ${issue.user.login}`,
        `**Created**: ${formatDate(issue.created_at)}`,
        `**Updated**: ${formatDate(issue.updated_at)}`,
        issue.closed_at ? `**Closed**: ${formatDate(issue.closed_at)}` : "",
        `**Comments**: ${issue.comments}`,
        "",
    ];
    if (issue.labels.length > 0) {
        lines.push(`**Labels**: ${issue.labels.map(l => l.name).join(", ")}`);
        lines.push("");
    }
    if (issue.assignees.length > 0) {
        lines.push(`**Assignees**: ${issue.assignees.map(a => a.login).join(", ")}`);
        lines.push("");
    }
    if (issue.milestone) {
        lines.push(`**Milestone**: ${issue.milestone.title}`);
        lines.push("");
    }
    lines.push(`**URL**: ${issue.html_url}`);
    lines.push("");
    if (issue.body) {
        lines.push("---");
        lines.push("");
        lines.push(issue.body);
        lines.push("");
    }
    return lines.filter(Boolean).join("\n");
}
export function formatIssueList(issues, total) {
    const lines = [
        `# Issues${total ? ` (${total} total)` : ""}`,
        ""
    ];
    for (const issue of issues) {
        const isPR = !!issue.pull_request;
        const icon = isPR ? "🔀" : "📝";
        const state = issue.state === "open" ? "🟢" : "✅";
        lines.push(`## ${icon} ${state} #${issue.number}: ${issue.title}`);
        lines.push(`- **Type**: ${isPR ? "Pull Request" : "Issue"}`);
        lines.push(`- **Author**: ${issue.user.login}`);
        lines.push(`- **State**: ${issue.state}`);
        lines.push(`- **Created**: ${formatDate(issue.created_at)}`);
        lines.push(`- **Comments**: ${issue.comments}`);
        if (issue.labels.length > 0) {
            lines.push(`- **Labels**: ${issue.labels.map(l => l.name).join(", ")}`);
        }
        if (issue.assignees.length > 0) {
            lines.push(`- **Assignees**: ${issue.assignees.map(a => a.login).join(", ")}`);
        }
        lines.push(`- **URL**: ${issue.html_url}`);
        lines.push("");
    }
    return lines.join("\n");
}
// ============== Pull Request Formatters ==============
export function formatPullRequest(pr) {
    const lines = [
        `# Pull Request #${pr.number}: ${pr.title}`,
        "",
        `**State**: ${pr.state === "open" ? "🟢 Open" : "✅ Closed"}`,
        pr.draft ? "**Draft** 📝" : "",
        `**Author**: ${pr.user.login}`,
        `**Branch**: ${pr.head.ref} → ${pr.base.ref}`,
        `**Created**: ${formatDate(pr.created_at)}`,
        `**Updated**: ${formatDate(pr.updated_at)}`,
        pr.merged_at ? `**Merged**: ${formatDate(pr.merged_at)} ✅` : "",
        pr.closed_at && !pr.merged_at ? `**Closed**: ${formatDate(pr.closed_at)} ❌` : "",
        "",
        `**Mergeable**: ${pr.mergeable === true ? "Yes ✅" : pr.mergeable === false ? "No ❌" : "Checking..."}`,
        `**Commits**: ${pr.commits}`,
        `**Additions**: ${pr.additions} +`,
        `**Deletions**: ${pr.deletions} -`,
        `**Changed Files**: ${pr.changed_files}`,
        `**Review Comments**: ${pr.review_comments}`,
        "",
        `**URL**: ${pr.html_url}`,
        "",
    ];
    if (pr.body) {
        lines.push("---");
        lines.push("");
        lines.push(pr.body);
        lines.push("");
    }
    return lines.filter(Boolean).join("\n");
}
export function formatPullRequestList(prs, total) {
    const lines = [
        `# Pull Requests${total ? ` (${total} total)` : ""}`,
        ""
    ];
    for (const pr of prs) {
        const state = pr.state === "open" ? "🟢" : "✅";
        const draft = pr.draft ? "📝 Draft" : "";
        lines.push(`## ${state} ${draft ? draft + " " : ""}#${pr.number}: ${pr.title}`);
        lines.push(`- **Author**: ${pr.user.login}`);
        lines.push(`- **Branch**: ${pr.head.ref} → ${pr.base.ref}`);
        lines.push(`- **State**: ${pr.state}`);
        lines.push(`- **Commits**: ${pr.commits}`);
        lines.push(`- **Additions**: ${pr.additions} +, **Deletions**: ${pr.deletions} -`);
        lines.push(`- **Created**: ${formatDate(pr.created_at)}`);
        lines.push(`- **URL**: ${pr.html_url}`);
        lines.push("");
    }
    return lines.join("\n");
}
// ============== User Formatters ==============
export function formatUser(user) {
    const lines = [
        `# ${user.login} (${user.name || "No name"})`,
        "",
        `**Type**: ${user.type}`,
        user.bio ? `**Bio**: ${user.bio}` : "",
        user.company ? `**Company**: ${user.company}` : "",
        user.location ? `**Location**: ${user.location}` : "",
        user.email ? `**Email**: ${user.email}` : "",
        user.blog ? `**Blog**: ${user.blog}` : "",
        "",
        `**Followers**: ${formatNumber(user.followers)}`,
        `**Following**: ${formatNumber(user.following)}`,
        `**Public Repos**: ${user.public_repos}`,
        `**Public Gists**: ${user.public_gists}`,
        "",
        `**Created**: ${formatDate(user.created_at)}`,
        `**Updated**: ${formatDate(user.updated_at)}`,
        "",
        `**Profile**: ${user.html_url}`,
        ""
    ];
    return lines.filter(Boolean).join("\n");
}
// ============== Commit Formatters ==============
export function formatCommit(commit) {
    const lines = [
        `# Commit ${commit.sha.substring(0, 7)}`,
        "",
        `**Message**: ${commit.commit.message}`,
        "",
        `**Author**: ${commit.author?.login || commit.commit.author.name} (${commit.commit.author.email})`,
        `**Date**: ${formatDate(commit.commit.author.date)}`,
        `**Committer**: ${commit.committer?.login || commit.commit.committer.name} (${commit.commit.committer.email})`,
        "",
        `**URL**: ${commit.html_url}`,
        ""
    ];
    return lines.join("\n");
}
export function formatCommitList(commits) {
    const lines = [
        `# Commits`,
        ""
    ];
    for (const commit of commits) {
        lines.push(`## ${commit.sha.substring(0, 7)} - ${commit.commit.message.split("\n")[0]}`);
        lines.push(`- **Author**: ${commit.author?.login || commit.commit.author.name}`);
        lines.push(`- **Date**: ${formatDate(commit.commit.author.date)}`);
        lines.push(`- **URL**: ${commit.html_url}`);
        lines.push("");
    }
    return lines.join("\n");
}
// ============== Search Result Formatters ==============
export function formatSearchResults(result, formatter) {
    const lines = [
        `# Search Results`,
        "",
        `**Total**: ${formatNumber(result.total_count)} matches`,
        `**Showing**: ${result.items.length} results`,
        result.incomplete_results ? `**Note**: Results may be incomplete` : "",
        ""
    ];
    for (const item of result.items) {
        lines.push(formatter(item));
        lines.push("---");
        lines.push("");
    }
    return lines.filter(Boolean).join("\n");
}
// ============== Generic Formatter ==============
export function formatResponse(data, format, markdownFormatter) {
    const textContent = format === ResponseFormat.MARKDOWN
        ? markdownFormatter(data)
        : JSON.stringify(data, null, 2);
    return {
        text: textContent,
        structured: format === ResponseFormat.JSON ? data : undefined
    };
}
//# sourceMappingURL=formatters.js.map