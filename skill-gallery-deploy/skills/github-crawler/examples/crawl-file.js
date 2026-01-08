/**
 * 爬取文件示例
 */

import { GitHubCrawler } from '../index.js';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取文件示例
(async () => {
  const testFiles = [
    {
      url: 'https://github.com/facebook/react',
      path: 'packages/react/src/React.js'
    },
    {
      url: 'https://github.com/nodejs/node',
      path: 'lib/events.js'
    },
    {
      // 也可以使用完整的文件 URL
      url: 'https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiCreateApp.ts'
    }
  ];

  for (const { url, path } of testFiles) {
    console.log('\n' + '='.repeat(60));
    console.log(`Crawling file from: ${url}`);
    if (path) {
      console.log(`File path: ${path}`);
    }
    console.log('='.repeat(60));

    try {
      const content = await crawler.fetchFile(url, path);

      console.log('\n--- File Content (first 500 chars) ---');
      console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      console.log(`\nTotal length: ${content.length} characters`);
      console.log(`Lines: ${content.split('\n').length}`);

      // 可选：保存到文件
      // const fs = await import('fs');
      // const path = await import('path');
      // const fileName = path.split('/').pop().replace(/\.[^.]+$/, '');
      // await fs.promises.writeFile(
      //   path.join('examples', `${fileName}.txt`),
      //   content
      // );
      // console.log(`\n✓ Saved to ${fileName}.txt`);

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
