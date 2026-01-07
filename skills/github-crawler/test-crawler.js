/**
 * 测试 GitHub Crawler
 */

import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('测试爬取 README...');
    const readme = await crawler.fetchReadme('https://github.com/anthropics/skills');
    console.log('✓ README 爬取成功');
    console.log(`内容长度: ${readme.length} 字符`);
    console.log('前 200 字符:');
    console.log(readme.substring(0, 200));
  } catch (error) {
    console.error('✗ 错误:', error.message);
    console.error(error.stack);
  }
})();
