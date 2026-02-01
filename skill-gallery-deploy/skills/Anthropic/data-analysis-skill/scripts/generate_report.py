#!/usr/bin/env python3
"""
生成Markdown分析报告
将分析结果转换为结构化的Markdown报告
"""

import sys
import json
from pathlib import Path
from datetime import datetime

def load_json(file_path):
    """加载JSON分析结果"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_markdown_report(data, charts_dir=None, output_path='report.md'):
    """
    生成Markdown报告

    Args:
        data: 分析结果数据
        charts_dir: 图表目录
        output_path: 输出文件路径

    Returns:
        str: Markdown内容
    """
    md = []

    # 标题
    md.append("# 数据分析报告\n")
    md.append(f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    md.append("---\n\n")

    # 数据概要
    if 'structure' in data:
        structure = data['structure']
        md.append("## 数据概要\n\n")
        md.append(f"- **文件路径**: `{data['file_path']}`\n")
        md.append(f"- **总行数**: {structure['total_rows']:,}\n")
        md.append(f"- **总列数**: {structure['total_columns']}\n")
        md.append(f"- **内存占用**: {structure['memory_usage']:.2f} KB\n\n")

        md.append("### 列信息\n\n")
        md.append("| 列名 | 类型 | 缺失值 |\n")
        md.append("|------|------|--------|\n")
        for col in structure['column_names']:
            col_type = structure['data_types'][col]
            missing = structure['missing_values'][col]
            md.append(f"| {col} | {col_type} | {missing} |\n")
        md.append("\n")

    # 描述性统计
    if 'statistics' in data:
        md.append("## 描述性统计分析\n\n")

        for col, stats in data['statistics'].items():
            md.append(f"### {col}\n\n")
            md.append("| 指标 | 值 |\n")
            md.append("|------|-----|\n")
            md.append(f"| 计数 | {stats['count']:,} |\n")
            md.append(f"| 均值 | {stats['mean']:.4f} |\n")
            md.append(f"| 中位数 | {stats['median']:.4f} |\n")
            md.append(f"| 标准差 | {stats['std']:.4f} |\n")
            md.append(f"| 最小值 | {stats['min']:.4f} |\n")
            md.append(f"| 最大值 | {stats['max']:.4f} |\n")
            md.append(f"| 四分位数 | Q1={stats['q25']:.4f}, Q3={stats['q75']:.4f} |\n")
            md.append(f"| 偏度 | {stats['skewness']:.4f} |\n")
            md.append(f"| 峰度 | {stats['kurtosis']:.4f} |\n")
            md.append(f"| 变异系数 | {stats['cv']:.4f if stats['cv'] else 'N/A'} |\n\n")

        # 统计摘要
        if 'summary' in data:
            summary = data['summary']
            md.append("### 统计摘要\n\n")

            if summary['high_cv_columns']:
                md.append("#### 高变异系数列\n\n")
                for item in summary['high_cv_columns']:
                    md.append(f"- **{item['column']}**: CV = {item['cv']:.4f}\n")
                md.append("\n")

            if summary['high_skewness_columns']:
                md.append("#### 高偏度列\n\n")
                for item in summary['high_skewness_columns']:
                    skew_dir = "正偏" if item['skewness'] > 0 else "负偏"
                    md.append(f"- **{item['column']}**: 偏度 = {item['skewness']:.4f} ({skew_dir})\n")
                md.append("\n")

    # 趋势分析
    if 'moving_average' in data or 'growth_rate' in data:
        md.append("## 趋势分析\n\n")

        if 'date_range' in data:
            date_range = data['date_range']
            md.append(f"**分析时间范围**: {date_range['start']} 至 {date_range['end']}\n")
            md.append(f"**数据点数**: {data['data_points']:,}\n")
            md.append(f"**移动平均周期**: {data['period']} 天\n\n")

        # 趋势线分析
        if 'trend_line' in data:
            trend = data['trend_line']
            md.append("### 趋势线\n\n")
            md.append(f"- **斜率**: {trend['slope']:.6f}\n")
            md.append(f"- **截距**: {trend['intercept']:.6f}\n")
            md.append(f"- **R²**: {trend['r_squared']:.6f}\n")

            # 趋势判断
            if trend['slope'] > 0:
                md.append("**趋势**: 上升 📈\n\n")
            elif trend['slope'] < 0:
                md.append("**趋势**: 下降 📉\n\n")
            else:
                md.append("**趋势**: 平稳 ➡️\n\n")

        # 增长率
        if 'growth_rate' in data:
            growth = data['growth_rate']
            md.append("### 增长率分析\n\n")
            md.append(f"- **平均增长率**: {growth['mean']:.2f}%\n")
            md.append(f"- **标准差**: {growth['std']:.2f}%\n")
            md.append(f"- **最高增长率**: {growth['max']:.2f}%\n")
            md.append(f"- **最低增长率**: {growth['min']:.2f}%\n\n")

        # 异常值
        if 'anomalies' in data:
            anomalies = data['anomalies']
            md.append(f"### 异常值检测\n\n")
            md.append(f"检测到 **{anomalies['count']}** 个异常值 (Z-score > {anomalies['threshold']})\n\n")

        # 季节性
        if 'seasonality' in data:
            seasonality = data['seasonality']
            md.append("### 季节性分析\n\n")
            md.append("检测到周期性模式。")

    # 插入图表
    if charts_dir:
        md.append("## 可视化图表\n\n")

        charts_path = Path(charts_dir)
        if charts_path.exists():
            chart_files = list(charts_path.glob('*.png'))
            for chart_file in sorted(chart_files):
                chart_name = chart_file.stem
                md.append(f"### {chart_name.replace('_', ' ').title()}\n\n")
                md.append(f"![{chart_name}]({charts_dir}/{chart_file.name})\n\n")

    # 洞察和建议
    md.append("## 洞察与建议\n\n")

    # 生成基于数据的洞察
    insights = generate_insights(data)
    for insight in insights:
        md.append(f"### {insight['title']}\n\n")
        md.append(f"{insight['description']}\n\n")

        if 'actions' in insight:
            md.append("**建议行动**:\n\n")
            for action in insight['actions']:
                md.append(f"- {action}\n")
            md.append("\n")

    # 页脚
    md.append("---\n\n")
    md.append("*此报告由数据分析技能自动生成*\n")

    return '\n'.join(md)

def generate_insights(data):
    """
    基于分析结果生成洞察

    Args:
        data: 分析数据

    Returns:
        list: 洞察列表
    """
    insights = []

    # 统计洞察
    if 'statistics' in data:
        stats = data['statistics']
        summary = data.get('summary', {})

        # 高变异系数
        if summary.get('high_cv_columns'):
            cols = [item['column'] for item in summary['high_cv_columns']]
            insights.append({
                'title': '数据波动性分析',
                'description': f"以下列具有较高的变异性（CV > 0.3）：{', '.join(cols)}。这意味着这些指标在不同时间或样本间波动较大。",
                'actions': [
                    '调查波动原因：是否存在异常事件或季节性影响',
                    '考虑使用更稳定的指标作为替代',
                    '增加样本量以减少随机波动的影响'
                ]
            })

        # 高偏度
        if summary.get('high_skewness_columns'):
            skew_items = [item for item in summary['high_skewness_columns'] if item['skewness'] > 1]
            if skew_items:
                cols = [item['column'] for item in skew_items]
                insights.append({
                    'title': '数据分布偏斜',
                    'description': f"以下列呈现正偏态分布：{', '.join(cols)}。数据存在少量极端高值。",
                    'actions': [
                        '考虑对数转换或其他变换方法使数据更对称',
                        '使用中位数而非均值作为中心趋势指标',
                        '检查并处理异常值'
                    ]
                })

    # 趋势洞察
    if 'trend_line' in data:
        trend = data['trend_line']
        if abs(trend['r_squared']) > 0.7:
            if trend['slope'] > 0:
                insights.append({
                    'title': '强劲增长趋势',
                    'description': f"数据显示强劲的上升趋势（R² = {trend['r_squared']:.4f}）。增长率为每期 {trend['slope']:.6f} 单位。",
                    'actions': [
                        '分析增长驱动因素，确定可复制的关键成功要素',
                        '预测未来趋势并制定相应计划',
                        '监测增长是否可持续'
                    ]
                })
            elif trend['slope'] < 0:
                insights.append({
                    'title': '下降趋势警示',
                    'description': f"数据显示明显的下降趋势（R² = {trend['r_squared']:.4f}）。下降率为每期 {abs(trend['slope']):.6f} 单位。",
                    'actions': [
                        '立即调查下降原因',
                        '采取干预措施减缓或扭转下降趋势',
                        '制定应急计划应对持续下降'
                    ]
                })

    # 增长率洞察
    if 'growth_rate' in data:
        growth = data['growth_rate']
        if growth['std'] > 2 * abs(growth['mean']):
            insights.append({
                'title': '增长波动较大',
                'description': f"增长率波动较大（标准差 = {growth['std']:.2f}%），平均增长率为 {growth['mean']:.2f}%。",
                'actions': [
                    '分析波动周期和原因',
                    '建立预警机制监测异常波动',
                    '制定应对不同增长情景的策略'
                ]
            })

    # 异常值洞察
    if 'anomalies' in data and data['anomalies']['count'] > 0:
        anomalies = data['anomalies']
        if anomalies['count'] > 10:
            insights.append({
                'title': '异常值较多',
                'description': f"检测到 {anomalies['count']} 个异常值，占总数据的较高比例。",
                'actions': [
                    '逐一检查每个异常值，判断是否为真实异常或数据错误',
                    '如为数据错误，进行修正',
                    '如为真实异常，分析原因并制定应对策略'
                ]
            })

    return insights

def save_markdown(content, output_path):
    """
    保存Markdown报告

    Args:
        content: Markdown内容
        output_path: 输出路径
    """
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # 解析命令行参数
    input_path = sys.argv[1] if len(sys.argv) > 1 else None
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'analysis_report.md'
    charts_dir = sys.argv[sys.argv.index('--charts-dir') + 1] if '--charts-dir' in sys.argv and sys.argv.index('--charts-dir') + 1 < len(sys.argv) else None

    if not input_path:
        print("错误: 请指定输入文件")
        print("用法: python generate_report.py --input <file> [--output <file>] [--charts-dir <dir>]")
        sys.exit(1)

    print(f"📄 生成报告")
    print(f"   输入: {input_path}")
    print(f"   输出: {output_path}")
    if charts_dir:
        print(f"   图表目录: {charts_dir}")

    # 加载数据
    data = load_json(input_path)

    # 生成Markdown报告
    md_content = generate_markdown_report(data, charts_dir, output_path)

    # 保存报告
    save_markdown(md_content, output_path)
    print(f"✓ 报告已生成: {output_path}")
    print(f"   字符数: {len(md_content):,}")

if __name__ == '__main__':
    main()
