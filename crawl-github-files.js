import { GitHubCrawler } from './authropic_skills/github-crawler/index.js';
import { writeFileSync } from 'fs';

const crawler = new GitHubCrawler();

(async () => {
  try {
    console.log('开始爬取 GitHub 文件...\n');

    // 文件 1: skill.md
    console.log('1. 爬取 skill.md...');
    const skillContent = await crawler.fetchFile(
      'https://github.com/eliasjudin/oai-skills/blob/main/docs/skill.md'
    );
    writeFileSync('d:/skill gallery/skill.md', skillContent, 'utf8');
    console.log('✓ skill.md 已保存到 d:/skill gallery/skill.md\n');

    // 文件 2: render_docx.py
    console.log('2. 爬取 render_docx.py...');
    const renderContent = await crawler.fetchFile(
      'https://github.com/eliasjudin/oai-skills/blob/main/docs/render_docx.py'
    );
    writeFileSync('d:/skill gallery/render_docx.py', renderContent, 'utf8');
    console.log('✓ render_docx.py 已保存到 d:/skill gallery/render_docx.py\n');

    console.log('✓ 所有文件爬取完成！');

  } catch (error) {
    console.error('✗ 爬取失败:', error.message);
  }
})();
