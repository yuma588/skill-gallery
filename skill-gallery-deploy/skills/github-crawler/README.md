# GitHub Crawler

一个用于爬取 GitHub 仓库内容的网页爬虫工具，支持提取文件代码和 README 文档。

## 安装

```bash
cd github-crawler
npm install
```

## 使用方法

### 1. 爬取 README 文档

```javascript
import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler();

(async () => {
  const readme = await crawler.fetchReadme('https://github.com/facebook/react');
  console.log(readme);
})();
```

### 2. 爬取文件内容

```javascript
import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler();

(async () => {
  // 方式 1: 提供仓库 URL 和文件路径
  const content = await crawler.fetchFile(
    'https://github.com/facebook/react',
    'packages/react/src/React.js'
  );

  // 方式 2: 提供完整的文件 URL
  const content = await crawler.fetchFile(
    'https://github.com/facebook/react/blob/main/packages/react/src/React.js'
  );

  console.log(content);
})();
```

### 3. 批量爬取多个文件

```javascript
import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler();

(async () => {
  const files = [
    { url: 'https://github.com/facebook/react', path: 'packages/react/index.js' },
    { url: 'https://github.com/facebook/react', path: 'packages/react-dom/index.js' }
  ];

  const results = await crawler.fetchMultipleFiles(files);
  console.log(results);
})();
```

## 运行示例

### 测试 README 爬取

```bash
npm run test:readme
```

### 测试文件爬取

```bash
npm run test:file
```

## API 接口

### use_github_crawler(params)

统一的 API 接口，适用于技能调用。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | string | 是 | 爬取模式：`fetch_file` 或 `fetch_readme` |
| `url` | string | 是 | GitHub 仓库 URL 或文件 URL |
| `path` | string | 否 | 文件路径（仅在 `fetch_file` 模式下需要） |

#### 示例

```javascript
import { use_github_crawler } from './index.js';

// 爬取 README
const readme = await use_github_crawler({
  mode: 'fetch_readme',
  url: 'https://github.com/facebook/react'
});

// 爬取文件
const file = await use_github_crawler({
  mode: 'fetch_file',
  url: 'https://github.com/facebook/react',
  path: 'packages/react/src/React.js'
});
```

## 高级功能

### 访问私有仓库

```javascript
import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler();
crawler.setToken('YOUR_GITHUB_TOKEN');

const content = await crawler.fetchFile('https://github.com/owner/private-repo', 'src/index.js');
```

### 自定义配置

```javascript
import { GitHubCrawler } from './index.js';

const crawler = new GitHubCrawler({
  timeout: 15000,      // 请求超时时间（毫秒）
  retries: 5,          // 重试次数
  retryDelay: 2000,    // 重试延迟（毫秒）
  token: 'your-token'  // GitHub Token
});
```

## 注意事项

1. **速率限制** - GitHub 可能对频繁请求进行限制，建议添加适当的延迟
2. **私有仓库** - 需要提供 GitHub Personal Access Token 才能访问
3. **文件路径** - 文件路径必须相对于仓库根目录
4. **错误处理** - 建议使用 try-catch 处理可能的错误

## 错误类型

| 错误类型 | 说明 |
|----------|------|
| `InvalidURLError` | 无效的 GitHub URL |
| `FileNotFoundError` | 文件不存在 |
| `ParseError` | HTML 解析失败 |
| `RateLimitError` | 请求频率超限 |

## 技术实现

- **HTTP 客户端**: Axios
- **HTML 解析**: Cheerio
- **双重策略**: 优先使用 raw URL，失败时回退到网页爬虫

## 许可证

MIT
