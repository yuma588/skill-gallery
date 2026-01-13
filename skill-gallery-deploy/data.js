// Skills data from skillsmp.com
const skillsData = [
    // Tools
    
    {
        id: "dev-1",
        name: "Algorithmic Art",
        description: "Create stunning generative art using p5.js with seeded randomness and interactive parameter exploration. From algorithmic philosophies to interactive visualizations.",
        category: "anthropics",
        icon: "🎨",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/algorithmic-art-SKILL/algorithmic-art-SKILL.md",
        resources: [
            {
                name: "algorithmic-art-SKILL.md",
                description: "Main skill documentation with complete workflow and philosophy creation guide",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/algorithmic-art-SKILL/algorithmic-art-SKILL.md"
            },
            {
                name: "viewer.html",
                description: "Interactive viewer template for generative art with Anthropic branding",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/algorithmic-art-SKILL/templates/viewer.html"
            },
            {
                name: "generator_template.js",
                description: "p5.js best practices and code structure reference for generative art",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/algorithmic-art-SKILL/templates/generator_template.js"
            }
        ]
    },
    {
        id: "dev-2",
        name: "Frontend Design",
        description: "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code and UI design that avoids generic AI aesthetics. Focus on bold aesthetic directions, unique typography, cohesive color themes, and memorable visual details.",
        category: "anthropics",
        icon: "✨",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/frontend-design-SKILL/frontend-design-SKILL-crawled.md",
        resources: [
            {
                name: "frontend-design-SKILL-crawled.md",
                description: "Crawled skill documentation with detailed frontend aesthetics principles",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/frontend-design-SKILL/frontend-design-SKILL-crawled.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the frontend design skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/frontend-design-SKILL/frontend-design-LICENSE-crawled.txt"
            }
        ]
    },
    {
        id: "dev-3",
        name: "MCP Builder",
        description: "Create high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Comprehensive development guide for TypeScript and Python SDK with best practices, tool design, error handling, and evaluation workflows.",
        category: "anthropics",
        icon: "🔧",
        gradient: "var(--gradient-2)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/SKILL.md",
        resources: [
            {
                name: "mcp-builder-SKILL.md",
                description: "Complete MCP server development guide with four-phase workflow, implementation patterns, and evaluation guidelines",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/SKILL.md"
            },
            {
                name: "mcp_best_practices.md",
                description: "MCP best practices covering server naming, response formats, pagination, transport selection, and security standards",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/reference/mcp_best_practices.md"
            },
            {
                name: "node_mcp_server.md",
                description: "TypeScript implementation guide with project structure, Zod schema patterns, and complete working examples",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/reference/node_mcp_server.md"
            },
            {
                name: "python_mcp_server.md",
                description: "Python implementation guide with FastMCP patterns, Pydantic models, and complete working examples",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/reference/python_mcp_server.md"
            },
            {
                name: "evaluation.md",
                description: "Evaluation guide for testing MCP server effectiveness with 10-question methodology",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/reference/evaluation.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the MCP builder skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/mcp-builder-SKILL/LICENSE.txt"
            }
        ]
    },
    {
        id: "dev-4",
        name: "Skill Creator",
        description: "Guide for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations. Six-step creation process: Understanding the skill with concrete examples, planning reusable contents (scripts, references, assets), initializing with init_skill.py, editing the skill with best practices, packaging into distributable .skill files, and iterating based on real usage feedback.",
        category: "anthropics",
        icon: "⚙️",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Main skill documentation with core principles, skill anatomy, progressive disclosure design, and complete six-step creation workflow",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/SKILL.md"
            },
            {
                name: "workflows.md",
                description: "Detailed reference for multi-step processes and conditional logic in skill design",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/references/workflows.md"
            },
            {
                name: "output-patterns.md",
                description: "Template and example patterns for consistent output formats and quality standards",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/references/output-patterns.md"
            },
            {
                name: "init_skill.py",
                description: "Python script to initialize a new skill with proper directory structure and SKILL.md template",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/scripts/init_skill.py"
            },
            {
                name: "package_skill.py",
                description: "Python script to package a skill into a distributable .skill file with automatic validation",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/scripts/package_skill.py"
            },
            {
                name: "quick_validate.py",
                description: "Python script for quick validation of skill structure and frontmatter requirements",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/scripts/quick_validate.py"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the skill creator",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/skill-creator-SKILL/LICENSE.txt"
            }
        ]
    },
    {
        id: "dev-5",
        name: "Web Artifacts Builder",
        description: "Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Perfect for complex artifacts requiring state management, routing, or shadcn/ui components. Includes init and bundle scripts with pre-configured React 18 + TypeScript + Vite + Parcel + Tailwind CSS 3.4.1 + 40+ shadcn/ui components.",
        category: "anthropics",
        icon: "🚀",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Complete documentation with quick start guide, design guidelines, and usage instructions",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/SKILL.md"
            },
            {
                name: "init-artifact.sh",
                description: "Initialization script to create React + TypeScript + Tailwind + shadcn/ui project with all dependencies and 40+ components",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/scripts/init-artifact.sh"
            },
            {
                name: "bundle-artifact.sh",
                description: "Bundling script to package React app into single HTML artifact with all code inlined",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/scripts/bundle-artifact.sh"
            },
            {
                name: "shadcn-components.tar.gz",
                description: "40+ pre-installed shadcn/ui components (Button, Card, Dialog, Form, Table, etc.) ready to use",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/scripts/shadcn-components.tar.gz"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the Web Artifacts Builder skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/web-artifacts-builder-SKILL/LICENSE.txt"
            }
        ]
    },
    // Data & AI
    {
        id: "ai-1",
        name: "XLSX",
        description: "Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .tsv, etc) for: (1) Creating new spreadsheets with formulas and formatting, (2) Reading or analyzing data, (3) Modify existing spreadsheets while preserving formulas, (4) Data analysis and visualization in spreadsheets, or (5) Recalculating formulas",
        category: "anthropics",
        icon: "📊",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/xlsx-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Main skill documentation with comprehensive guide for Excel operations, formulas, formatting, and best practices",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/xlsx-SKILL/SKILL.md"
            },
            {
                name: "recalc.py",
                description: "Python script to recalculate Excel formulas using LibreOffice with error detection and reporting",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/xlsx-SKILL/recalc.py"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the xlsx skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/xlsx-SKILL/LICENSE.txt"
            }
        ]
    },
   
    // Testing & Security
    {
        id: "security-1",
        name: "Web Application Testing",
        description: "Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.",
        category: "anthropics",
        icon: "🌐",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Main skill documentation with complete web application testing guide",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/SKILL.md"
            },
            {
                name: "with_server.py",
                description: "Helper script for managing server lifecycle during testing",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/scripts/with_server.py"
            },
            {
                name: "element_discovery.py",
                description: "Example script for discovering buttons, links, and inputs",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/examples/element_discovery.py"
            },
            {
                name: "console_logging.py",
                description: "Example script for capturing console logs during automation",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/examples/console_logging.py"
            },
            {
                name: "static_html_automation.py",
                description: "Example script for automating local HTML files",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/examples/static_html_automation.py"
            },
            {
                name: "LICENSE.txt",
                description: "Apache License 2.0 terms and conditions for using the Web Application Testing skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/webapp-testing-SKILL/LICENSE.txt"
            }
        ]
    },
    
    // Documentation
    {
        id: "docs-1",
        name: "Doc Co-Authoring",
        description: "Guide users through a structured workflow for collaborative document creation. Three-stage process: Context Gathering (clarify requirements and gather information), Refinement & Structure (build section by section through brainstorming and editing), and Reader Testing (test document with fresh perspective to catch blind spots). Perfect for writing technical specs, proposals, decision docs, and similar structured content.",
        category: "anthropics",
        icon: "✏️",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/doc-coauthoring-SKILL/doc-coauthoring-SKILL.md",
        resources: [
            {
                name: "doc-coauthoring-SKILL.md",
                description: "Main skill documentation with complete three-stage workflow guide including detailed instructions for context gathering, refinement, and reader testing phases",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/doc-coauthoring-SKILL/doc-coauthoring-SKILL.md"
            }
        ]
    },
    {
        id: "docs-2",
        name: "Internal Communications",
        description: "A set of resources to help write all kinds of internal communications, using the formats that your company likes to use. Perfect for 3P updates (Progress, Plans, Problems), company newsletters, FAQ responses, status reports, leadership updates, project updates, and incident reports.",
        category: "anthropics",
        icon: "💬",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/internal-comms-SKILL-crawled.md",
        resources: [
            {
                name: "internal-comms-SKILL.md",
                description: "Main skill documentation with complete instructions for writing various internal communications",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/internal-comms-SKILL-crawled.md"
            },
            {
                name: "3p-updates.md",
                description: "Template and guidelines for Progress/Plans/Problems team updates",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/examples/3p-updates.md"
            },
            {
                name: "company-newsletter.md",
                description: "Template and guidelines for company-wide newsletters",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/examples/company-newsletter.md"
            },
            {
                name: "faq-answers.md",
                description: "Template and guidelines for answering frequently asked questions",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/examples/faq-answers.md"
            },
            {
                name: "general-comms.md",
                description: "Guidelines for general internal communications",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/examples/general-comms.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/internal-comms-SKILL/internal-comms-LICENSE-crawled.txt"
            }
        ]
    },
    {
        id: "docs-3",
        name: "PDF Processing",
        description: "Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale.",
        category: "anthropics",
        icon: "📄",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Main skill documentation with PDF processing workflow and examples",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md"
            },
            {
                name: "forms.md",
                description: "Detailed guide for filling PDF forms programmatically",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/forms.md"
            },
            {
                name: "reference.md",
                description: "Advanced reference documentation with complete API examples",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/LICENSE.txt"
            },
            {
                name: "check_bounding_boxes.py",
                description: "Utility to check and validate PDF form field bounding boxes",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/check_bounding_boxes.py"
            },
            {
                name: "check_fillable_fields.py",
                description: "Simple script to identify fillable form fields in a PDF",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/check_fillable_fields.py"
            },
            {
                name: "convert_pdf_to_images.py",
                description: "Convert PDF pages to images for OCR or analysis",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/convert_pdf_to_images.py"
            },
            {
                name: "create_validation_image.py",
                description: "Create a validation image to verify form field coordinates",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/create_validation_image.py"
            },
            {
                name: "extract_form_field_info.py",
                description: "Extract detailed information about all form fields in a PDF",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/extract_form_field_info.py"
            },
            {
                name: "fill_fillable_fields.py",
                description: "Fill PDF forms programmatically with data",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/fill_fillable_fields.py"
            },
            {
                name: "fill_pdf_form_with_annotations.py",
                description: "Advanced form filling with annotation support",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pdf-skills/scripts/fill_pdf_form_with_annotations.py"
            }
        ]
    },
    {
        id: "docs-4",
        name: "DOCX",
        description: "Comprehensive DOCX (Word) document creation, reading, and review guidance with python-docx and LibreOffice rendering. Supports creating professional documents with consistent formatting, visual inspection via PDF→PNG conversion, and quality control for client-ready outputs. Perfect for technical docs, reports, proposals, and any document requiring professional styling.",
        category: "chatgpt",
        icon: "📄",
        gradient: "var(--gradient-2)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/docx/skill.md",
        resources: [
            {
                name: "skill.md",
                description: "Main skill documentation with DOCX reading, creation, and review guidelines including rendering workflow and quality expectations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/docx/skill.md"
            },
            {
                name: "render_docx.py",
                description: "Python script for rendering DOCX files to PNG images with automatic DPI calculation and LibreOffice conversion",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/docx/render_docx.py"
            }
        ]
    },
    {
        id: "docs-5",
        name: "PDF",
        description: "Comprehensive PDF reading, creation, and review guidance. Use pdftoppm to convert PDF to PNG for visual inspection, pdfplumber for text extraction, and reportlab for PDF creation. Ensure professional-grade document quality, consistent layout, and zero visual defects. Perfect for processing, generating, or analyzing PDF documents.",
        category: "chatgpt",
        icon: "📄",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/pdfs/skill.md",
        resources: [
            {
                name: "skill.md",
                description: "Main skill documentation with PDF reading, creation, and review guidelines including rendering workflow and quality expectations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/pdfs/skill.md"
            }
        ]
    },
    {
        id: "docs-6",
        name: "Spreadsheets",
        description: "Comprehensive spreadsheet creation, editing, and analysis with openpyxl and artifact_tool. Support for formulas, formatting, data analysis, and visualization. Use this skill when working with spreadsheets (.xlsx, .csv, .tsv) for: Creating new workbooks with proper formulas and formatting, Reading or analyzing tabular data, Modifying existing workbooks while preserving formulas, Visualizing data with charts, or Recalculating formulas.",
        category: "chatgpt",
        icon: "📊",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/skill.md",
        resources: [
            {
                name: "skill.md",
                description: "Main skill documentation with comprehensive guidelines for spreadsheet operations, formulas, formatting, and best practices using openpyxl and artifact_tool",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/skill.md"
            },
            {
                name: "spreadsheet.md",
                description: "Quick reference guide for spreadsheet operations with artifact_tool library",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/spreadsheet.md"
            },
            {
                name: "artifact_tool_spreadsheets_api.md",
                description: "Complete API documentation for artifact_tool spreadsheet operations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/artifact_tool_spreadsheets_api.md"
            },
            {
                name: "artifact_tool_spreadsheet_formulas.md",
                description: "Detailed formula reference for spreadsheet calculations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/artifact_tool_spreadsheet_formulas.md"
            },
            {
                name: "create_basic_spreadsheet.py",
                description: "Example: Create a basic spreadsheet with data and formulas",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/create_basic_spreadsheet.py"
            },
            {
                name: "create_spreadsheet_with_styling.py",
                description: "Example: Create a spreadsheet with professional styling and formatting",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/create_spreadsheet_with_styling.py"
            },
            {
                name: "read_existing_spreadsheet.py",
                description: "Example: Read and analyze data from existing spreadsheet",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/read_existing_spreadsheet.py"
            },
            {
                name: "styling_spreadsheet.py",
                description: "Example: Apply various styling options to spreadsheet cells",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/styling_spreadsheet.py"
            },
            {
                name: "create_bar_chart.py",
                description: "Example: Create bar charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_bar_chart.py"
            },
            {
                name: "create_line_chart.py",
                description: "Example: Create line charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_line_chart.py"
            },
            {
                name: "create_pie_chart.py",
                description: "Example: Create pie charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_pie_chart.py"
            },
            {
                name: "create_area_chart.py",
                description: "Example: Create area charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_area_chart.py"
            },
            {
                name: "create_doughnut_chart.py",
                description: "Example: Create doughnut charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_doughnut_chart.py"
            },
            {
                name: "set_cell_fills.py",
                description: "Example: Apply cell background colors and fills",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_cell_fills.py"
            },
            {
                name: "set_cell_borders.py",
                description: "Example: Apply cell borders and border styles",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_cell_borders.py"
            },
            {
                name: "set_font_styles.py",
                description: "Example: Apply font styles, colors, and effects",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_font_styles.py"
            },
            {
                name: "set_number_formats.py",
                description: "Example: Format numbers, dates, currencies, and percentages",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_number_formats.py"
            },
            {
                name: "set_conditional_formatting.py",
                description: "Example: Apply conditional formatting rules",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_conditional_formatting.py"
            },
            {
                name: "set_text_alignment.py",
                description: "Example: Set text alignment and orientation",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_text_alignment.py"
            },
            {
                name: "set_cell_width_height.py",
                description: "Example: Adjust cell widths and row heights",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_cell_width_height.py"
            },
            {
                name: "set_merge_cells.py",
                description: "Example: Merge and unmerge cells",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_merge_cells.py"
            },
            {
                name: "set_wrap_text_styles.py",
                description: "Example: Configure text wrapping settings",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/set_wrap_text_styles.py"
            },
            {
                name: "create_tables.py",
                description: "Example: Create and format data tables",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/create_tables.py"
            },
            {
                name: "cite_cells.py",
                description: "Example: Add citations and references to cells",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/cite_cells.py"
            },
            {
                name: "change_existing_charts.py",
                description: "Example: Modify existing charts in spreadsheets",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/chatgpt/spreadsheets/examples/features/change_existing_charts.py"
            }
        ]
    },
    // Content & Media
    {
        id: "media-1",
        name: "PPTX Presentation",
        description: "Create professional PowerPoint presentations with html2pptx and PptxGenJS. Support for rich text, charts, tables, images, and custom styling.",
        category: "anthropics",
        icon: "📊",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pptx/pptx-SKILL.md",
        resources: [
            {
                name: "pptx-SKILL.md",
                description: "Main PPTX skill documentation covering all features and workflows",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pptx/pptx-SKILL.md"
            },
            {
                name: "html2pptx.md",
                description: "Complete guide for converting HTML to PowerPoint presentations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pptx/html2pptx.md"
            },
            {
                name: "ooxml.md",
                description: "Office Open XML technical reference for advanced PPTX editing",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/pptx/ooxml.md"
            }
        ]
    },
    {
        id: "media-2",
        name: "Brand Guidelines",
        description: "Apply Anthropic's official brand colors and typography to any sort of artifact. Includes color palette (dark #141413, light #faf9f5, mid gray #b0aea5, light gray #e8e6dc), accent colors (orange #d97757, blue #6a9bcc, green #788c5d), and typography system (Poppins for headings, Lora for body text). Use for consistent visual identity across presentations, web pages, and documents.",
        category: "anthropics",
        icon: "🎨",
        gradient: "var(--gradient-2)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/brand-guidelines-SKILL/brand-guidelines-SKILL.md",
        resources: [
            {
                name: "brand-guidelines-SKILL.md",
                description: "Main skill documentation with complete brand guidelines, color palette, typography system, and usage instructions",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/brand-guidelines-SKILL/brand-guidelines-SKILL.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the brand guidelines skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/brand-guidelines-SKILL/LICENSE.txt"
            }
        ]
    },
    {
        id: "media-3",
        name: "Slack GIF Creator",
        description: "Create animated GIFs optimized for Slack with pulse, particle, and various animation effects. Includes GIFBuilder, easing functions, and comprehensive animation concepts for Slack emoji and message GIFs. Supports shake, bounce, spin, fade, slide, zoom, explode animations with PIL drawing primitives.",
        category: "anthropics",
        icon: "🎬",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Complete guide for creating Slack-optimized GIFs with animation concepts, utilities, and optimization strategies",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/SKILL.md"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the Slack GIF Creator skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/LICENSE.txt"
            },
            {
                name: "gif_builder.py",
                description: "GIFBuilder class that assembles frames and optimizes for Slack requirements",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/core/gif_builder.py"
            },
            {
                name: "easing.py",
                description: "Easing functions (linear, ease_in, ease_out, bounce_out, elastic_out, back_out) for smooth animations",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/core/easing.py"
            },
            {
                name: "frame_composer.py",
                description: "Helper functions for creating frames, gradients, shapes, and text rendering",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/core/frame_composer.py"
            },
            {
                name: "validators.py",
                description: "Validation utilities to check if GIF meets Slack requirements",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/core/validators.py"
            },
            {
                name: "requirements.txt",
                description: "Python dependencies (pillow, imageio, numpy) for the Slack GIF Creator skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/slack-gif-creator-SKILL/requirements.txt"
            }
        ]
    },
    {
        id: "media-4",
        name: "Theme Factory",
        description: "Toolkit for styling artifacts with professional themes. Features 10 pre-set curated themes (Ocean Depths, Sunset Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation, Botanical Garden, Midnight Galaxy) with carefully selected color palettes and font pairings. Apply consistent, professional styling to presentation slide decks, documents, reports, and HTML landing pages. Each theme includes cohesive colors, complementary fonts, and distinct visual identity for different contexts and audiences.",
        category: "anthropics",
        icon: "🎭",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Main skill documentation with complete theme library, usage instructions, and custom theme creation guide",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/SKILL.md"
            },
            {
                name: "theme-showcase.pdf",
                description: "Visual showcase of all 10 professional themes with color palettes and font pairings",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/theme-showcase.pdf"
            },
            {
                name: "LICENSE.txt",
                description: "Complete license terms and conditions for using the Theme Factory skill",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/LICENSE.txt"
            },
            {
                name: "ocean-depths.md",
                description: "Professional maritime theme with deep navy blues and teal accents",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/ocean-depths.md"
            },
            {
                name: "sunset-boulevard.md",
                description: "Warm and vibrant sunset colors with orange and pink hues",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/sunset-boulevard.md"
            },
            {
                name: "forest-canopy.md",
                description: "Natural and grounded earth tones with forest greens",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/forest-canopy.md"
            },
            {
                name: "modern-minimalist.md",
                description: "Clean and contemporary grayscale with charcoal and grays",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/modern-minimalist.md"
            },
            {
                name: "golden-hour.md",
                description: "Rich and warm autumnal palette with golden tones",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/golden-hour.md"
            },
            {
                name: "arctic-frost.md",
                description: "Cool and crisp winter-inspired theme with icy blues",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/arctic-frost.md"
            },
            {
                name: "desert-rose.md",
                description: "Soft and sophisticated dusty tones with rose hues",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/desert-rose.md"
            },
            {
                name: "tech-innovation.md",
                description: "Bold and modern tech aesthetic with vibrant colors",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/tech-innovation.md"
            },
            {
                name: "botanical-garden.md",
                description: "Fresh and organic garden colors with green and floral hues",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/botanical-garden.md"
            },
            {
                name: "midnight-galaxy.md",
                description: "Dramatic and cosmic deep tones with purple and blue accents",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/Anthropic/theme-factory-SKILL/themes/midnight-galaxy.md"
            }
        ]
    },
    // Lifestyle
    
    // Community
    {
        id: "community-superpower-1",
        name: "Brainstorming",
        description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation.",
        category: "community",
        subCategory: "superpower",
        icon: "💡",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/brainstorming/brainstorming-SKILL.md",
        resources: [
            {
                name: "brainstorming-SKILL.md",
                description: "Complete brainstorming workflow with collaborative dialogue, design exploration, and incremental validation principles",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/brainstorming/brainstorming-SKILL.md"
            }
        ]
    },
    {
        id: "community-superpower-2",
        name: "Dispatching Parallel Agents",
        description: "Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies.",
        category: "community",
        subCategory: "superpower",
        icon: "🚀",
        gradient: "var(--gradient-2)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/dispatching-parallel-agents/dispatching-parallel-agents-SKILL.md",
        resources: [
            {
                name: "dispatching-parallel-agents-SKILL.md",
                description: "Complete guide for dispatching parallel agents to handle independent tasks without shared state or sequential dependencies",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/dispatching-parallel-agents/dispatching-parallel-agents-SKILL.md"
            }
        ]
    },
    {
        id: "community-superpower-3",
        name: "Executing Plans",
        description: "Use when you have a written implementation plan to execute in a separate session with review checkpoints",
        category: "community",
        subCategory: "superpower",
        icon: "📋",
        gradient: "var(--gradient-3)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/executing-plans/executing-plans-SKILL.md",
        resources: [
            {
                name: "executing-plans-SKILL.md",
                description: "Complete executing plans workflow with batch execution and checkpoint reviews",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/executing-plans/executing-plans-SKILL.md"
            }
        ]
    },
    {
        id: "community-superpower-4",
        name: "Finishing a Development Branch",
        description: "Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup",
        category: "community",
        subCategory: "superpower",
        icon: "🏁",
        gradient: "var(--gradient-4)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/finishing-a-development-branch/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Complete guide for finishing development branches with verification, options presentation, and workflow execution",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/finishing-a-development-branch/SKILL.md"
            }
        ]
    },
    {
        id: "community-superpower-5",
        name: "Receiving Code Review",
        description: "Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation",
        category: "community",
        subCategory: "superpower",
        icon: "🔍",
        gradient: "var(--gradient-1)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/receiving-code-review/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Complete guide for receiving and responding to code review feedback with technical rigor and verification",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/receiving-code-review/SKILL.md"
            }
        ]
    },
    {
        id: "community-superpower-6",
        name: "Requesting Code Review",
        description: "Use when completing tasks, implementing major features, or before merging to verify work meets requirements",
        category: "community",
        subCategory: "superpower",
        icon: "📝",
        gradient: "var(--gradient-2)",
        sourceUrl: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/requesting-code-review/SKILL.md",
        resources: [
            {
                name: "SKILL.md",
                description: "Complete guide for requesting code review with git SHAs, subagent dispatch, and feedback handling",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/requesting-code-review/SKILL.md"
            },
            {
                name: "code-reviewer.md",
                description: "Template for code review subagent with placeholders for implementation details and requirements",
                path: "https://raw.githubusercontent.com/yuma588/skill-gallery/main/skill-gallery-deploy/skills/community/superpower/requesting-code-review/code-reviewer.md"
            }
        ]
    },
    
    // Blockchain
    
];

// Category emojis
const categoryEmojis = {
    "anthropics": "🤖",
    "chatgpt": "💬",
    "community": "🌍"
};
