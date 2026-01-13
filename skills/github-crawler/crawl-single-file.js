import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    const fileUrl = 'https://github.com/obra/superpowers/blob/main/skills/finishing-a-development-branch/SKILL.md';
    const outputDir = 'd:/skill gallery/crawled/finishing-a-development-branch';

    console.log('开始爬取文件...\n');
    console.log(`正在爬取: ${fileUrl}`);

    const content = await crawler.fetchFile(fileUrl);
    const fileName = path.basename(fileUrl);
    const outputPath = path.join(outputDir, fileName);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, content);

    console.log(`✓ 成功爬取 ${fileName} (${content.length} 字符)`);
    console.log(`\n文件已保存到: ${outputPath}`);

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
}

main();
