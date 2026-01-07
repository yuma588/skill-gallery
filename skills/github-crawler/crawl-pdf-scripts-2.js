import { GitHubCrawler } from '../github-crawler/index.js';

const crawler = new GitHubCrawler();

// 输出目录
const outputDir = 'd:/frontend-design/skills/github-crawler/pdf-scripts';

// 要爬取的文件列表
const files = [
  {
    name: 'create_validation_image.py',
    path: 'skills/pdf/scripts/create_validation_image.py'
  },
  {
    name: 'extract_form_field_info.py',
    path: 'skills/pdf/scripts/extract_form_field_info.py'
  },
  {
    name: 'fill_fillable_fields.py',
    path: 'skills/pdf/scripts/fill_fillable_fields.py'
  },
  {
    name: 'fill_pdf_form_with_annotations.py',
    path: 'skills/pdf/scripts/fill_pdf_form_with_annotations.py'
  }
];

(async () => {
  try {
    console.log('开始爬取 PDF 脚本（第二批次）...\n');

    // 确保输出目录存在
    const fs = await import('fs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✓ 创建目录: ${outputDir}\n`);
    }

    // 爬取每个文件
    for (const file of files) {
      console.log(`正在爬取: ${file.name}`);
      console.log(`  路径: ${file.path}`);

      const content = await crawler.fetchFile(
        'https://github.com/anthropics/skills',
        file.path
      );

      const outputPath = `${outputDir}/${file.name}`;
      await fs.promises.writeFile(outputPath, content);

      console.log(`✓ 已保存: ${outputPath}`);
      console.log(`  文件大小: ${content.length} 字符`);
      console.log(`  总行数: ${content.split('\n').length} 行\n`);

      // 添加延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('='.repeat(60));
    console.log('爬取完成!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error('\n完整错误信息:');
    console.error(error);
    process.exit(1);
  }
})();
