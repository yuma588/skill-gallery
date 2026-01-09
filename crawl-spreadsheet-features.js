import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs/promises';
import path from 'path';

const crawler = new GitHubCrawler();

async function main() {
  try {
    const files = [
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/change_existing_charts.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/cite_cells.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_area_chart.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_bar_chart.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_doughnut_chart.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_line_chart.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_pie_chart.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/create_tables.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_cell_borders.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_cell_fills.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_cell_width_height.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_conditional_formatting.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_font_styles.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_merge_cells.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_number_formats.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_text_alignment.py',
      'https://github.com/eliasjudin/oai-skills/blob/main/spreadsheets/examples/features/set_wrap_text_styles.py'
    ];

    const outputDir = 'd:/skill gallery/oai-spreadsheet-features';

    console.log('开始爬取 oai-skills spreadsheet features 示例文件...\n');

    await fs.mkdir(outputDir, { recursive: true });

    let successCount = 0;
    let failCount = 0;

    for (const fileUrl of files) {
      try {
        console.log(`正在爬取: ${fileUrl}`);

        const content = await crawler.fetchFile(fileUrl);
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);

        await fs.writeFile(outputPath, content);

        console.log(`✓ 成功爬取 ${fileName} (${content.length} 字符)`);
        console.log(`  保存到: ${outputPath}\n`);
        successCount++;
      } catch (error) {
        console.error(`✗ 爬取失败: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('========================================');
    console.log('所有文件爬取完成！');
    console.log(`成功: ${successCount} 个文件`);
    console.log(`失败: ${failCount} 个文件`);
    console.log(`文件已保存到目录: ${outputDir}`);

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

main();
