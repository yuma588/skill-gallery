/**
 * 爬取 README 示例
 */

import { GitHubCrawler } from '../index.js';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取 README 示例
(async () => {
  const testRepos = [
    'https://github.com/facebook/react',
    'https://github.com/vuejs/core',
    'https://github.com/nodejs/node'
  ];

  for (const repoUrl of testRepos) {
    console.log('\n' + '='.repeat(60));
    console.log(`Crawling README from: ${repoUrl}`);
    console.log('='.repeat(60));

    try {
      const readme = await crawler.fetchReadme(repoUrl);

      console.log('\n--- README Content (first 500 chars) ---');
      console.log(readme.substring(0, 500) + (readme.length > 500 ? '...' : ''));
      console.log(`\nTotal length: ${readme.length} characters`);

      // 可选：保存到文件
      // const fs = await import('fs');
      // const path = await import('path');
      // const repoName = repoUrl.split('/').pop();
      // await fs.promises.writeFile(
      //   path.join('examples', `readme-${repoName}.md`),
      //   readme
      // );
      // console.log(`\n✓ Saved to readme-${repoName}.md`);

    } catch (error) {
      console.error(`\n✗ Error: ${error.message}`);
    }

    // 添加延迟以避免触发速率限制
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Crawling completed!');
  console.log('='.repeat(60) + '\n');
})();
