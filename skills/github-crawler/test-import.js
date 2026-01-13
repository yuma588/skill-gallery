try {
  const { GitHubCrawler } = await import('./index.js');
  console.log('Module imported successfully');

  const crawler = new GitHubCrawler();
  console.log('Crawler created');

  const content = await crawler.fetchFile('https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md');
  console.log('Success!');
  console.log('Content length:', content.length);
  console.log('First 100 chars:', content.substring(0, 100));
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
