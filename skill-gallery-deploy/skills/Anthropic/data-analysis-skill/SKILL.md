---
name: data-analysis
description: 专注于Excel数据分析的技能，支持趋势分析、描述性统计分析和可视化图表生成。当用户上传Excel文件（.xlsx/.xls）或提出数据分析需求时使用此技能。能够从数据中提取有价值的洞察，生成结构化的Markdown分析报告，并提供可落地的行动建议。支持时间序列分析、统计指标计算和数据可视化展示。
---

# 数据分析技能

## 概述

本技能提供系统化的Excel数据分析能力，帮助用户从数据中提取有价值的洞察。通过自动化数据处理流程和可视化展示，生成易于理解的分析报告，支持数据驱动的决策制定。

## 快速开始

### 基本用法

1. **准备数据文件**
   - 支持格式：`.xlsx`、`.xls`
   - 确保数据包含明确的列标题
   - 时间序列数据需要规范的日期格式

2. **运行分析脚本**
   ```bash
   # 分析Excel文件
   python scripts/analyze_excel.py path/to/data.xlsx

   # 生成可视化图表
   python scripts/generate_charts.py --input analysis_result.json --output charts/

   # 生成Markdown报告
   python scripts/generate_report.py --input analysis_result.json --output report.md
   ```

3. **查看分析报告**
   - 报告以Markdown格式生成
   - 包含统计指标、趋势图表和洞察建议

## 核心工作流

### 1. 数据加载与预处理

```bash
python scripts/analyze_excel.py --file data.xlsx --output analysis.json
```

处理步骤：
- 读取Excel文件
- 识别数据类型和结构
- 处理缺失值和异常值
- 标准化日期格式

### 2. 描述性统计分析

使用 `scripts/descriptive_stats.py` 计算基础统计指标：

- **集中趋势**：均值、中位数、众数
- **离散程度**：标准差、方差、极差
- **分布特征**：偏度、峰度
- **数据范围**：最小值、最大值、四分位数

### 3. 趋势分析

使用 `scripts/trend_analysis.py` 分析时间序列数据：

- **时间趋势**：移动平均、趋势线
- **增长率**：环比、同比
- **季节性**：周期性模式识别
- **异常检测**：离群值识别

### 4. 可视化生成

使用 `scripts/generate_charts.py` 创建图表：

- **折线图**：趋势展示
- **柱状图**：对比分析
- **散点图**：相关性分析
- **箱线图**：分布分析

### 5. 报告生成

使用 `scripts/generate_report.py` 生成Markdown报告：

```python
python scripts/generate_report.py \
  --input analysis.json \
  --charts-dir charts/ \
  --output analysis_report.md \
  --template assets/report_template.md
```

## 资源使用指南

### 脚本目录 (scripts/)

| 脚本文件 | 功能描述 | 输入 | 输出 |
|---------|---------|------|------|
| `analyze_excel.py` | 数据加载与预处理 | Excel文件 | JSON数据 + 统计结果 |
| `descriptive_stats.py` | 描述性统计分析 | JSON数据 | 统计指标JSON |
| `trend_analysis.py` | 趋势分析 | JSON数据（时间序列） | 趋势分析结果 |
| `generate_charts.py` | 生成可视化图表 | 分析结果JSON | 图表文件（PNG/SVG） |
| `generate_report.py` | 生成Markdown报告 | 分析结果 + 图表 | Markdown报告 |

### 参考文档 (references/)

| 参考文档 | 内容 | 用途 |
|---------|------|------|
| `analysis_methods.md` | 分析方法详解和适用场景 | 选择合适的分析方法 |
| `chart_templates.md` | 图表类型和配置指南 | 选择最佳可视化方案 |
| `data_cleaning_guide.md` | 数据清洗最佳实践 | 处理数据质量问题 |

### 资源文件 (assets/)

| 资源文件 | 用途 |
|---------|------|
| `report_template.md` | Markdown报告模板 |
| `chart_styles.json` | 图表样式配置 |
| `example_analysis.md` | 分析报告示例 |

## 使用示例

### 示例 1：销售数据分析

```bash
# 分析销售数据
python scripts/analyze_excel.py sales_data.xlsx --output sales_analysis.json

# 趋势分析
python scripts/trend_analysis.py --input sales_analysis.json --date-column "日期" --value-column "销售额"

# 生成图表
python scripts/generate_charts.py --input sales_trend.json --type line --output charts/sales_trend.png

# 生成报告
python scripts/generate_report.py --input sales_trend.json --charts-dir charts/ --output sales_report.md
```

### 示例 2：用户增长分析

```bash
# 完整分析流程
python scripts/analyze_excel.py user_growth.xlsx --output user_data.json
python scripts/trend_analysis.py --input user_data.json --date-column "注册日期" --value-column "用户数" --metric "growth_rate"
python scripts/generate_charts.py --input user_data.json --type bar,line --output charts/
python scripts/generate_report.py --input user_data.json --charts-dir charts/ --output growth_report.md
```

### 示例 3：财务数据对比

```bash
# 描述性统计
python scripts/descriptive_stats.py --input financial_data.json --columns "收入,支出,利润"

# 生成对比图表
python scripts/generate_charts.py --input financial_stats.json --type bar --groupby "月份" --output charts/

# 生成综合报告
python scripts/generate_report.py --input financial_stats.json --charts-dir charts/ --output financial_report.md
```

## 分析能力详解

### 描述性统计

**适用场景**：了解数据分布特征

**指标说明**：
- **均值 (Mean)**：数据的平均水平
- **中位数 (Median)**：排序后中间值，抗异常值
- **标准差 (Std Dev)**：数据离散程度
- **四分位数 (Q1, Q2, Q3)**：数据分布位置

**使用方式**：
```bash
python scripts/descriptive_stats.py --input data.json --columns "销售额,访问量" --output stats.json
```

### 趋势分析

**适用场景**：分析时间序列数据的变动规律

**分析类型**：
- **移动平均**：平滑波动，识别趋势
- **增长率**：环比、同比增长率
- **趋势线**：线性回归拟合
- **季节性**：周期性模式识别

**使用方式**：
```bash
python scripts/trend_analysis.py \
  --input data.json \
  --date-column "日期" \
  --value-column "指标值" \
  --trend-type "moving_avg,linear_regression" \
  --period 7
```

### 可视化

**图表类型**：

| 图表类型 | 适用场景 | 参数 |
|---------|---------|------|
| 折线图 | 趋势展示 | `--type line` |
| 柱状图 | 对比分析 | `--type bar` |
| 散点图 | 相关性分析 | `--type scatter` |
| 箱线图 | 分布分析 | `--type boxplot` |
| 饼图 | 占比分析 | `--type pie` |

**使用方式**：
```bash
python scripts/generate_charts.py \
  --input analysis.json \
  --type line,bar \
  --x-column "日期" \
  --y-column "指标值" \
  --output charts/
```

## 高级功能

### 自定义分析

1. **修改统计指标**
   - 编辑 `references/analysis_methods.md` 添加自定义指标
   - 修改 `scripts/descriptive_stats.py` 计算逻辑

2. **自定义图表样式**
   - 编辑 `assets/chart_styles.json`
   - 配置颜色、字体、布局等样式

3. **定制报告模板**
   - 修改 `assets/report_template.md`
   - 添加自定义章节和格式

### 批量分析

分析多个文件：
```bash
# 批量处理
for file in data/*.xlsx; do
  python scripts/analyze_excel.py "$file" --output "output/$(basename $file .xlsx).json"
done

# 合并分析结果
python scripts/generate_report.py --input-dir output/ --output combined_report.md
```

### 自动化报告

结合定时任务自动生成报告：
```bash
# 每天自动分析
0 9 * * * python /path/to/scripts/analyze_excel.py daily_data.xlsx --output daily_analysis.json && python /path/to/scripts/generate_report.py --input daily_analysis.json --output reports/daily_$(date +\%Y\%m\%d).md
```

## 最佳实践

1. **数据准备**
   - 确保数据质量：处理缺失值、异常值
   - 使用规范的列名：避免特殊字符
   - 日期格式统一：YYYY-MM-DD

2. **分析方法选择**
   - 描述性统计：了解数据基本情况
   - 趋势分析：时间序列数据
   - 对比分析：多组数据对比
   - 相关性分析：探索变量关系

3. **可视化原则**
   - 选择合适的图表类型
   - 保持图表简洁清晰
   - 添加必要的图例和标注
   - 使用一致的颜色方案

4. **报告撰写**
   - 结构清晰：先总结，后详述
   - 图文结合：数据+图表+文字说明
   - 提供建议：基于分析结果的行动建议
   - 语言简洁：避免技术术语

## 常见问题

**Q: 如何处理包含多个工作表的Excel文件？**

A: 指定工作表名称：
```bash
python scripts/analyze_excel.py --file data.xlsx --sheet "销售数据" --output analysis.json
```

**Q: 可以分析非时间序列数据吗？**

A: 可以，使用描述性统计分析：
```bash
python scripts/descriptive_stats.py --input data.json --columns "所有列"
```

**Q: 如何自定义图表样式？**

A: 编辑 `assets/chart_styles.json` 文件，修改颜色、字体、尺寸等配置。

**Q: 报告可以导出为其他格式吗？**

A: 可以，使用Pandoc将Markdown转换为PDF、Word等格式：
```bash
pandoc report.md -o report.pdf
```

**Q: 如何处理大数据文件？**

A: 使用分块处理或采样：
```bash
python scripts/analyze_excel.py --file large_data.xlsx --sample 10000 --output sample_analysis.json
```

## 术语表

- **时间序列**：按时间顺序排列的数据
- **移动平均**：平滑时间序列数据的统计方法
- **环比**：与上一个相邻周期相比的变化率
- **同比**：与去年同期相比的变化率
- **离群值**：显著偏离其他观测值的数据点
- **偏度**：衡量数据分布不对称性的指标
- **峰度**：衡量数据分布尖峭程度的指标

## 相关技能

- `excel-processor`: 专门处理Excel文件的技能
- `data-visualization`: 数据可视化技能
- `report-generator`: 报告生成技能

## 反馈与贡献

如果您在使用过程中遇到问题或有改进建议，欢迎提交Issue或Pull Request。
