# Skills 索引

这里是所有可用 skills 的统一索引。每个 skill 都是独立的功能模块，可以在对话中调用。

## 📚 Skills 列表

### 1. Frontend Frameworks Skill
**路径**: `frontend-frameworks/SKILL.md`

**描述**: 现代 Web 前端框架支持，包括 React、Vue、Angular 和 Svelte。

**优先级**: 7

**分类**: development

**支持的框架**:
- React - 用于构建用户界面的 JavaScript 库
- Vue - 渐进式 JavaScript 框架
- Angular - 企业级 Web 应用框架
- Svelte - 编译时框架，生成高效代码

**使用场景**:
- 创建新的前端项目
- 添加组件和功能
- 状态管理
- 路由配置
- API 集成

---

### 2. Firecrawl Skill
**路径**: `firecrawl/SKILL.md`

**描述**: 多功能网页抓取和数据提取工具，支持爬取、转换和抓取整个网站。

**优先级**: 7

**分类**: web-crawling

**核心功能**:
- **Scrape**: 爬取单个 URL 并提取所有内容（包括转换为 Markdown）
- **Crawl**: 爬取整个网站并提取所有可访问子页面
- **Map**: 遍历整个网站并识别所有可访问 URL

**支持的内容类型**:
- 文本内容（转换为 Markdown）
- 图片（Base64 编码）
- 链接和元数据

**使用场景**:
- 提取网站内容
- 数据挖掘
- 网站分析
- 内容归档

---

### 3. Frontend Design Skill
**路径**: `frontend-design/SKILL.md`

**描述**: 创建独特、生产级的前端界面，专注于精美的设计和最佳的用户体验。

**优先级**: -

**分类**: design

**包含文件**:
- `app.js` - 应用逻辑
- `data.js` - 数据管理
- `index.html` - 主页面
- `modal.js` - 模态框组件
- `styles.css` - 样式表

**设计原则**:
- 美观现代的 UI
- 最佳 UX 实践
- 响应式设计
- 生产级代码质量

**使用场景**:
- 设计新的前端界面
- 改进现有 UI
- 添加交互组件
- 样式优化

---

### 4. GitHub Crawler Skill
**路径**: `github-crawler/SKILL.md`

**描述**: GitHub 网页爬虫，用于提取 GitHub 仓库的文件和 README 内容。

**优先级**: 8

**分类**: web-crawling

**核心功能**:
- 抓取 GitHub 仓库的文件列表
- 提取 README 文件内容
- 解析文件结构和元数据

**项目结构**:
```
github-crawler/
├── index.js          # 主入口文件
├── package.json      # 项目配置
├── README.md         # 项目说明
├── SKILL.md          # Skill 配置
├── examples/
│   ├── crawl-file.js     # 文件抓取示例
│   └── crawl-readme.js   # README 抓取示例
└── utils/
    ├── fetcher.js        # 数据抓取
    ├── parser.js         # 数据解析
    └── helpers.js        # 辅助函数
```

**使用示例**:
```javascript
// 抓取 README
node examples/crawl-readme.js

// 抓取文件列表
node examples/crawl-file.js
```

**使用场景**:
- 分析 GitHub 仓库
- 提取项目文档
- 收集代码示例
- 仓库数据挖掘

---

## 🚀 快速开始

### 如何使用 Skills

1. **在对话中提及**: 直接在对话中提到相关的 skill，系统会自动加载
2. **触发关键词**: 使用特定关键词可以触发对应的 skill
3. **查看文档**: 每个 skill 目录下都有详细的 SKILL.md 文档

### 示例

```
# 前端框架
"帮我创建一个 React 组件"
"使用 Vue 添加路由"

# Firecrawl
"爬取这个网站的内容"
"提取所有子页面链接"

# 前端设计
"设计一个漂亮的登录页面"
"添加模态框组件"

# GitHub Crawler
"抓取这个仓库的文件"
"提取 README 内容"
```

## 📊 Skills 概览

| Skill 名称 | 分类 | 优先级 | 文件数量 | 描述 |
|-----------|------|--------|---------|------|
| frontend-frameworks | development | 7 | 1 | 现代前端框架支持 |
| firecrawl | web-crawling | 7 | 1 | 网页抓取工具 |
| frontend-design | design | - | 6 | 前端界面设计 |
| github-crawler | web-crawling | 8 | 9 | GitHub 数据爬虫 |

## 🔗 相关资源

- [项目根目录](../)
- [Firecrawl 官方文档](https://docs.firecrawl.dev)
- [GitHub API 文档](https://docs.github.com/en/rest)

---

**最后更新**: 2026-01-06
