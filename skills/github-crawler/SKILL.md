---
name: github-crawler
description: GitHub 网页爬虫工具，支持爬取文件内容和 README 文档
tool_name: github_crawler
category: web-crawling
priority: 8
tags: ["github", "web-scraping", "data-extraction", "files", "readme"]
version: 1.0
---

# GitHub Crawler Skill

一个用于爬取 GitHub 仓库内容的网页爬虫工具，支持提取文件代码和 README 文档。

## 功能

- ✅ 爬取任意 GitHub 仓库的文件代码
- ✅ 爬取仓库的 README.md 文档
- ✅ 自动处理 GitHub 网页结构
- ✅ 支持私有仓库（需要认证）
- ✅ 错误重试机制

## 使用方法

### 调用格式

```json
{
  "action": "use_github_crawler",
  "parameters": {
    "mode": "fetch_file",
    "url": "https://github.com/user/repo",
    "path": "path/to/file.js"
  }
}
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | string | 是 | 爬取模式：`fetch_file` 或 `fetch_readme` |
| `url` | string | 是 | GitHub 仓库 URL 或文件 URL |
| `path` | string | 否 | 文件路径（仅在 `fetch_file` 模式下需要） |

### 模式说明

#### 模式 1: fetch_file

爬取指定路径的文件代码内容。

```json
{
  "mode": "fetch_file",
  "url": "https://github.com/facebook/react",
  "path": "packages/react/src/React.js"
}
```

**返回结果：**
```javascript
// 文件的原始代码内容
import invariant from 'shared/invariant';
import warningWithoutStack from 'shared/warningWithoutStack';
// ...
```

#### 模式 2: fetch_readme

爬取仓库的 README.md 文档。

```json
{
  "mode": "fetch_readme",
  "url": "https://github.com/facebook/react"
}
```

**返回结果：**
```markdown
# React

A JavaScript library for building user interfaces.

## Features

- Declarative: React makes it painless to create interactive UIs
- Component-Based: Build encapsulated components
// ...
```

## 示例代码

### Node.js 使用示例

```javascript
const { GitHubCrawler } = require('./index.js');

// 创建爬虫实例
const crawler = new GitHubCrawler();

// 爬取 README
(async () => {
  try {
    const readme = await crawler.fetchReadme('https://github.com/facebook/react');
    console.log(readme);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

// 爬取文件
(async () => {
  try {
    const file = await crawler.fetchFile(
      'https://github.com/facebook/react',
      'packages/react/src/React.js'
    );
    console.log(file);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

## 注意事项

1. **请求限制** - GitHub 可能对频繁请求进行限制，建议添加适当的延迟
2. **私有仓库** - 需要提供 GitHub Token 才能访问私有仓库
3. **文件路径** - 文件路径必须相对于仓库根目录
4. **错误处理** - 建议使用 try-catch 处理可能的错误

## 错误类型

| 错误类型 | 说明 |
|----------|------|
| `InvalidURLError` | 无效的 GitHub URL |
| `FileNotFoundError` | 文件不存在 |
| `ParseError` | HTML 解析失败 |
| `RateLimitError` | 请求频率超限 |

## 许可证

MIT
