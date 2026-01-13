import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function retryFailed() {
  try {
    console.log('重试失败的文件...\n');

    const fileUrl = 'https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md';
    
    // 先等一会儿
    console.log('等待 3 秒...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`正在重试: ${fileUrl}`);
    
    const content = await crawler.fetchFile(fileUrl);
    
    // 从 URL 中提取 skill 目录名和文件名
    const urlParts = fileUrl.split('/');
    const skillName = urlParts[urlParts.length - 2];
    const fileName = path.basename(fileUrl);
    
    // 确保输出目录存在
    const outputDir = path.join(process.cwd(), 'crawled', 'superpowers');
    const skillDir = path.join(outputDir, skillName);
    await fs.mkdir(skillDir, { recursive: true });
    
    // 保存文件
    const outputPath = path.join(skillDir, fileName);
    await fs.writeFile(outputPath, content);
    
    console.log(`✓ 成功爬取 ${skillName}/${fileName} (${content.length} 字符)\n`);
    console.log('文件已保存到:', outputPath);
    
  } catch (error) {
    console.error('✗ 重试失败:', error.message);
    process.exit(1);
  }
}

retryFailed();
