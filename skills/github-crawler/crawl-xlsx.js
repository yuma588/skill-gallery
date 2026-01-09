import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // 定义要爬取的文件列表
    const files = [
      'https://github.com/anthropics/skills/blob/main/skills/xlsx/recalc.py',
      'https://github.com/anthropics/skills/blob/main/skills/xlsx/SKILL.md',
      'https://github.com/anthropics/skills/blob/main/skills/xlsx/LICENSE.txt'
    ];

    const outputDir = 'd:/skill gallery/skills/xlsx-SKILL';
    const owner = 'anthropics';
    const repo = 'skills';
    const branch = 'main';

    console.log('开始爬取 xlsx skill 文件...\n');

    for (const fileUrl of files) {
      console.log(`正在爬取: ${fileUrl}`);

      try {
        // 从 URL 中提取文件路径
        const filePath = fileUrl.split(`${owner}/${repo}/blob/${branch}/`)[1];

        if (!filePath) {
          throw new Error(`无法解析文件路径: ${fileUrl}`);
        }

        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
        console.log(`  Raw URL: ${rawUrl}`);

        const response = await fetch(rawUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();
        const fileName = path.basename(fileUrl);
        const outputPath = path.join(outputDir, fileName);

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, content);

        console.log(`✓ 成功爬取 ${fileName} (${content.length} 字节)`);
        console.log(`  保存到: ${outputPath}\n`);

        // 添加延迟避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`✗ 爬取失败: ${path.basename(fileUrl)}`);
        console.error(`  错误: ${error.message}`);
        console.error(`  堆栈: ${error.stack}\n`);
      }
    }

    console.log('✓ 爬取完成！');

  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
