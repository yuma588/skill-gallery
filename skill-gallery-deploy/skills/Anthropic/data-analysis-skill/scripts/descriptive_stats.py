#!/usr/bin/env python3
"""
描述性统计分析脚本
计算数据的基本统计指标
"""

import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path

def load_json(file_path):
    """加载JSON分析结果"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def calculate_statistics(series):
    """
    计算统计指标

    Args:
        series: pandas Series

    Returns:
        dict: 统计指标
    """
    stats = {
        'count': int(series.count()),
        'mean': float(series.mean()),
        'std': float(series.std()),
        'min': float(series.min()),
        'max': float(series.max()),
        'median': float(series.median()),
        'q25': float(series.quantile(0.25)),
        'q75': float(series.quantile(0.75)),
        'range': float(series.max() - series.min())
    }

    # 计算众数
    try:
        mode_val = series.mode().iloc[0] if len(series.mode()) > 0 else None
        stats['mode'] = mode_val
    except:
        stats['mode'] = None

    # 计算偏度和峰度
    stats['skewness'] = float(series.skew())
    stats['kurtosis'] = float(series.kurtosis())

    # 计算变异系数
    if stats['mean'] != 0:
        stats['cv'] = float(stats['std'] / abs(stats['mean']))
    else:
        stats['cv'] = None

    return stats

def analyze_columns(df, columns=None):
    """
    分析指定列

    Args:
        df: DataFrame
        columns: 要分析的列名列表

    Returns:
        dict: 分析结果
    """
    if columns is None:
        # 分析所有数值列
        columns = df.select_dtypes(include=[np.number]).columns.tolist()

    results = {}
    for col in columns:
        if col in df.columns:
            try:
                series = pd.to_numeric(df[col], errors='coerce')
                stats = calculate_statistics(series.dropna())
                results[col] = stats
            except Exception as e:
                print(f"警告: 列 '{col}' 分析失败 - {e}")

    return results

def generate_summary(stats):
    """
    生成统计摘要

    Args:
        stats: 统计结果字典

    Returns:
        dict: 摘要信息
    """
    summary = {
        'total_columns': len(stats),
        'high_cv_columns': [],
        'high_skewness_columns': [],
        'high_kurtosis_columns': []
    }

    for col, col_stats in stats.items():
        # 高变异系数 (> 0.3)
        if col_stats.get('cv') and col_stats['cv'] > 0.3:
            summary['high_cv_columns'].append({
                'column': col,
                'cv': col_stats['cv']
            })

        # 高偏度 (> 1 或 < -1)
        if abs(col_stats['skewness']) > 1:
            summary['high_skewness_columns'].append({
                'column': col,
                'skewness': col_stats['skewness']
            })

        # 高峰度 (> 3 或 < -3)
        if abs(col_stats['kurtosis']) > 3:
            summary['high_kurtosis_columns'].append({
                'column': col,
                'kurtosis': col_stats['kurtosis']
            })

    return summary

def save_json(data, output_path):
    """保存JSON结果"""
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)

def main():
    # 解析命令行参数
    input_path = sys.argv[1] if len(sys.argv) > 1 else 'analysis_result.json'
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'descriptive_stats.json'
    columns = None

    # 解析参数
    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == '--columns' and i + 1 < len(sys.argv):
            columns = sys.argv[i + 1].split(',')
            i += 2
        else:
            i += 1

    print(f"📊 描述性统计分析")
    print(f"   输入: {input_path}")

    # 加载分析结果
    data = load_json(input_path)

    # 从原始数据重建DataFrame
    sample_data = data.get('sample_data', [])
    if sample_data:
        df = pd.DataFrame(sample_data)
    else:
        print("错误: 无法获取数据样本")
        sys.exit(1)

    print(f"✓ 数据加载完成: {len(df)} 行 × {len(df.columns)} 列")

    # 选择要分析的列
    if columns:
        # 过滤只存在的列
        columns = [col for col in columns if col in df.columns]
        print(f"✓ 分析列: {', '.join(columns)}")
    else:
        columns = df.select_dtypes(include=[np.number]).columns.tolist()
        print(f"✓ 自动检测到 {len(columns)} 个数值列")

    # 计算统计指标
    stats = analyze_columns(df, columns)
    print(f"✓ 统计指标计算完成")

    # 生成摘要
    summary = generate_summary(stats)

    # 组装结果
    result = {
        'timestamp': pd.Timestamp.now().isoformat(),
        'statistics': stats,
        'summary': summary
    }

    # 保存结果
    save_json(result, output_path)
    print(f"✓ 结果已保存: {output_path}")

    # 打印摘要
    print(f"\n统计摘要:")
    print(f"  - 分析列数: {summary['total_columns']}")
    print(f"  - 高变异系数列: {len(summary['high_cv_columns'])}")
    print(f"  - 高偏度列: {len(summary['high_skewness_columns'])}")
    print(f"  - 高峰度列: {len(summary['high_kurtosis_columns'])}")

if __name__ == '__main__':
    main()
