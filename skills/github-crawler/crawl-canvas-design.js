import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();
const outputDir = 'd:/skill gallery/crawled/canvas-design';

async function main() {
  try {
    console.log('开始爬取 canvas-design 文件...\n');
    
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });
    
    // 定义要爬取的文件
    const files = [
      {
        name: 'SKILL.md',
        repoUrl: 'https://github.com/anthropics/skills',
        filePath: 'skills/canvas-design/SKILL.md'
      },
      {
        name: 'LICENSE.txt',
        repoUrl: 'https://github.com/anthropics/skills',
        filePath: 'skills/canvas-design/LICENSE.txt'
      }
    ];

    // 逐个爬取文件
    for (const file of files) {
      console.log('='.repeat(60));
      console.log(`正在爬取: ${file.name}`);
      console.log(`仓库: ${file.repoUrl}`);
      console.log(`路径: ${file.filePath}`);
      console.log('='.repeat(60));
      
      const content = await crawler.fetchFile(file.repoUrl, file.filePath);
      const outputPath = path.join(outputDir, file.name);
      
      await fs.writeFile(outputPath, content);
      
      console.log(`✓ 成功爬取 ${file.name}`);
      console.log(`  - 长度: ${content.length} 字符`);
      console.log(`  - 行数: ${content.split('\n').length} 行`);
      console.log(`  - 已保存到: ${outputPath}\n`);
      
      // 添加延迟以避免触发速率限制
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('='.repeat(60));
    console.log('✓ 所有文件爬取完成！');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error('\n完整错误信息:');
    console.error(error);
    process.exit(1);
  }
}

main();
