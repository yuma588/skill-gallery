/**
 * 爬取 PDF Skill 的四个文件 - 简化版
 */
import { GitHubCrawler } from './index.js';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../pdf-skills');

async function ensureOutputDir() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function saveFile(filename, content) {
  const filePath = path.join(outputDir, filename);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

async function main() {
  console.log('Starting to fetch PDF Skill files...\n');

  try {
    await ensureOutputDir();

    const crawler = new GitHubCrawler();

    const files = [
      { url: 'https://github.com/anthropics/skills/blob/main/skills/pdf/LICENSE.txt', path: 'skills/pdf/LICENSE.txt', name: 'LICENSE.txt' },
      { url: 'https://github.com/anthropics/skills/blob/main/skills/pdf/SKILL.md', path: 'skills/pdf/SKILL.md', name: 'SKILL.md' },
      { url: 'https://github.com/anthropics/skills/blob/main/skills/pdf/forms.md', path: 'skills/pdf/forms.md', name: 'forms.md' },
      { url: 'https://github.com/anthropics/skills/blob/main/skills/pdf/reference.md', path: 'skills/pdf/reference.md', name: 'reference.md' }
    ];

    for (const file of files) {
      console.log(`Fetching ${file.name}...`);
      const content = await crawler.fetchFile(file.url, file.path);
      await saveFile(file.name, content);
      console.log(`Saved ${file.name} (${content.length} chars)\n`);
    }

    console.log('All files saved successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
