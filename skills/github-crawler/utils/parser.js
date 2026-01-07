/**
 * HTML 解析工具模块
 */

import * as cheerio from 'cheerio';

/**
 * GitHub Parser 类
 * 用于解析 GitHub 网页并提取内容
 */
export class GitHubParser {
  constructor() {
    this.$ = null;
  }

  /**
   * 加载 HTML 内容
   * @param {string} html - HTML 字符串
   */
  load(html) {
    this.$ = cheerio.load(html);
  }

  /**
   * 从文件页面提取代码内容
   * @returns {string} - 提取的代码内容
   */
  extractFileContent() {
    if (!this.$) {
      throw new Error('HTML not loaded. Call load() first.');
    }

    // 尝试多种选择器，以适应不同版本的 GitHub
    const selectors = [
      'div[data-testid="raw-content"]',
      'div.readme',
      'article.markdown-body',
      'table.highlight tbody td.blob-code',
      'div[data-testid="original-file-contents"]',
      'pre'
    ];

    for (const selector of selectors) {
      const element = this.$(selector).first();
      if (element.length > 0) {
        return element.text().trim();
      }
    }

    // 尝试从 data-paste-markdown-skip 或 data-raw 属性中提取
    const rawData = this.$('[data-raw], [data-paste-markdown-skip]').first().attr('data-raw')
                    || this.$('[data-raw], [data-paste-markdown-skip]').first().attr('data-paste-markdown-skip');

    if (rawData) {
      try {
        return JSON.parse(rawData);
      } catch {
        return rawData;
      }
    }

    throw new Error('Could not extract file content. The page structure may have changed.');
  }

  /**
   * 从仓库主页提取 README 内容
   * @returns {string} - 提取的 README Markdown 内容
   */
  extractReadmeContent() {
    if (!this.$) {
      throw new Error('HTML not loaded. Call load() first.');
    }

    // README 选择器
    const readmeSelectors = [
      'article[data-testid="readme"]',
      'div#readme article',
      'div.readme article',
      'article.markdown-body'
    ];

    for (const selector of readmeSelectors) {
      const element = this.$(selector).first();
      if (element.length > 0) {
        // 移除可能的按钮和其他干扰元素
        element.find('button, [role="button"], .octo-link').remove();
        return element.text().trim();
      }
    }

    // 尝试查找包含 README 的任何元素
    const readmeElement = this.$('*').filter(function() {
      const text = $(this).text().toLowerCase();
      return text.includes('readme') && $(this).find('h1, h2, h3').length > 0;
    }).first();

    if (readmeElement.length > 0) {
      readmeElement.find('button, [role="button"]').remove();
      return readmeElement.text().trim();
    }

    throw new Error('Could not extract README content. The repository may not have a README.');
  }

  /**
   * 检查页面是否存在错误信息
   * @returns {string|null} - 错误信息或 null
   */
  extractError() {
    if (!this.$) {
      return null;
    }

    // 查找常见错误信息
    const errorSelectors = [
      'div[data-testid="error"]',
      '.error-message',
      '.flash-error',
      'h1:contains("Not Found")',
      'h1:contains("Repository not found")',
      'h1:contains("Page not found")'
    ];

    for (const selector of errorSelectors) {
      const element = this.$(selector).first();
      if (element.length > 0) {
        return element.text().trim();
      }
    }

    return null;
  }

  /**
   * 检查是否为 404 页面
   * @returns {boolean}
   */
  isNotFound() {
    if (!this.$) {
      return false;
    }

    const title = this.$('title').text().toLowerCase();
    const bodyText = this.$('body').text().toLowerCase();

    return title.includes('not found') ||
           title.includes('page not found') ||
           bodyText.includes('repository not found') ||
           bodyText.includes('this is not the page you');
  }

  /**
   * 检查是否为私有仓库
   * @returns {boolean}
   */
  isPrivate() {
    if (!this.$) {
      return false;
    }

    const bodyText = this.$('body').text().toLowerCase();
    return bodyText.includes('private repository') ||
           bodyText.includes('repository is private') ||
           bodyText.includes('access denied');
  }
}
