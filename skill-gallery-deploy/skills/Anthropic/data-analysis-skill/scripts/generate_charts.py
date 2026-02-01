#!/usr/bin/env python3
"""
生成可视化图表脚本
创建各种类型的统计图表
"""

import sys
import json
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # 使用非交互式后端
import numpy as np
from pathlib import Path

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def load_json(file_path):
    """加载JSON分析结果"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_line_chart(data, x_column, y_column, output_path, title=None):
    """
    创建折线图

    Args:
        data: 数据字典
        x_column: X轴列名
        y_column: Y轴列名
        output_path: 输出路径
        title: 图表标题
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    # 从数据中提取值
    x_values = list(data.keys())
    y_values = list(data.values())

    ax.plot(x_values, y_values, marker='o', linewidth=2, markersize=4)

    ax.set_xlabel(x_column, fontsize=12)
    ax.set_ylabel(y_column, fontsize=12)
    if title:
        ax.set_title(title, fontsize=14, fontweight='bold')

    ax.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def create_bar_chart(data, x_column, y_column, output_path, title=None):
    """
    创建柱状图

    Args:
        data: 数据字典
        x_column: X轴列名
        y_column: Y轴列名
        output_path: 输出路径
        title: 图表标题
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    # 从数据中提取值
    x_values = list(data.keys())
    y_values = list(data.values())

    bars = ax.bar(x_values, y_values, color='steelblue', edgecolor='navy', alpha=0.8)

    # 在柱状图上添加数值标签
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.2f}',
                ha='center', va='bottom', fontsize=10)

    ax.set_xlabel(x_column, fontsize=12)
    ax.set_ylabel(y_column, fontsize=12)
    if title:
        ax.set_title(title, fontsize=14, fontweight='bold')

    ax.grid(True, axis='y', alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def create_scatter_plot(x_data, y_data, x_label, y_label, output_path, title=None):
    """
    创建散点图

    Args:
        x_data: X轴数据
        y_data: Y轴数据
        x_label: X轴标签
        y_label: Y轴标签
        output_path: 输出路径
        title: 图表标题
    """
    fig, ax = plt.subplots(figsize=(10, 8))

    ax.scatter(x_data, y_data, alpha=0.6, s=50, edgecolors='blue', linewidths=0.5)

    ax.set_xlabel(x_label, fontsize=12)
    ax.set_ylabel(y_label, fontsize=12)
    if title:
        ax.set_title(title, fontsize=14, fontweight='bold')

    ax.grid(True, alpha=0.3)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def create_box_plot(data, output_path, title=None):
    """
    创建箱线图

    Args:
        data: 数据字典 {列名: 值列表}
        output_path: 输出路径
        title: 图表标题
    """
    fig, ax = plt.subplots(figsize=(12, 6))

    # 准备数据
    labels = list(data.keys())
    values = list(data.values())

    bp = ax.boxplot(values, labels=labels, patch_artist=True)

    # 设置颜色
    colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightyellow', 'lightpink']
    for patch, color in zip(bp['boxes'], colors):
        patch.set_facecolor(color)

    ax.set_ylabel('数值', fontsize=12)
    if title:
        ax.set_title(title, fontsize=14, fontweight='bold')

    ax.grid(True, axis='y', alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def generate_trend_charts(trend_data, output_dir):
    """
    生成趋势分析图表

    Args:
        trend_data: 趋势分析结果
        output_dir: 输出目录

    Returns:
        list: 生成的图表路径列表
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    chart_files = []

    # 1. 移动平均图
    if 'moving_average' in trend_data:
        chart_path = output_path / 'moving_average.png'
        ma_data = trend_data['moving_average']
        date_col = list(ma_data.keys())
        value_col = [v[trend_data['value_column']] for v in ma_data.values()]

        create_line_chart({k: v[trend_data['value_column']] for k, v in ma_data.items()},
                       '日期', f'{trend_data["value_column"]} (移动平均{trend_data["period"]}天)',
                       str(chart_path), '移动平均趋势')
        chart_files.append(str(chart_path))

    # 2. 增长率图
    if 'growth_rate' in trend_data and 'values' in trend_data['growth_rate']:
        chart_path = output_path / 'growth_rate.png'
        growth_data = trend_data['growth_rate']['values']
        date_col = list(growth_data.keys())
        value_col = list(growth_data.values())

        # 创建DataFrame并清理
        growth_df = pd.DataFrame({'date': date_col, 'value': value_col})
        growth_df['value'] = pd.to_numeric(growth_df['value'], errors='coerce')
        growth_df = growth_df.dropna()

        create_line_chart(dict(zip(growth_df['date'], growth_df['value'])),
                       '日期', '增长率 (%)', str(chart_path), '增长率变化')
        chart_files.append(str(chart_path))

    # 3. 季节性图
    if 'seasonality' in trend_data:
        # 周期性图表
        chart_path = output_path / 'seasonality.png'
        seasonality = trend_data['seasonality']['day_of_week']
        if seasonality:
            day_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            if trend_data['value_column'] in list(seasonality.values())[0]:
                values = [v.get(trend_data['value_column'], 0) for v in seasonality.values()]
            else:
                values = [v for v in seasonality.values()]

            create_bar_chart(dict(zip(day_names, values)),
                          '星期', trend_data['value_column'],
                          str(chart_path), '周周期性')
            chart_files.append(str(chart_path))

    return chart_files

def generate_stats_charts(stats_data, output_dir):
    """
    生成统计图表

    Args:
        stats_data: 统计分析结果
        output_dir: 输出目录

    Returns:
        list: 生成的图表路径列表
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    chart_files = []
    statistics = stats_data.get('statistics', {})

    if not statistics:
        return chart_files

    # 1. 均值对比图
    chart_path = output_path / 'mean_comparison.png'
    mean_values = {col: stats['mean'] for col, stats in statistics.items()}

    create_bar_chart(mean_values, '列名', '均值',
                   str(chart_path), '各列均值对比')
    chart_files.append(str(chart_path))

    # 2. 标准差对比图
    chart_path = output_path / 'std_comparison.png'
    std_values = {col: stats['std'] for col, stats in statistics.items()}

    create_bar_chart(std_values, '列名', '标准差',
                   str(chart_path), '各列标准差对比')
    chart_files.append(str(chart_path))

    # 3. 箱线图
    if len(statistics) > 1:
        chart_path = output_path / 'distribution.png'
        box_data = {}
        for col, stats in statistics.items():
            # 使用样本数据模拟（简化）
            box_data[col] = [stats['min'], stats['q25'], stats['median'],
                          stats['q75'], stats['max']]

        create_box_chart_from_stats(box_data, str(chart_path), '数据分布')
        chart_files.append(str(chart_path))

    return chart_files

def create_box_chart_from_stats(stats_dict, output_path, title=None):
    """从统计指标创建简化的箱线图"""
    fig, ax = plt.subplots(figsize=(12, 6))

    labels = list(stats_dict.keys())
    values = list(stats_dict.values())

    # 创建简化的箱线图（使用四分位数）
    box_data = []
    positions = range(1, len(labels) + 1)

    for stats_values in values:
        box_data.append([stats_values[1], stats_values[0], stats_values[3], stats_values[2], stats_values[4]])

    bp = ax.boxplot(box_data, labels=labels, patch_artist=True, positions=positions)

    for patch in bp['boxes']:
        patch.set_facecolor('lightblue')

    ax.set_ylabel('数值', fontsize=12)
    if title:
        ax.set_title(title, fontsize=14, fontweight='bold')

    ax.grid(True, axis='y', alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

def main():
    # 解析命令行参数
    input_path = sys.argv[1] if len(sys.argv) > 1 else None
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'charts'
    chart_type = None

    # 解析参数
    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == '--type' and i + 1 < len(sys.argv):
            chart_type = sys.argv[i + 1]
            i += 2
        else:
            i += 1

    if not input_path:
        print("错误: 请指定输入文件")
        print("用法: python generate_charts.py --input <file> --output <dir> [--type <type>]")
        sys.exit(1)

    print(f"📊 生成图表")
    print(f"   输入: {input_path}")
    print(f"   输出: {output_dir}")

    # 加载数据
    data = load_json(input_path)

    chart_files = []

    # 根据数据类型生成图表
    if 'moving_average' in data or 'growth_rate' in data:
        # 趋势分析数据
        chart_files = generate_trend_charts(data, output_dir)
        print(f"✓ 生成趋势分析图表: {len(chart_files)} 个")
    elif 'statistics' in data:
        # 统计分析数据
        chart_files = generate_stats_charts(data, output_dir)
        print(f"✓ 生成统计图表: {len(chart_files)} 个")

    print(f"\n图表列表:")
    for chart_file in chart_files:
        print(f"  - {chart_file}")

if __name__ == '__main__':
    import pandas as pd
    main()
