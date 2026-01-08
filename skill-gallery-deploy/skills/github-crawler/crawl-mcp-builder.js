import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取并保存文件
(async () => {
  const outputDir = 'd:/frontend-design/skills/mcp-builder-SKILL';
  
  console.log('开始爬取 mcp-builder 文件...\n');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    // 爬取 SKILL.md
    console.log('正在爬取: SKILL.md');
    const skillUrl = 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/SKILL.md';
    const skillContent = await crawler.fetchFile(skillUrl);
    const skillPath = path.join(outputDir, 'mcp-builder-SKILL-crawled.md');
    
    await fs.writeFile(skillPath, skillContent);
    console.log(`✓ 成功爬取 SKILL.md (${skillContent.length} 字符)`);
    console.log(`  保存到: ${skillPath}\n`);

    // 等待一下避免速率限制
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 爬取 LICENSE.txt
    console.log('正在爬取: LICENSE.txt');
    const licenseUrl = 'https://github.com/anthropics/skills/blob/main/skills/mcp-builder/LICENSE.txt';
    const licenseContent = await crawler.fetchFile(licenseUrl);
    const licensePath = path.join(outputDir, 'mcp-builder-LICENSE-crawled.txt');
    
    await fs.writeFile(licensePath, licenseContent);
    console.log(`✓ 成功爬取 LICENSE.txt (${licenseContent.length} 字符)`);
    console.log(`  保存到: ${licensePath}\n`);

    console.log('====================');
    console.log('所有文件爬取完成！');
    console.log('====================\n');

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
})();
