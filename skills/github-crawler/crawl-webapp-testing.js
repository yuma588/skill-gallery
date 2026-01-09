import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    // 定义要爬取的文件列表
    const files = [
      'https://github.com/anthropics/skills/blob/main/skills/webapp-testing/scripts/with_server.py',
      'https://github.com/anthropics/skills/blob/main/skills/webapp-testing/examples/console_logging.py',
      'https://github.com/anthropics/skills/blob/main/skills/webapp-testing/examples/element_discovery.py',
      'https://github.com/anthropics/skills/blob/main/skills/webapp-testing/examples/static_html_automation.py'
    ];

    const outputDir = 'd:/skill gallery/skills/webapp-testing-SKILL';

    console.log('开始爬取 webapp-testing 文件...\n');

    for (const fileUrl of files) {
      console.log(`正在爬取: ${fileUrl}`);

      try {
        // 使用 GitHubCrawler 的 fetchFile 方法
        const content = await crawler.fetchFile(fileUrl);

        // 提取文件路径以保持目录结构
        const filePath = fileUrl.split('skills/webapp-testing/')[1];
        const outputPath = path.join(outputDir, filePath);

        // 确保目录存在
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        // 写入文件
        await fs.writeFile(outputPath, content);

        console.log(`✓ 成功爬取 ${path.basename(fileUrl)} (${content.length} 字节)`);
        console.log(`  保存到: ${outputPath}\n`);

        // 添加延迟避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`✗ 爬取失败: ${path.basename(fileUrl)}`);
        console.error(`  错误: ${error.message}\n`);
      }
    }

    console.log('✓ 爬取完成！');

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
