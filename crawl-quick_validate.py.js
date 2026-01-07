import { GitHubCrawler } from './skills/github-crawler/index.js';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 quick_validate.py 文件...');
    console.log('URL: https://github.com/anthropics/skills/blob/main/skills/skill-creator/scripts/quick_validate.py');
    console.log('\n' + '='.repeat(60));

    const content = await crawler.fetchFile(
      'https://github.com/anthropics/skills',
      'skills/skill-creator/scripts/quick_validate.py'
    );

    console.log('✓ 爬取成功!');
    console.log(`总长度: ${content.length} 字符`);
    console.log(`总行数: ${content.split('\n').length} 行`);
    console.log('\n' + '='.repeat(60));
    console.log('文件内容:');
    console.log('='.repeat(60));
    console.log(content);
    console.log('='.repeat(60));

    // 保存到本地文件
    const fs = await import('fs');
    const filePath = 'd:/frontend-design/quick_validate.py';
    await fs.promises.writeFile(filePath, content);
    console.log(`\n✓ 文件已保存到: ${filePath}`);

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    console.error('\n完整错误信息:');
    console.error(error);
  }
})();
