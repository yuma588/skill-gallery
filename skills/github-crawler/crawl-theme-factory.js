import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    // 定义要爬取的文件列表
    const files = [
      'https://github.com/anthropics/skills/blob/main/skills/theme-factory/SKILL.md',
      'https://github.com/anthropics/skills/blob/main/skills/theme-factory/LICENSE.txt',
      'https://github.com/anthropics/skills/blob/main/skills/theme-factory/theme-showcase.pdf'
    ];

    const outputDir = 'd:/frontend-design/skills/theme-factory-SKILL';

    console.log('开始爬取 theme-factory 文件...\n');

    for (const fileUrl of files) {
      console.log(`正在爬取: ${fileUrl}`);

      try {
        // 直接从 raw.githubusercontent.com 获取文件
        const owner = 'anthropics';
        const repo = 'skills';
        const branch = 'main';
        const filePath = fileUrl.split(`${owner}/${repo}/blob/${branch}/`)[1];

        if (!filePath) {
          throw new Error(`无法解析文件路径: ${fileUrl}`);
        }

        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
        console.log(`  Raw URL: ${rawUrl}`);

        const response = await fetch(rawUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, content);

        console.log(`✓ 成功爬取 ${fileName} (${content.length} 字节)`);
        console.log(`  保存到: ${outputPath}\n`);

        // 添加延迟避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`✗ 爬取失败: ${path.basename(fileUrl)}`);
        console.error(`  错误: ${error.message}\n`);
      }
    }

    console.log('✓ 爬取完成！');

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
