import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    const fileUrl = 'https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md';
    const fileName = 'brainstorming-SKILL.md';
    const outputPath = path.join('d:/skill gallery', fileName);

    console.log('正在爬取:', fileUrl);
    const content = await crawler.fetchFile(fileUrl);

    await fs.writeFile(outputPath, content);

    console.log('✓ 成功保存', fileName, `(${content.length} 字符)`);
    console.log('文件路径:', outputPath);
    console.log('\n--- 文件内容 ---');
    console.log(content);

  } catch (error) {
    console.error('✗ 失败:', error.message);
    process.exit(1);
  }
}

main();
