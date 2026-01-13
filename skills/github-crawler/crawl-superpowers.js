import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

// 需要爬取的文件列表
const filesToCrawl = [
  'https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md',
  'https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md',
  'https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md',
  'https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md'
];

async function main() {
  try {
    console.log('开始爬取 superpowers SKILL 文件...\n');

    // 确保输出目录存在
    const outputDir = path.join(process.cwd(), 'crawled', 'superpowers');
    await fs.mkdir(outputDir, { recursive: true });

    const results = [];

    for (const fileUrl of filesToCrawl) {
      try {
        console.log(`正在爬取: ${fileUrl}`);
        
        // 爬取文件内容
        const content = await crawler.fetchFile(fileUrl);
        
        // 从 URL 中提取 skill 目录名和文件名
        const urlParts = fileUrl.split('/');
        const skillName = urlParts[urlParts.length - 2]; // 例如: using-git-worktrees
        const fileName = path.basename(fileUrl);
        
        // 为每个 skill 创建单独的子目录
        const skillDir = path.join(outputDir, skillName);
        await fs.mkdir(skillDir, { recursive: true });
        
        // 保存文件
        const outputPath = path.join(skillDir, fileName);
        await fs.writeFile(outputPath, content);
        
        results.push({
          skill: skillName,
          file: fileName,
          success: true,
          size: content.length
        });
        
        console.log(`✓ 成功爬取 ${skillName}/${fileName} (${content.length} 字符)\n`);
        
        // 添加延迟以避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        const urlParts = fileUrl.split('/');
        const skillName = urlParts[urlParts.length - 2];
        
        results.push({
          skill: skillName,
          file: path.basename(fileUrl),
          success: false,
          error: error.message
        });
        console.log(`✗ 失败: ${skillName} - ${error.message}\n`);
      }
    }

    // 输出总结
    console.log('='.repeat(60));
    console.log('爬取总结:');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`成功: ${successful}/${results.length}`);
    console.log(`失败: ${failed}/${results.length}`);
    console.log('\n详细结果:');
    results.forEach(r => {
      if (r.success) {
        console.log(`  ✓ ${r.skill}/${r.file} (${r.size} 字符)`);
      } else {
        console.log(`  ✗ ${r.skill} - ${r.error}`);
      }
    });
    
    console.log('\n所有文件已保存到:', outputDir);
    
  } catch (error) {
    console.error('\n✗ 爬取过程出错:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
