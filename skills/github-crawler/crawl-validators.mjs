import { GitHubCrawler } from './index.js';
import fs from 'fs';
import path from 'path';

const crawler = new GitHubCrawler();

const file = {
  url: 'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/core/validators.py',
  outputPath: 'd:/frontend-design/skills/slack-gif-creator-SKILL/core/validators.py'
};

console.log('正在重新爬取: validators.py');

try {
  const content = await crawler.fetchFile(file.url);
  
  // 确保目录存在
  const dir = path.dirname(file.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(file.outputPath, content, 'utf8');
  console.log(`✅ 已保存到: ${file.outputPath}`);
} catch (error) {
  console.error(`❌ 爬取失败: ${error.message}`);
}
