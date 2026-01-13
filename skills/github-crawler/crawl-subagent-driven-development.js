import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

// 需要爬取的文件列表
const filesToCrawl = [
  'https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md',
  'https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/code-quality-reviewer-prompt.md',
  'https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/implementer-prompt.md',
  'https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/spec-reviewer-prompt.md'
];

async function main() {
  try {
    console.log('开始爬取 subagent-driven-development 文件...\n');

    // 确保输出目录存在
    const outputDir = path.join(process.cwd(), 'crawled', 'subagent-driven-development');
    await fs.mkdir(outputDir, { recursive: true });

    const results = [];

    for (const fileUrl of filesToCrawl) {
      try {
        console.log(`正在爬取: ${fileUrl}`);
        
        // 爬取文件内容
        const content = await crawler.fetchFile(fileUrl);
        
        // 从 URL 中提取文件名
        const fileName = path.basename(fileUrl);
        
        // 保存文件到同一个目录
        const outputPath = path.join(outputDir, fileName);
        await fs.writeFile(outputPath, content);
        
        results.push({
          file: fileName,
          success: true,
          size: content.length
        });
        
        console.log(`✓ 成功爬取 ${fileName} (${content.length} 字符)\n`);
        
        // 添加延迟以避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        const fileName = path.basename(fileUrl);
        
        results.push({
          file: fileName,
          success: false,
          error: error.message
        });
        console.log(`✗ 失败: ${fileName} - ${error.message}\n`);
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
        console.log(`  ✓ ${r.file} (${r.size} 字符)`);
      } else {
        console.log(`  ✗ ${r.file} - ${r.error}`);
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
