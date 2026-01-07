import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs/promises';
import path from 'path';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取并保存文件
(async () => {
  const outputDir = 'd:/frontend-design/skills/mcp-builder-SKILL/reference';

  console.log('开始爬取 mcp-builder/reference 文件...\n');

  try {
    // 创建输出目录
    await fs.mkdir(outputDir, { recursive: true });

    // 要爬取的文件列表
    const files = [
      {
        name: 'evaluation.md',
        url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/evaluation.md'
      },
      {
        name: 'mcp_best_practices.md',
        url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/mcp_best_practices.md'
      },
      {
        name: 'node_mcp_server.md',
        url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/node_mcp_server.md'
      },
      {
        name: 'python_mcp_server.md',
        url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/python_mcp_server.md'
      }
    ];

    for (const file of files) {
      console.log(`正在爬取: ${file.name}`);
      const content = await crawler.fetchFile(file.url);
      const outputPath = path.join(outputDir, file.name);

      await fs.writeFile(outputPath, content);
      console.log(`✓ 成功爬取 ${file.name} (${content.length} 字符)`);
      console.log(`  保存到: ${outputPath}\n`);

      // 等待避免速率限制
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('====================');
    console.log('所有文件爬取完成！');
    console.log('====================\n');

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
