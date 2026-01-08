import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();
const owner = 'anthropics';
const repo = 'skills';

// 需要爬取的示例文件
const filesToCrawl = [
  'skills/internal-comms/examples/3p-updates.md',
  'skills/internal-comms/examples/company-newsletter.md',
  'skills/internal-comms/examples/faq-answers.md',
  'skills/internal-comms/examples/general-comms.md'
];

async function main() {
  try {
    console.log('开始爬取 internal-comms skill 的示例文件...\n');
    
    // 确保输出目录存在
    const outputDir = 'd:/frontend-design/skills/internal-comms-SKILL/examples';
    await fs.mkdir(outputDir, { recursive: true });
    
    const results = [];
    
    for (const filePath of filesToCrawl) {
      try {
        console.log(`正在爬取: ${filePath}`);
        const content = await crawler.fetchFile(
          `https://github.com/${owner}/${repo}`,
          filePath
        );
        
        // 保存文件
        const fileName = path.basename(filePath);
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
        results.push({
          file: path.basename(filePath),
          success: false,
          error: error.message
        });
        console.log(`✗ 失败: ${path.basename(filePath)} - ${error.message}\n`);
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
