# PDF表格提取工具 - 使用指南

## 📋 方案选择

我为你准备了**两个方案**来提取PDF表格数据：

### 方案一：JavaScript方案（推荐）
**优点**：无需安装Python，使用npm即可
**状态**：已完成脚本，但需要验证
**适合**：已有Node.js环境的用户

### 方案二：Python方案（最可靠）
**优点**：对中文支持最好，pdfplumber库专门用于PDF表格提取
**状态**：脚本已就绪
**适合**：需要高准确度的用户

---

## 🚀 方案一：JavaScript方案使用方法

### 步骤1：安装依赖
```bash
cd "d:\skill gallery"
npm install pdf-parse
```

### 步骤2：运行提取脚本
```bash
node extract_tables.js
```

### 步骤3：查看结果
提取完成后，会在 `d:\skill gallery` 目录生成以下文件：
- `chinese_document_tables.csv` - CSV格式表格数据
- `chinese_document_tables.json` - JSON格式数据
- `chinese_document_report.txt` - 提取报告

---

## 🐍 方案二：Python方案使用方法（推荐）

### 步骤1：安装Python依赖
打开命令提示符（CMD）或PowerShell，运行：
```bash
cd "d:\skill gallery"
pip install pdfplumber pandas openpyxl
```

### 步骤2：运行提取脚本
```bash
python extract_tables.py
```

### 步骤3：查看结果
提取完成后，会生成：
- `chinese_document_tables.xlsx` - Excel文件，每个表格一个工作表
- `chinese_document_tables.csv` - CSV格式备份
- `chinese_document_report.txt` - 详细提取报告

---

## 📁 快速启动脚本

### Windows批处理脚本（Python方案）
双击运行 `run_extract_tables.bat` 即可自动完成所有步骤。

### PowerShell脚本（Python方案）
```powershell
cd "d:\skill gallery"
powershell -ExecutionPolicy Bypass -File extract_tables.ps1
```

---

## ⚠️ 常见问题

### 问题1：中文乱码
**现象**：提取的文本显示为乱码
**解决**：使用Python方案（pdfplumber对中文支持更好）

### 问题2：表格识别不准确
**现象**：提取的表格结构不正确
**解决**：
- 检查PDF是否为扫描版（需要OCR）
- 尝试调整提取参数（Python方案可自定义）
- 使用Adobe Acrobat等专业工具先转换PDF

### 问题3：命令无法执行
**现象**：python或npm命令不存在
**解决**：
- Python：从 https://python.org 下载安装
- Node.js：从 https://nodejs.org 下载安装

---

## 💡 技术说明

### JavaScript方案使用的库
- `pdf-parse` - PDF文本提取
- `fs` - 文件系统操作
- `path` - 路径处理

### Python方案使用的库
- `pdfplumber` - PDF文本和表格提取（专门为表格提取设计）
- `pandas` - 数据处理和分析
- `openpyxl` - Excel文件写入

---

## 📊 预期输出

根据 `chinese_document.pdf` 的内容预览，该文档包含：
- 2页内容
- 主题：中国传统文化概述
- 预期表格：1个关于传统节日的表格

表格可能包含：
- 节日名称
- 日期
- 主要习俗

---

## 🎯 建议

**如果追求最佳效果**：使用Python方案
**如果方便快速**：使用JavaScript方案

两个方案都会生成CSV和JSON文件，可以在Excel、Notepad++等软件中打开查看。

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. 使用的方案（Python或JavaScript）
2. 完整的错误信息
3. PDF文件的基本信息（页数、大小）

我会帮你解决问题！
