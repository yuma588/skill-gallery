import { GitHubCrawler } from './index.js';
import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const crawler = new GitHubCrawler();

async function downloadBinaryFile(rawUrl, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(rawUrl, (response) => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          fs.writeFile(outputPath, Buffer.concat(chunks))
            .then(resolve)
            .catch(reject);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

(async () => {
  const outputDir = 'd:\\skill gallery\\skills\\web-artifacts-builder-SKILL\\scripts';

  const files = [
    {
      name: 'bundle-artifact.sh',
      url: 'https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/scripts/bundle-artifact.sh'
    },
    {
      name: 'init-artifact.sh',
      url: 'https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/scripts/init-artifact.sh'
    },
    {
      name: 'shadcn-components.tar.gz',
      url: 'https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/scripts/shadcn-components.tar.gz',
      isBinary: true
    }
  ];

  console.log('开始爬取 web-artifacts-builder scripts 文件...\n');

  try {
    await fs.mkdir(outputDir, { recursive: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[${i + 1}/${files.length}] 正在爬取: ${file.name}`);

      try {
        if (file.isBinary) {
          const rawUrl = file.url
            .replace('github.com/', 'raw.githubusercontent.com/')
            .replace('/blob/', '/');
          await downloadBinaryFile(rawUrl, path.join(outputDir, file.name));
          const stats = await fs.stat(path.join(outputDir, file.name));
          console.log(`  ✓ 成功爬取 (${stats.size} 字节)`);
        } else {
          const content = await crawler.fetchFile(file.url);
          await fs.writeFile(path.join(outputDir, file.name), content, 'utf-8');
          console.log(`  ✓ 成功爬取 (${content.length} 字符)`);
        }
        console.log(`  ✓ 保存到: ${outputDir}\\${file.name}\n`);

        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`  ✗ 爬取失败: ${error.message}\n`);
      }
    }

    console.log('====================');
    console.log('所有文件爬取完成！');
    console.log('====================\n');

  } catch (error) {
    console.error('\n✗ 爬取失败:', error.message);
    process.exit(1);
  }
})();
