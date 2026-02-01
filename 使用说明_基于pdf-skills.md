# PDF表格提取工具（基于pdf-skills）

## 📌 说明

这个脚本是基于 `skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md` 文档中提供的代码示例创建的。

## 🔍 参考来源

代码参考自 `SKILL.md` 第102-119行的"Advanced Table Extraction"示例：

```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:  # Check if table is not empty
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

# Combine all tables
if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

## 🚀 使用方法

### 步骤1：确保已安装Python
在命令行运行：
```bash
python --version
```
如果显示版本号，说明已安装。

### 步骤2：安装依赖库
```bash
pip install pdfplumber pandas openpyxl
```

### 步骤3：运行脚本
```bash
cd "d:\skill gallery"
python extract_tables_from_skill.py
```

## 📁 输出文件

脚本会在 `d:\skill gallery` 目录生成：
- `chinese_document_tables_skill.xlsx` - Excel格式表格
- `chinese_document_tables_skill.csv` - CSV格式表格

## 🎯 脚本特点

1. ✅ **严格遵循pdf-skills示例** - 使用相同的库和方法
2. ✅ **简洁直接** - 只包含核心功能，没有额外复杂性
3. ✅ **自动合并表格** - 将所有表格合并到一个文件中
4. ✅ **双重导出** - 同时生成Excel和CSV文件
5. ✅ **详细日志** - 显示每个页面和表格的处理信息

## 📊 预期结果

根据PDF内容预览，应该能提取到关于**中国传统节日**的表格数据，包括：
- 节日名称
- 日期
- 主要习俗

## ⚠️ 如果Python不可用

如果你的系统没有Python环境，可以：
1. 从 https://python.org 下载并安装Python
2. 或者使用之前创建的JavaScript版本：`extract_tables.js`

## 💡 与之前脚本的区别

| 特性 | 之前的脚本 | 本脚本（基于pdf-skills） |
|:---|:---|:---|
| 代码来源 | 自定义实现 | 严格基于pdf-skills示例 |
| 复杂度 | 较高，包含类和错误处理 | 简洁，直接实现核心功能 |
| 表格合并 | 每个表格单独导出 | 所有表格合并到一个文件 |
| 代码风格 | 面向对象 | 过程式，符合示例风格 |

## 📚 技术栈

- `pdfplumber` - PDF文本和表格提取（pdf-skills推荐）
- `pandas` - 数据处理和合并（pdf-skills推荐）
- `openpyxl` - Excel文件写入

这个脚本展示了如何将pdf-skills文档中的代码示例转化为实际可用的工具。
