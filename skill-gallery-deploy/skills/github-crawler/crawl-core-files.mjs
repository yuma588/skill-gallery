import { GitHubCrawler } from './index.js';
import fs from 'fs';
import path from 'path';

async function crawlCoreFiles() {
  const crawler = new GitHubCrawler();

  const files = [
    {
      url: 'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/core/easing.py',
      outputPath: 'd:/frontend-design/skills/slack-gif-creator-SKILL/core/easing.py'
    },
    {
      url: 'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/core/frame_composer.py',
      outputPath: 'd:/frontend-design/skills/slack-gif-creator-SKILL/core/frame_composer.py'
    },
    {
      url: 'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/core/gif_builder.py',
      outputPath: 'd:/frontend-design/skills/slack-gif-creator-SKILL/core/gif_builder.py'
    },
    {
      url: 'https://github.com/anthropics/skills/blob/main/skills/slack-gif-creator/core/validators.py',
      outputPath: 'd:/frontend-design/skills/slack-gif-creator-SKILL/core/validators.py'
    }
  ];

  console.log('开始爬取核心文件...\n');

  for (const file of files) {
    try {
      console.log(`正在爬取: ${file.url}`);
      const content = await crawler.fetchFile(file.url);
      
      // 确保目录存在
      const dir = path.dirname(file.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(file.outputPath, content, 'utf8');
      console.log(`✅ 已保存到: ${file.outputPath}\n`);
    } catch (error) {
      console.error(`❌ 爬取失败: ${file.url}`);
      console.error(`   错误: ${error.message}\n`);
    }
  }

  console.log('所有文件爬取完成！');
}

crawlCoreFiles().catch(console.error);
