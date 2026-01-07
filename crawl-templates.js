import { GitHubCrawler } from './skills/github-crawler/index.js';
import fs from 'fs';
import path from 'path';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 algorithmic-art skill 模板文件...\n');

    // 创建 templates 目录
    const templatesDir = 'd:/frontend-design/skills/algorithmic-art-SKILL/templates';
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
      console.log('✓ 创建 templates 目录\n');
    }

    // 下载 generator_template.js
    console.log('1. 下载 generator_template.js...');
    const generatorContent = await crawler.fetchFile(
      'https://github.com/anthropics/skills/blob/main/skills/algorithmic-art/templates/generator_template.js'
    );
    await fs.promises.writeFile(
      path.join(templatesDir, 'generator_template.js'),
      generatorContent
    );
    console.log('✓ generator_template.js 下载成功!');
    console.log(`   大小: ${generatorContent.length} 字符\n`);

    // 下载 viewer.html
    console.log('2. 下载 viewer.html...');
    const viewerContent = await crawler.fetchFile(
      'https://github.com/anthropics/skills/blob/main/skills/algorithmic-art/templates/viewer.html'
    );
    await fs.promises.writeFile(
      path.join(templatesDir, 'viewer.html'),
      viewerContent
    );
    console.log('✓ viewer.html 下载成功!');
    console.log(`   大小: ${viewerContent.length} 字符\n`);

    console.log('🎉 所有模板文件下载完成!');

  } catch (error) {
    console.error('✗ 失败:', error.message);
  }
})();
