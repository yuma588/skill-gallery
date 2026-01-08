import { GitHubCrawler } from '../github-crawler/index.js';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 SKILL.md 文件...');
    const content = await crawler.fetchFile(
      'https://github.com/anthropics/skills',
      'skills/pptx/SKILL.md'
    );

    console.log('\n' + '='.repeat(60));
    console.log('SKILL.md 文件内容:');
    console.log('='.repeat(60));
    console.log(content);
    console.log('\n' + '='.repeat(60));
    console.log(`✓ 爬取成功! 总长度: ${content.length} 字符`);
    console.log('='.repeat(60));

    // 保存到本地文件
    const fs = await import('fs');
    await fs.promises.writeFile(
      'd:/frontend-design/pptx-SKILL.md',
      content
    );
    console.log('\n✓ 文件已保存到: pptx-SKILL.md');

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
})();
