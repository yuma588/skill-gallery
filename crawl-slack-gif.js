import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchFile(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // GitHub raw content selector
  const content = $('.blob-code, .LinesTable, .markdown-body, [data-target="readme-toc.content"]').text();
  
  if (!content) {
    // Fallback to raw GitHub URL
    const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    const rawResponse = await axios.get(rawUrl);
    return rawResponse.data;
  }
  
  return content.trim();
}

async function main() {
  const filesToCrawl = [
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/SKILL.md',
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/LICENSE.txt',
    'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/requirements.txt'
  ];

  const outputDir = 'd:/frontend-design/skills/slack-gif-creator-SKILL';

  try {
    await fs.mkdir(outputDir, { recursive: true });
    console.log('开始爬取文件...\n');

    for (let i = 0; i < filesToCrawl.length; i++) {
      const fileUrl = filesToCrawl[i];
      console.log(`[${i + 1}/${filesToCrawl.length}] 正在爬取: ${fileUrl}`);

      const content = await fetchFile(fileUrl);
      const fileName = path.basename(fileUrl);
      const outputPath = path.join(outputDir, fileName);

      await fs.writeFile(outputPath, content);
      console.log(`  ✓ 成功保存 ${fileName} (${content.length} 字符)\n`);

      if (i < filesToCrawl.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('✓ 所有文件爬取完成！');
    console.log(`\n文件已保存到: ${outputDir}`);

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
}

main();
