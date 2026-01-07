import { GitHubCrawler } from './skills/github-crawler/index.js';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 SKILL.md 文件...');
    console.log('链接: https://github.com/anthropics/skills/blob/main/skills/algorithmic-art/SKILL.md\n');

    const content = await crawler.fetchFile(
      'https://github.com/anthropics/skills',
      'skills/algorithmic-art/SKILL.md'
    );

    console.log('='.repeat(60));
    console.log('✓ 爬取成功!');
    console.log('='.repeat(60));
    console.log(`\n总长度: ${content.length} 字符`);
    console.log(`总行数: ${content.split('\n').length} 行\n`);

    // 显示内容预览
    console.log('--- 文件内容预览 (前1000字符) ---');
    console.log(content.substring(0, 1000));
    if (content.length > 1000) {
      console.log('...\n(完整内容已保存到文件)\n');
    }

    // 保存到本地文件
    const fs = await import('fs');
    const filePath = 'd:/frontend-design/algorithmic-art-SKILL.md';
    await fs.promises.writeFile(filePath, content);
    console.log('='.repeat(60));
    console.log(`✓ 文件已保存到: ${filePath}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error('\n完整错误信息:');
    console.error(error);
    process.exit(1);
  }
})();
