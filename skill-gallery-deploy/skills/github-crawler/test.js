import { GitHubCrawler } from './index.js';

console.log('测试 GitHubCrawler...');

const crawler = new GitHubCrawler();

crawler.fetchFile('https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/SKILL.md')
  .then(content => {
    console.log('成功！内容长度:', content.length);
    console.log('前100字符:', content.substring(0, 100));
  })
  .catch(err => {
    console.error('失败:', err.message);
    console.error(err);
  });
