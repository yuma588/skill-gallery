/**
 * 使用 github-crawler skill 爬取指定的 GitHub 文件
 */

import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 要爬取的文件列表
const filesToCrawl = [
  'https://github.com/eliasjudin/oai-skills/blob/main/docs/render_docx.py',
  'https://github.com/eliasjudin/oai-skills/blob/main/docs/skill.md'
];

// 爬取文件
(async () => {
  console.log('开始爬取文件...\n');

  for (const fileUrl of filesToCrawl) {
    console.log('='.repeat(60));
    console.log(`爬取文件: ${fileUrl}`);
    console.log('='.repeat(60));

    try {
      const content = await crawler.fetchFile(fileUrl);

      // 提取文件名
      const fileName = fileUrl.split('/').pop();

      // 保存到当前目录
      fs.writeFileSync(fileName, content);

      console.log(`✓ 成功保存: ${fileName}`);
      console.log(`  文件大小: ${content.length} 字符`);
      console.log(`  行数: ${content.split('\n').length} 行\n`);

    } catch (error) {
      console.error(`✗ 错误: ${error.message}\n`);
    }

    // 添加延迟以避免触发速率限制
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('='.repeat(60));
  console.log('爬取完成！');
  console.log('='.repeat(60));
})();
