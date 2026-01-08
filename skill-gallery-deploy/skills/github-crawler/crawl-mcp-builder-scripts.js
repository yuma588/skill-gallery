import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取并保存文件
(async () => {
  const outputDir = 'd:/frontend-design/skills/mcp-builder-SKILL';

  const files = [
    {
      name: 'connections.py',
      url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/connections.py',
      filename: 'mcp-builder-connections-crawled.py'
    },
    {
      name: 'evaluation.py',
      url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/evaluation.py',
      filename: 'mcp-builder-evaluation-crawled.py'
    },
    {
      name: 'example_evaluation.xml',
      url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/example_evaluation.xml',
      filename: 'mcp-builder-example_evaluation-crawled.xml'
    },
    {
      name: 'requirements.txt',
      url: 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/requirements.txt',
      filename: 'mcp-builder-requirements-crawled.txt'
    }
  ];

  console.log('开始爬取 mcp-builder scripts 文件...\n');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[${i + 1}/${files.length}] 正在爬取: ${file.name}`);
      console.log(`  URL: ${file.url}`);

      const content = await crawler.fetchFile(file.url);
      const outputPath = path.join(outputDir, file.filename);

      await fs.writeFile(outputPath, content);
      console.log(`  ✓ 成功爬取 (${content.length} 字符)`);
      console.log(`  ✓ 保存到: ${outputPath}\n`);

      // 等待一下避免速率限制
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('====================');
    console.log('所有文件爬取完成！');
    console.log('====================\n');

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
})();
