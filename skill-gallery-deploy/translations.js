// Translations for the Skill Gallery
const translations = {
    en: {
        // Sidebar
        fromSkillsMp: "From github.com/anthropics/skills",
        collection: "Collection",
        myFavorites: "⭐ My Favorites",
        
        // Categories
        allSkills: "✨ All Skills",
        anthropics: "Anthropic",
        chatgpt: "ChatGPT",
        
        
        // Header
        allSkillsTitle: "All Skills",
        allSkillsSubtitle: "Explore and discover powerful skills from Github",
        myFavoritesTitle: "My Favorites",
        myFavoritesSubtitle: "skills in your collection",
        categorySubtitle: "skills available in {category} (showing {count} samples)",
        
        // Empty state
        noSkillsFound: "No skills found",
        tryDifferentCategory: "Try selecting a different category or add some favorites",
        
        // Modal
        description: "Description",
        category: "Category",
        source: "Source",
        fromSkillsMpCom: "From github.com/anthropics/skills",
        externalLinks: "External Links",
        viewOnSkillsMp: "View on github.com/anthropics/skills",
        documentationFiles: "Documentation Files",
        documentation: "Documentation",
        visitSkillsMpFullDocs: "Visit the github.com/anthropics/skills page for full documentation and examples.",
        
        // Tabs
        overview: "Overview",
        skillmd: "SKILL.md",
        resources: "Resources",
        
        // Actions
        copyCode: "Copy Code",
        copied: "Copied!",
        downloadSkillMd: "Download SKILL.md",
        download: "Download",
        share: "Share",
        shareSuccess: "Shared successfully!",
        linkCopied: "Link copied!",

        // Skills translations
        skills: {
            'dev-1': {
                name: "Algorithmic Art",
                description: "Create stunning generative art using p5.js with seeded randomness and interactive parameter exploration. From algorithmic philosophies to interactive visualizations."
            },
            'dev-2': {
                name: "Frontend Design",
                description: "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code and UI design that avoids generic AI aesthetics. Focus on bold aesthetic directions, unique typography, cohesive color themes, and memorable visual details."
            },
            'dev-3': {
                name: "MCP Builder",
                description: "Create high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Comprehensive development guide for TypeScript and Python SDK with best practices, tool design, error handling, and evaluation workflows."
            },
            'dev-4': {
                name: "Skill Creator",
                description: "Guide for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations. Six-step creation process: Understanding the skill with concrete examples, planning reusable contents, initializing with init_skill.py, editing the skill with best practices, packaging into distributable .skill files, and iterating based on real usage feedback."
            },
            'dev-5': {
                name: "Web Artifacts Builder",
                description: "Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Perfect for complex artifacts requiring state management, routing, or shadcn/ui components. Includes init and bundle scripts with pre-configured React 18 + TypeScript + Vite + Parcel + Tailwind CSS 3.4.1 + 40+ shadcn/ui components."
            },
            'ai-1': {
                name: "XLSX",
                description: "Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .tsv, etc) for: Creating new spreadsheets with formulas and formatting, Reading or analyzing data, Modify existing spreadsheets while preserving formulas, Data analysis and visualization in spreadsheets, or Recalculating formulas"
            },
            'security-1': {
                name: "Web Application Testing",
                description: "Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs."
            },
            'docs-1': {
                name: "Doc Co-Authoring",
                description: "Guide users through a structured workflow for collaborative document creation. Three-stage process: Context Gathering (clarify requirements and gather information), Refinement & Structure (build section by section through brainstorming and editing), and Reader Testing (test document with fresh perspective to catch blind spots). Perfect for writing technical specs, proposals, decision docs, and similar structured content."
            },
            'docs-2': {
                name: "Internal Communications",
                description: "A set of resources to help write all kinds of internal communications, using the formats that your company likes to use. Perfect for 3P updates (Progress, Plans, Problems), company newsletters, FAQ responses, status reports, leadership updates, project updates, and incident reports."
            },
            'docs-3': {
                name: "PDF Processing",
                description: "Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale."
            },
            'media-1': {
                name: "PPTX Presentation",
                description: "Create professional PowerPoint presentations with html2pptx and PptxGenJS. Support for rich text, charts, tables, images, and custom styling."
            },
            'media-2': {
                name: "Brand Guidelines",
                description: "Apply Anthropic's official brand colors and typography to any sort of artifact. Includes color palette (dark #141413, light #faf9f5, mid gray #b0aea5, light gray #e8e6dc), accent colors (orange #d97757, blue #6a9bcc, green #788c5d), and typography system (Poppins for headings, Lora for body text). Use for consistent visual identity across presentations, web pages, and documents."
            },
            'media-3': {
                name: "Slack GIF Creator",
                description: "Create animated GIFs optimized for Slack with pulse, particle, and various animation effects. Includes GIFBuilder, easing functions, and comprehensive animation concepts for Slack emoji and message GIFs. Supports shake, bounce, spin, fade, slide, zoom, explode animations with PIL drawing primitives."
            },
            'media-4': {
                name: "Theme Factory",
                description: "Toolkit for styling artifacts with professional themes. Features 10 pre-set curated themes (Ocean Depths, Sunset Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation, Botanical Garden, Midnight Galaxy) with carefully selected color palettes and font pairings. Apply consistent, professional styling to presentation slide decks, documents, reports, and HTML landing pages. Each theme includes cohesive colors, complementary fonts, and distinct visual identity for different contexts and audiences."
            },
            'docs-4': {
                name: "DOCX",
                description: "Comprehensive DOCX (Word) document creation, reading, and review guidance with python-docx and LibreOffice rendering. Supports creating professional documents with consistent formatting, visual inspection via PDF→PNG conversion, and quality control for client-ready outputs. Perfect for technical docs, reports, proposals, and any document requiring professional styling."
            },
            'docs-5': {
                name: "PDF",
                description: "Comprehensive PDF reading, creation, and review guidance. Use pdftoppm to convert PDF to PNG for visual inspection, pdfplumber for text extraction, and reportlab for PDF creation. Ensure professional-grade document quality, consistent layout, and zero visual defects. Perfect for processing, generating, or analyzing PDF documents."
            },
            'docs-6': {
                name: "Spreadsheets",
                description: "Comprehensive spreadsheet creation, editing, and analysis with openpyxl and artifact_tool. Support for formulas, formatting, data analysis, and visualization. Use this skill when working with spreadsheets (.xlsx, .csv, .tsv) for: Creating new workbooks with proper formulas and formatting, Reading or analyzing tabular data, Modifying existing workbooks while preserving formulas, Visualizing data with charts, or Recalculating formulas."
            }
        }
    },
    zh: {
        // Sidebar
        fromSkillsMp: "来自 github.com/anthropics/skills",
        collection: "收藏",
        myFavorites: "⭐ 我的收藏",

        // Categories
        allSkills: "✨ 所有技能",
        anthropics: "Anthropic",
        chatgpt: "ChatGPT",
        tools: "工具",
        development: "开发",
        dataAi: "数据与AI",
        business: "商务",
        devOps: "DevOps",
        testingSecurity: "测试与安全",
        documentation: "文档",
        contentMedia: "内容与媒体",
        lifestyle: "生活方式",
        research: "研究",
        databases: "数据库",
        blockchain: "区块链",

        // Header
        allSkillsTitle: "所有技能",
        allSkillsSubtitle: "探索和发现来自 Github 的强大技能",
        myFavoritesTitle: "我的收藏",
        myFavoritesSubtitle: "个技能在你的收藏中",
        categorySubtitle: "个{category}技能可用 (显示{count}个示例)",

        // Empty state
        noSkillsFound: "未找到技能",
        tryDifferentCategory: "尝试选择不同的分类或添加收藏",

        // Modal
        description: "描述",
        category: "分类",
        source: "来源",
        fromSkillsMpCom: "来自 github.com/anthropics/skills",
        externalLinks: "外部链接",
        viewOnSkillsMp: "在 github.com/anthropics/skills 上查看",
        documentationFiles: "文档文件",
        documentation: "文档",
        visitSkillsMpFullDocs: "访问 github.com/anthropics/skills 页面获取完整文档和示例。",

        // Tabs
        overview: "概览",
        skillmd: "SKILL.md",
        resources: "资源",

        // Actions
        copyCode: "复制代码",
        copied: "已复制!",
        downloadSkillMd: "下载 SKILL.md",
        download: "下载",
        share: "分享",
        shareSuccess: "分享成功!",
        linkCopied: "链接已复制!",

        // Skills translations
        skills: {
            'dev-1': {
                name: "算法艺术",
                description: "使用p5.js创建惊艳的生成艺术,具有种子随机性和交互式参数探索。从算法哲学到交互式可视化。"
            },
            'dev-2': {
                name: "前端设计",
                description: "创建独特、生产级的高质量前端界面。生成富有创意、精美的代码和UI设计,避免通用的AI美学。专注于大胆的美学方向、独特的排版、连贯的色彩主题和令人难忘的视觉细节。"
            },
            'dev-3': {
                name: "MCP构建器",
                description: "创建高质量的MCP(模型上下文协议)服务器,使LLM能够通过精心设计的工具与外部服务交互。TypeScript和Python SDK的综合开发指南,包含最佳实践、工具设计、错误处理和评估工作流。"
            },
            'dev-4': {
                name: "技能创建器",
                description: "创建有效技能的指南,通过专业知识和工作流扩展Claude的功能。六步创建过程:通过具体示例理解技能、规划可重用内容(脚本、参考、资源)、使用init_skill.py初始化、使用最佳实践编辑技能、打包成可分发的.skill文件、基于实际使用反馈进行迭代。"
            },
            'dev-5': {
                name: "Web工件构建器",
                description: "使用现代前端Web技术(React、Tailwind CSS、shadcn/ui)创建复杂的多组件claude.ai HTML工件套件。非常适合需要状态管理、路由或shadcn/ui组件的复杂工件。包含init和bundle脚本,预配置了React 18 + TypeScript + Vite + Parcel + Tailwind CSS 3.4.1 + 40+ shadcn/ui组件。"
            },
            'ai-1': {
                name: "电子表格处理",
                description: "全面的电子表格创建、编辑和分析工具,支持公式、格式化、数据分析和可视化。当Claude需要处理电子表格(.xlsx、.xlsm、.csv、.tsv等)时使用:创建带公式和格式的新电子表格、读取或分析数据、修改现有电子表格同时保留公式、电子表格中的数据分析和可视化,或重新计算公式。"
            },
            'security-1': {
                name: "Web应用测试",
                description: "使用Playwright与本地Web应用程序交互和测试的工具包。支持验证前端功能、调试UI行为、捕获浏览器屏幕截图和查看浏览器日志。"
            },
            'docs-1': {
                name: "文档协作",
                description: "引导用户通过结构化工作流程进行协作文档创建。三阶段过程:上下文收集(明确需求并收集信息)、优化与结构(通过头脑风暴和编辑逐节构建)、读者测试(用全新视角测试文档以发现盲点)。非常适合编写技术规范、提案、决策文档和类似的结构化内容。"
            },
            'docs-2': {
                name: "内部沟通",
                description: "一套帮助撰写各种内部沟通的资源,使用贵公司喜欢的格式。非常适合3P更新(进度、计划、问题)、公司通讯、FAQ回复、状态报告、领导更新、项目更新和事件报告。"
            },
            'docs-3': {
                name: "PDF处理",
                description: "全面的PDF操作工具包,用于提取文本和表格、创建新PDF、合并/拆分文档以及处理表单。当Claude需要填写PDF表单或以编程方式处理、生成或分析PDF文档时使用。"
            },
            'media-1': {
                name: "PPTX演示文稿",
                description: "使用html2pptx和PptxGenJS创建专业的PowerPoint演示文稿。支持富文本、图表、表格、图像和自定义样式。"
            },
            'media-2': {
                name: "品牌指南",
                description: "将Anthropic的官方品牌颜色和排版应用于任何工件。包括色板(深色#141413、浅色#faf9f5、中灰色#b0aea5、浅灰色#e8e6dc)、强调色(橙色#d97757、蓝色#6a9bcc、绿色#788c5d)和排版系统(标题使用Poppins,正文使用Lora)。用于在演示文稿、网页和文档中保持一致的视觉标识。"
            },
            'media-3': {
                name: "Slack GIF创建器",
                description: "创建针对Slack优化的动画GIF,包含脉冲、粒子和各种动画效果。包括GIFBuilder、缓动函数以及Slack表情符号和消息GIF的综合动画概念。支持抖动、弹跳、旋转、淡入淡出、滑动、缩放、爆炸动画,使用PIL绘图原语。"
            },
            'media-4': {
                name: "主题工厂",
                description: "使用专业主题为工件设置样式的工具包。提供10个精心策划的预设主题(深海、日落大道、森林树冠、现代极简主义、黄金时刻、北极霜、沙漠玫瑰、科技创新、植物园、午夜银河),具有精心选择的色板和字体配对。对演示文稿幻灯片、文档、报告和HTML落地页应用一致、专业的样式。每个主题都包括连贯的色彩、互补的字体和针对不同语境和受众的独特视觉标识。"
            },
            'docs-4': {
                name: "DOCX文档处理",
                description: "全面的DOCX(Word)文档创建、读取和审查指南,使用python-docx和LibreOffice渲染。支持创建具有一致格式的专业文档,通过PDF→PNG转换进行视觉检查,以及客户就绪输出的质量控制。非常适合技术文档、报告、提案和任何需要专业样式的文档。"
            },
            'docs-5': {
                name: "PDF",
                description: "全面的PDF读取、创建和审查指南。使用pdftoppm将PDF转换为PNG进行视觉检查,使用pdfplumber提取文本,使用reportlab创建PDF。确保专业级文档质量、一致的布局和零视觉缺陷。适合处理、生成或分析PDF文档的场景。"
            },
            'docs-6': {
                name: "电子表格",
                description: "使用openpyxl和artifact_tool进行全面的电子表格创建、编辑和分析。支持公式、格式化、数据分析和可视化。当需要处理电子表格(.xlsx、.csv、.tsv)时使用此技能:创建带有正确公式和格式的新工作簿、读取或分析表格数据、修改现有工作簿同时保留公式、使用图表可视化数据,或重新计算公式。"
            }
        }
    }
};
