import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

// 需要爬取的文件列表
const filesToCrawl = [
  'https://github.com/anthropics/skills/blob/main/skills/internal-comms/examples/3p-updates.md',
  'https://github.com/anthropics/skills/blob/main/skills/internal-comms/examples/company-newsletter.md',
  'https://github.com/anthropics/skills/blob/main/skills/internal-comms/examples/faq-answers.md',
  'https://github.com/anthropics/skills/blob/main/skills/internal-comms/examples/general-comms.md'
];

async function main() {
  try {
    console.log('开始爬取 internal-comms 示例文件...\n');

    // 确保输出目录存在
    const outputDir = 'd:/frontend-design/skills/internal-comms-SKILL/examples';
    await fs.mkdir(outputDir, { recursive: true });

    const results = [];

    for (const fileUrl of filesToCrawl) {
      try {
        console.log(`正在爬取: ${fileUrl}`);
        
        // 爬取文件内容
        const content = await crawler.fetchFile(fileUrl);
        
        // 从 URL 中提取文件名
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);
        
        // 保存文件
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
        results.push({
          file: path.basename(fileUrl),
          success: false,
          error: error.message
        });
        console.log(`✗ 失败: ${path.basename(fileUrl)} - ${error.message}\n`);
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
    process.exit(1);
  }
}

main();
