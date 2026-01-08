/**
 * HTTP 请求工具模块
 */

import axios from 'axios';

/**
 * GitHub Fetcher 类
 * 用于发送 HTTP 请求并处理错误
 */
export class GitHubFetcher {
  constructor(options = {}) {
    this.timeout = options.timeout || 10000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.token = options.token || null;

    // 创建 axios 实例
    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        ...(this.token && { 'Authorization': `token ${this.token}` })
      }
    });
  }

  /**
   * 获取网页内容
   * @param {string} url - 请求的 URL
   * @returns {Promise<string>} - HTML 内容
   */
  async fetch(url) {
    let lastError;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await this.client.get(url);
        return response.data;
      } catch (error) {
        lastError = error;

        // 429 Too Many Requests - 等待更长时间
        if (error.response?.status === 429) {
          const waitTime = this.retryDelay * attempt * 2;
          await this.sleep(waitTime);
          continue;
        }

        // 404 Not Found - 不重试
        if (error.response?.status === 404) {
          throw new Error(`Resource not found: ${url}`);
        }

        // 其他错误 - 重试
        if (attempt < this.retries) {
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }

    throw new Error(`Failed to fetch URL after ${this.retries} attempts: ${lastError.message}`);
  }

  /**
   * 获取 raw 文件内容
   * @param {string} url - raw.githubusercontent.com URL
   * @returns {Promise<string>} - 文件内容
   */
  async fetchRawContent(url) {
    return await this.fetch(url);
  }

  /**
   * 设置 GitHub Token（用于访问私有仓库）
   * @param {string} token - GitHub Personal Access Token
   */
  setToken(token) {
    this.token = token;
    this.client.defaults.headers['Authorization'] = `token ${token}`;
  }

  /**
   * 睡眠函数
   * @param {number} ms - 毫秒数
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取请求延迟时间（随机化以避免检测）
   * @param {number} min - 最小毫秒数
   * @param {number} max - 最大毫秒数
   * @returns {number} - 随机延迟时间
   */
  getRandomDelay(min = 500, max = 1500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
