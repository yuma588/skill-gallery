/**
 * 爬取 brand-guidelines SKILL.md 和 LICENSE.txt 文件
 */

import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const crawler = new GitHubCrawler();
  const baseUrl = 'https://github.com/anthropics/skills';
  const outputDir = 'd:/frontend-design/skills/brand-guidelines-SKILL';

  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✓ 创建目录: ${outputDir}\n`);
    }

    console.log('正在爬取 brand-guidelines 文件...\n');
    console.log('='.repeat(50));

    // 爬取 SKILL.md
    console.log('\n[1/2] 爬取 SKILL.md...');
    const skillPath = 'skills/brand-guidelines/SKILL.md';
    const skillContent = await crawler.fetchFile(baseUrl, skillPath);
    const skillFile = path.join(outputDir, 'brand-guidelines-SKILL.md');
    fs.writeFileSync(skillFile, skillContent, 'utf-8');
    console.log(`  ✓ 已保存: ${skillFile}`);
    console.log(`  大小: ${skillContent.length} 字符`);

    // 爬取 LICENSE.txt
    console.log('\n[2/2] 爬取 LICENSE.txt...');
    const licensePath = 'skills/brand-guidelines/LICENSE.txt';
    const licenseContent = await crawler.fetchFile(baseUrl, licensePath);
    const licenseFile = path.join(outputDir, 'LICENSE.txt');
    fs.writeFileSync(licenseFile, licenseContent, 'utf-8');
    console.log(`  ✓ 已保存: ${licenseFile}`);
    console.log(`  大小: ${licenseContent.length} 字符`);

    console.log('\n' + '='.repeat(50));
    console.log('\n✓ 全部成功！');
    console.log(`\n输出目录: ${outputDir}`);
    console.log('文件列表:');
    console.log(`  - brand-guidelines-SKILL.md (${skillContent.length} 字符)`);
    console.log(`  - LICENSE.txt (${licenseContent.length} 字符)`);

  } catch (error) {
    console.error('\n✗ 错误:', error.message);
    process.exit(1);
  }
}

main();
