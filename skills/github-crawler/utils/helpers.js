/**
 * URL 解析和构建工具函数
 */

/**
 * 解析 GitHub URL，提取 owner 和 repo
 * @param {string} url - GitHub 仓库或文件 URL
 * @returns {Object} - { owner, repo, path }
 */
export function parseGitHubUrl(url) {
  const trimmedUrl = url.trim();

  const patterns = [
    // https://github.com/owner/repo
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/,
    // https://github.com/owner/repo/blob/branch/path/to/file
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/[^\/]+\/(.+)$/,
    // https://github.com/owner/repo/tree/branch/path
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/[^\/]+\/(.+)$/
  ];

  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
        path: match[3] || null
      };
    }
  }

  throw new Error(`Invalid GitHub URL: ${url}`);
}

/**
 * 构建文件 URL
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @param {string} path - 文件路径
 * @param {string} branch - 分支名称（默认 main）
 * @returns {string} - 完整的文件 URL
 */
export function buildFileUrl(owner, repo, path, branch = 'main') {
  return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
}

/**
 * 构建 README URL
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @returns {string} - 完整的 README URL
 */
export function buildReadmeUrl(owner, repo) {
  return `https://github.com/${owner}/${repo}`;
}

/**
 * 验证 URL 是否为有效的 GitHub URL
 * @param {string} url - 待验证的 URL
 * @returns {boolean} - 是否有效
 */
export function isValidGitHubUrl(url) {
  try {
    parseGitHubUrl(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从 URL 中提取原始内容 URL (raw.githubusercontent.com)
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @param {string} path - 文件路径
 * @param {string} branch - 分支名称
 * @returns {string} - Raw content URL
 */
export function buildRawUrl(owner, repo, path, branch = 'main') {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
