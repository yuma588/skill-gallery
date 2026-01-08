import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  const filesToCrawl = [
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/SKILL.md',
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/LICENSE.txt',
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/requirements.txt'
  ];

  const outputDir = 'd:/frontend-design/skills/slack-gif-creator-SKILL';

  try {
    await fs.mkdir(outputDir, { recursive: true });
    console.log('开始爬取文件...\n');

    for (let i = 0; i < filesToCrawl.length; i++) {
      const fileUrl = filesToCrawl[i];
      console.log(`[${i + 1}/${filesToCrawl.length}] 正在爬取: ${fileUrl}`);

      const content = await crawler.fetchFile(fileUrl);
      const fileName = path.basename(fileUrl);
      const outputPath = path.join(outputDir, fileName);

      await fs.writeFile(outputPath, content);
      console.log(`  ✓ 成功保存 ${fileName} (${content.length} 字符)\n`);

      if (i < filesToCrawl.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('✓ 所有文件爬取完成！');
    console.log(`\n文件已保存到: ${outputDir}`);

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error('详细错误:', error);
    process.exit(1);
  }
}

main();
