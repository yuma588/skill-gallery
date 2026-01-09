import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    const files = [
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/create_basic_spreadsheet.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/create_spreadsheet_with_styling.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/read_existing_spreadsheet.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/styling_spreadsheet.py'
    ];

    const outputDir = 'd:/skill gallery/oai-spreadsheet-examples';

    console.log('开始爬取 oai-skills spreadsheet 示例文件...\n');

    await fs.mkdir(outputDir, { recursive: true });

    for (const fileUrl of files) {
      try {
        console.log(`正在爬取: ${fileUrl}`);

        const content = await crawler.fetchFile(fileUrl);
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);

        await fs.writeFile(outputPath, content);

        console.log(`✓ 成功爬取 ${fileName} (${content.length} 字符)`);
        console.log(`  保存到: ${outputPath}\n`);
      } catch (error) {
        console.error(`✗ 爬取失败: ${error.message}\n`);
      }
    }

    console.log('所有文件爬取完成！');
    console.log(`\n文件已保存到目录: ${outputDir}`);

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

main();
