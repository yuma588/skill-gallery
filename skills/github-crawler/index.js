/**
 * GitHub Crawler 主模块
 * 用于爬取 GitHub 仓库的文件内容和 README 文档
 */

import { GitHubFetcher } from './utils/fetcher.js';
import { GitHubParser } from './utils/parser.js';
import { parseGitHubUrl, buildFileUrl, buildRawUrl } from './utils/helpers.js';

/**
 * GitHubCrawler 类
 */
export class GitHubCrawler {
  constructor(options = {}) {
    this.fetcher = new GitHubFetcher(options);
    this.parser = new GitHubParser();
  }

  /**
   * 爬取 README 文档
   * @param {string} url - GitHub 仓库 URL
   * @returns {Promise<string>} - README Markdown 内容
   */
  async fetchReadme(url) {
    try {
      // 验证 URL
      const { owner, repo } = parseGitHubUrl(url);

      console.log(`Fetching README from ${owner}/${repo}...`);

      // 构建仓库主页 URL
      const repoUrl = `https://github.com/${owner}/${repo}`;

      // 获取页面内容
      const html = await this.fetcher.fetch(repoUrl);

      // 加载并解析
      this.parser.load(html);

      // 检查错误
      if (this.parser.isNotFound()) {
        throw new Error(`Repository not found: ${owner}/${repo}`);
      }

      if (this.parser.isPrivate()) {
        throw new Error(`Repository is private. Please provide a GitHub token.`);
      }

      const error = this.parser.extractError();
      if (error) {
        throw new Error(`Error: ${error}`);
      }

      // 提取 README
      const readme = this.parser.extractReadmeContent();

      if (!readme) {
        throw new Error('README not found in the repository');
      }

      console.log(`✓ Successfully fetched README (${readme.length} characters)`);
      return readme;

    } catch (error) {
      throw new Error(`Failed to fetch README: ${error.message}`);
    }
  }

  /**
   * 爬取文件内容
   * @param {string} url - GitHub 仓库 URL 或文件 URL
   * @param {string} path - 文件路径（如果 url 是仓库 URL）
   * @returns {Promise<string>} - 文件内容
   */
  async fetchFile(url, path = null) {
    try {
      // 解析 URL
      let { owner, repo, path: urlPath } = parseGitHubUrl(url);

      // 如果 URL 中已经包含路径，则使用它
      const filePath = urlPath || path;

      if (!filePath) {
        throw new Error('File path is required. Either provide it in the URL or as a parameter.');
      }

      console.log(`Fetching file: ${owner}/${repo}/${filePath}...`);

      // 方案 1: 尝试使用 raw URL（更快且更可靠）
      try {
        const rawUrl = buildRawUrl(owner, repo, filePath);
        const content = await this.fetcher.fetchRawContent(rawUrl);

        // 检查是否是错误页面
        if (content.includes('404: Not Found') || content.includes('Not Found')) {
          throw new Error('File not found');
        }

        console.log(`✓ Successfully fetched file (${content.length} characters)`);
        return content;

      } catch (rawError) {
        console.log(`Raw fetch failed, trying web scraping...`);

        // 方案 2: 使用网页爬虫（raw 失败时）
        const fileUrl = buildFileUrl(owner, repo, filePath);
        const html = await this.fetcher.fetch(fileUrl);

        // 加载并解析
        this.parser.load(html);

        // 检查错误
        if (this.parser.isNotFound()) {
          throw new Error(`File not found: ${filePath}`);
        }

        if (this.parser.isPrivate()) {
          throw new Error(`Repository is private. Please provide a GitHub token.`);
        }

        const error = this.parser.extractError();
        if (error) {
          throw new Error(`Error: ${error}`);
        }

        // 提取文件内容
        const content = this.parser.extractFileContent();

        if (!content) {
          throw new Error('Could not extract file content');
        }

        console.log(`✓ Successfully fetched file (${content.length} characters)`);
        return content;
      }

    } catch (error) {
      throw new Error(`Failed to fetch file: ${error.message}`);
    }
  }

  /**
   * 设置 GitHub Token（用于访问私有仓库）
   * @param {string} token - GitHub Personal Access Token
   */
  setToken(token) {
    this.fetcher.setToken(token);
  }

  /**
   * 批量爬取多个文件
   * @param {Array<{url: string, path?: string}>} files - 文件列表
   * @returns {Promise<Array<{path: string, content: string, error?: string}>>}
   */
  async fetchMultipleFiles(files) {
    const results = [];

    for (const file of files) {
      try {
        const content = await this.fetchFile(file.url, file.path);
        results.push({
          path: file.path || file.url,
          content,
          success: true
        });
      } catch (error) {
        results.push({
          path: file.path || file.url,
          error: error.message,
          success: false
        });
      }

      // 添加延迟以避免触发速率限制
      if (results.length < files.length) {
        await this.fetcher.sleep(this.fetcher.getRandomDelay(500, 1500));
      }
    }

    return results;
  }
}

/**
 * 统一的 API 接口
 * 用于外部调用
 */
export async function use_github_crawler(params) {
  const { mode, url, path } = params;

  const crawler = new GitHubCrawler();

  switch (mode) {
    case 'fetch_readme':
      return await crawler.fetchReadme(url);

    case 'fetch_file':
      return await crawler.fetchFile(url, path);

    default:
      throw new Error(`Unknown mode: ${mode}. Valid modes are: fetch_readme, fetch_file`);
  }
}

export default GitHubCrawler;
