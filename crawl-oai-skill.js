/**
 * 爬取 eliasjudin/oai-skills 仓库中的 skill.md 文件
 */

import { use_github_crawler } from './skills/github-crawler/index.js';
import { writeFileSync } from 'fs';

async function crawlSkillFile() {
  try {
    console.log('开始爬取 skill.md 文件...\n');

    // 使用 github-crawler skill 爬取文件
    const skillContent = await use_github_crawler({
      mode: 'fetch_file',
      url: 'https://github.com/eliasjudin/oai-skills',
      path: 'pdfs/skill.md'
    });

    console.log('\n文件内容获取成功！');
    console.log(`内容长度: ${skillContent.length} 字符\n`);

    // 将内容保存到文件
    const outputPath = 'oai-skills-crawled.md';
    writeFileSync(outputPath, skillContent, 'utf-8');
    console.log(`✓ 文件已保存到: ${outputPath}`);

    // 输出文件内容的前500个字符作为预览
    console.log('\n--- 文件预览 (前500字符) ---');
    console.log(skillContent.substring(0, 500));
    console.log('--- 预览结束 ---\n');

    return skillContent;

  } catch (error) {
    console.error('✗ 爬取失败:', error.message);
    throw error;
  }
}

// 执行爬取
crawlSkillFile()
  .then(() => {
    console.log('✓ 爬取任务完成');
  })
  .catch((error) => {
    console.error('✗ 爬取任务失败:', error.message);
    process.exit(1);
  });
