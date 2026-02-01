# 基于pdf-skills的PDF表格提取工具

## 📌 关于此工具

这个工具严格按照 `skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md` 文档中的代码示例创建。

## 📁 文件清单

| 文件名 | 说明 |
|:---|:---|
| `extract_tables_from_skill.py` | 主脚本（基于pdf-skills） |
| `使用说明_基于pdf-skills.md` | 详细使用指南 |
| `代码对比.md` | 与pdf-skills原始代码的对比 |
| `run_skill_version.bat` | Windows一键启动脚本 |

## 🚀 快速开始

### 方法1：使用批处理脚本（推荐）
双击运行 `run_skill_version.bat`

### 方法2：命令行运行
```bash
cd "d:\skill gallery"
python extract_tables_from_skill.py
```

## 📊 预期输出

运行后会在 `d:\skill gallery` 目录生成：
- ✅ `chinese_document_tables_skill.xlsx` - Excel格式
- ✅ `chinese_document_tables_skill.csv` - CSV格式

## 🔍 与pdf-skills的关系

### 参考来源
`skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md` 第102-119行

### 代码特点
- ✅ 使用相同的库：`pdfplumber`, `pandas`
- ✅ 保持相同的表格提取逻辑
- ✅ 遵循相同的编码风格
- ✅ 添加了必要的日志和错误处理

### 主要差异
- 添加了进度显示和详细日志
- 同时导出Excel和CSV格式
- 添加了单行表格的处理
- 使用UTF-8 BOM编码确保中文正常显示

## 💡 技术说明

### 核心算法
```python
# 1. 打开PDF
with pdfplumber.open(pdf_path) as pdf:
    # 2. 遍历每一页
    for page in pdf.pages:
        # 3. 提取表格
        tables = page.extract_tables()
        # 4. 转换为DataFrame并收集
        df = pd.DataFrame(table[1:], columns=table[0])
        all_tables.append(df)

# 5. 合并所有表格
combined_df = pd.concat(all_tables, ignore_index=True)

# 6. 导出文件
combined_df.to_excel("output.xlsx", index=False)
```

### 依赖库
- `pdfplumber` - PDF文本和表格提取（pdf-skills推荐）
- `pandas` - 数据处理和合并（pdf-skills推荐）
- `openpyxl` - Excel文件写入

## ⚠️ 环境要求

1. **Python 3.6+**
   - 检查：`python --version`

2. **依赖库**
   ```bash
   pip install pdfplumber pandas openpyxl
   ```

## 📚 参考文档

详细代码对比请查看：`代码对比.md`

详细使用说明请查看：`使用说明_基于pdf-skills.md`

## 🎯 特点

- ✅ **完全基于pdf-skills示例**
- ✅ **简洁直接，易于理解**
- ✅ **自动合并所有表格**
- ✅ **双重导出格式**
- ✅ **详细的处理日志**

这个工具展示了如何将pdf-skills文档中的示例代码转化为实际可用的工具。
