import { GitHubCrawler } from './skills/github-crawler/index.js';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 algorithmic-art/SKILL.md...\n');

    const content = await crawler.fetchFile(
      'https://github.com/anthropics/skills',
      'skills/algorithmic-art/SKILL.md'
    );

    console.log('✓ 爬取成功!');
    console.log(`长度: ${content.length} 字符`);
    console.log(`行数: ${content.split('\n').length} 行\n`);

    // 保存文件
    const fs = await import('fs');
    await fs.promises.writeFile(
      'd:/frontend-design/algorithmic-art-SKILL.md',
      content
    );
    console.log('✓ 已保存到: algorithmic-art-SKILL.md');

  } catch (error) {
    console.error('✗ 失败:', error.message);
  }
})();
