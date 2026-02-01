# 数据分析技能 (Data Analysis Skill)

## 简介

这是一个专注于Excel数据分析的Claude技能，提供从数据加载到报告生成的完整分析流程。

## 功能特性

✅ **数据预处理**
- 支持Excel文件（.xlsx, .xls）
- 自动处理缺失值
- 数据类型识别和转换

✅ **描述性统计**
- 均值、中位数、标准差
- 偏度、峰度分析
- 四分位数和变异系数

✅ **趋势分析**
- 移动平均
- 线性回归
- 增长率计算
- 季节性分析

✅ **异常检测**
- Z-score方法
- IQR方法
- 自动识别异常点

✅ **可视化**
- 折线图、柱状图、散点图
- 箱线图、饼图
- 可自定义样式和配色

✅ **报告生成**
- Markdown格式
- 图表自动嵌入
- 洞察和建议自动生成

## 安装依赖

```bash
pip install pandas numpy matplotlib scipy openpyxl
```

## 快速开始

### 1. 分析Excel文件

```bash
python scripts/analyze_excel.py sales_data.xlsx --output analysis.json
```

### 2. 计算描述性统计

```bash
python scripts/descriptive_stats.py analysis.json --output stats.json
```

### 3. 趋势分析

```bash
python scripts/trend_analysis.py analysis.json \
  --date-column "日期" \
  --value-column "销售额" \
  --period 7
```

### 4. 生成图表

```bash
python scripts/generate_charts.py analysis.json --output charts/
```

### 5. 生成报告

```bash
python scripts/generate_report.py analysis.json \
  --charts-dir charts/ \
  --output report.md
```

## 目录结构

```
data-analysis-skill/
├── SKILL.md                    # 技能核心文件（元数据）
├── README.md                   # 本说明文件
├── scripts/                    # 可执行脚本
│   ├── analyze_excel.py        # 数据加载与预处理
│   ├── descriptive_stats.py     # 描述性统计分析
│   ├── trend_analysis.py       # 趋势分析
│   ├── generate_charts.py      # 可视化生成
│   └── generate_report.py     # 报告生成
├── references/                 # 参考文档
│   ├── analysis_methods.md     # 分析方法详解
│   ├── chart_templates.md      # 图表模板指南
│   └── data_cleaning_guide.md  # 数据清洗指南
└── assets/                    # 资源文件
    ├── report_template.md      # Markdown报告模板
    └── chart_styles.json      # 图表样式配置
```

## 使用场景

### 场景1：销售数据分析

```bash
# 完整分析流程
python scripts/analyze_excel.py monthly_sales.xlsx --output sales_analysis.json
python scripts/trend_analysis.py sales_analysis.json \
  --date-column "日期" \
  --value-column "销售额" \
  --period 7
python scripts/generate_charts.py sales_analysis.json --output charts/
python scripts/generate_report.py sales_analysis.json \
  --charts-dir charts/ \
  --output sales_report.md
```

### 场景2：用户增长分析

```bash
# 描述性统计 + 趋势分析
python scripts/analyze_excel.py user_growth.xlsx --output user_data.json
python scripts/descriptive_stats.py user_data.json --output user_stats.json
python scripts/trend_analysis.py user_data.json \
  --date-column "注册日期" \
  --value-column "用户数"
python scripts/generate_charts.py user_data.json --output charts/
python scripts/generate_report.py user_data.json \
  --charts-dir charts/ \
  --output growth_report.md
```

### 场景3：财务对比分析

```bash
# 多列对比分析
python scripts/analyze_excel.py financial_data.xlsx --output financial_analysis.json
python scripts/descriptive_stats.py financial_analysis.json \
  --columns "收入,支出,利润" \
  --output financial_stats.json
python scripts/generate_charts.py financial_stats.json --output charts/
python scripts/generate_report.py financial_stats.json \
  --charts-dir charts/ \
  --output financial_report.md
```

## 脚本详细说明

### analyze_excel.py

数据加载和预处理脚本。

**功能**:
- 读取Excel文件
- 识别列类型
- 处理缺失值
- 标准化日期格式
- 生成数据结构摘要

**参数**:
- `--file`: Excel文件路径（必需）
- `--sheet`: 工作表名称（可选）
- `--output`: 输出JSON文件路径（默认：analysis_result.json）

**输出**: JSON格式的数据和分析摘要

### descriptive_stats.py

描述性统计分析脚本。

**功能**:
- 计算均值、中位数、标准差
- 计算偏度、峰度
- 计算四分位数
- 计算变异系数
- 生成统计摘要

**参数**:
- `--input`: 输入JSON文件（默认：analysis_result.json）
- `--columns`: 要分析的列名（逗号分隔，可选）
- `--output`: 输出文件路径（默认：descriptive_stats.json）

**输出**: JSON格式的统计指标

### trend_analysis.py

趋势分析脚本。

**功能**:
- 计算移动平均
- 线性回归分析
- 计算增长率
- 异常值检测
- 季节性分析

**参数**:
- `--input`: 输入JSON文件
- `--date-column`: 日期列名（必需）
- `--value-column`: 值列名（必需）
- `--period`: 移动平均周期（默认：7）
- `--output`: 输出文件路径（默认：trend_analysis.json）

**输出**: JSON格式的趋势分析结果

### generate_charts.py

可视化生成脚本。

**功能**:
- 生成折线图
- 生成柱状图
- 生成散点图
- 生成箱线图
- 自动根据数据类型选择合适的图表

**参数**:
- `--input`: 输入JSON文件（必需）
- `--output`: 输出目录（默认：charts/）
- `--type`: 图表类型（可选）

**输出**: PNG格式的图表文件

### generate_report.py

Markdown报告生成脚本。

**功能**:
- 汇总分析结果
- 嵌入可视化图表
- 生成洞察和建议
- 应用报告模板

**参数**:
- `--input`: 输入JSON文件（必需）
- `--charts-dir`: 图表目录（可选）
- `--output`: 输出报告路径（默认：analysis_report.md）
- `--template`: 报告模板文件（可选）

**输出**: Markdown格式的分析报告

## 自定义配置

### 修改图表样式

编辑 `assets/chart_styles.json` 文件：

```json
{
  "color_palette": {
    "primary": "#3498DB",
    "secondary": "#2ECC71"
  },
  "font": {
    "family": "SimHei",
    "size": {
      "title": 16
    }
  }
}
```

### 自定义报告模板

编辑 `assets/report_template.md` 文件，添加自定义章节和格式。

### 添加新的分析方法

参考 `references/analysis_methods.md`，在相应的脚本中添加新的分析方法。

## 常见问题

**Q: 支持哪些Excel版本？**

A: 支持 .xlsx 和 .xls 格式，需要安装 openpyxl 或 xlrd。

**Q: 如何处理大数据文件？**

A: 使用采样参数：
```bash
python scripts/analyze_excel.py large_file.xlsx --sample 10000
```

**Q: 图表字体显示为方框怎么办？**

A: 确保系统安装了中文字体，或修改 `chart_styles.json` 中的字体设置。

**Q: 如何添加自定义分析方法？**

A: 1. 在 `references/analysis_methods.md` 中添加说明
   2. 在相应的脚本中实现方法
   3. 更新 `generate_report.py` 以显示新结果

**Q: 报告中的图表路径不对怎么办？**

A: 确保在 `generate_report.py` 中指定正确的 `--charts-dir` 参数，路径应相对于报告文件。

## 技术支持

- **文档**: 查阅 `references/` 目录下的详细文档
- **示例**: 查看 `assets/example_analysis.md`（如存在）
- **问题反馈**: 提交Issue或Pull Request

## 更新日志

### v1.0.0 (2026-01-27)
- 初始版本发布
- 支持Excel数据加载
- 实现描述性统计
- 实现趋势分析
- 实现图表生成
- 实现Markdown报告生成

## 许可证

本技能遵循项目的主许可证。

## 贡献

欢迎贡献！请：
1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

---

**Made with ❤️ by Data Analysis Skill**
