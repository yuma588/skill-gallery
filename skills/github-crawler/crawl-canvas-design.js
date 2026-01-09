// 爬取 canvas-design skill 文件的脚本
import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    // 定义要爬取的文件列表
    const files = [
      'https://github.com/anthropics/skills/blob/main/skills/canvas-design/LICENSE.txt',
      'https://github.com/anthropics/skills/blob/main/skills/canvas-design/SKILL.md'
    ];

    const outputDir = 'd:/skill gallery/skills/canvas-design-SKILL';

    console.log('开始爬取 canvas-design 文件...\n');
    console.log(`目标目录: ${outputDir}\n`);

    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });

    for (const fileUrl of files) {
      console.log(`正在爬取: ${fileUrl}`);

      try {
        // 使用 GitHubCrawler 的 fetchFile 方法
        const content = await crawler.fetchFile(fileUrl);
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);

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

    console.log('✓ 所有文件爬取完成！');

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
