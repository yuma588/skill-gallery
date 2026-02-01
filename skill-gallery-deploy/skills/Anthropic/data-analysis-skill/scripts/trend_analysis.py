#!/usr/bin/env python3
"""
趋势分析脚本
分析时间序列数据的趋势和周期性
"""

import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
from scipy import stats

def load_json(file_path):
    """加载JSON分析结果"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def prepare_time_series(df, date_column, value_column):
    """
    准备时间序列数据

    Args:
        df: DataFrame
        date_column: 日期列名
        value_column: 值列名

    Returns:
        DataFrame: 准备好的时间序列
    """
    # 确保日期列是datetime类型
    df[date_column] = pd.to_datetime(df[date_column], errors='coerce')

    # 确保值列是数值类型
    df[value_column] = pd.to_numeric(df[value_column], errors='coerce')

    # 按日期排序
    df = df.sort_values(date_column).dropna(subset=[date_column, value_column])

    # 设置日期为索引
    df_ts = df.set_index(date_column)[[value_column]]

    return df_ts

def calculate_moving_average(df, window=7):
    """
    计算移动平均

    Args:
        df: 时间序列DataFrame
        window: 窗口大小

    Returns:
        Series: 移动平均值
    """
    return df.rolling(window=window).mean()

def calculate_growth_rate(df):
    """
    计算增长率

    Args:
        df: 时间序列DataFrame

    Returns:
        Series: 增长率
    """
    # 环比增长率
    growth = df.pct_change() * 100
    return growth

def calculate_trend_line(df):
    """
    计算线性趋势线

    Args:
        df: 时间序列DataFrame

    Returns:
        tuple: (趋势值, 斜率, 截距, R方)
    """
    # 创建数字索引
    x = np.arange(len(df))
    y = df.values.flatten()

    # 线性回归
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

    # 计算趋势线
    trend = slope * x + intercept

    return {
        'trend': trend.tolist(),
        'slope': float(slope),
        'intercept': float(intercept),
        'r_squared': float(r_value ** 2),
        'p_value': float(p_value)
    }

def detect_anomalies(df, threshold=2):
    """
    检测异常值（基于Z-score）

    Args:
        df: 时间序列DataFrame
        threshold: Z-score阈值

    Returns:
        dict: 异常值信息
    """
    values = df.values.flatten()
    z_scores = np.abs(stats.zscore(values))

    anomalies = {
        'count': int(np.sum(z_scores > threshold)),
        'indices': np.where(z_scores > threshold)[0].tolist(),
        'values': values[z_scores > threshold].tolist(),
        'threshold': threshold
    }

    return anomalies

def analyze_seasonality(df, period=None):
    """
    分析季节性

    Args:
        df: 时间序列DataFrame
        period: 周期（天/周/月）

    Returns:
        dict: 季节性分析结果
    """
    # 提取时间特征
    df_period = df.copy()
    df_period['day_of_week'] = df_period.index.dayofweek
    df_period['day_of_month'] = df_period.index.day
    df_period['month'] = df_period.index.month

    # 计算各周期的平均值
    seasonality = {
        'day_of_week': df_period.groupby('day_of_week').mean().to_dict(),
        'day_of_month': df_period.groupby('day_of_month').mean().to_dict(),
        'month': df_period.groupby('month').mean().to_dict()
    }

    return seasonality

def analyze_trend(df, date_column, value_column, period=7):
    """
    完整的趋势分析

    Args:
        df: DataFrame
        date_column: 日期列名
        value_column: 值列名
        period: 移动平均周期

    Returns:
        dict: 趋势分析结果
    """
    # 准备时间序列
    df_ts = prepare_time_series(df, date_column, value_column)

    results = {
        'date_column': date_column,
        'value_column': value_column,
        'period': period,
        'data_points': len(df_ts),
        'date_range': {
            'start': str(df_ts.index.min()),
            'end': str(df_ts.index.max())
        }
    }

    # 移动平均
    if len(df_ts) >= period:
        ma = calculate_moving_average(df_ts, period)
        results['moving_average'] = ma.dropna().to_dict()

    # 增长率
    growth = calculate_growth_rate(df_ts)
    results['growth_rate'] = {
        'mean': float(growth.mean()),
        'std': float(growth.std()),
        'max': float(growth.max()),
        'min': float(growth.min()),
        'values': growth.dropna().to_dict()
    }

    # 趋势线
    if len(df_ts) >= 3:
        trend_line = calculate_trend_line(df_ts)
        results['trend_line'] = trend_line

    # 异常值检测
    anomalies = detect_anomalies(df_ts)
    results['anomalies'] = anomalies

    # 季节性分析
    if len(df_ts) >= 30:  # 至少30天数据
        seasonality = analyze_seasonality(df_ts)
        results['seasonality'] = seasonality

    return results

def save_json(data, output_path):
    """保存JSON结果"""
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)

def main():
    # 解析命令行参数
    input_path = sys.argv[1] if len(sys.argv) > 1 else 'analysis_result.json'
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'trend_analysis.json'
    date_column = None
    value_column = None
    period = 7

    # 解析参数
    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == '--date-column' and i + 1 < len(sys.argv):
            date_column = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == '--value-column' and i + 1 < len(sys.argv):
            value_column = sys.argv[i + 1]
            i += 2
        elif sys.argv[i] == '--period' and i + 1 < len(sys.argv):
            period = int(sys.argv[i + 1])
            i += 2
        else:
            i += 1

    if not date_column or not value_column:
        print("错误: 请指定日期列和值列")
        print("用法: python trend_analysis.py --date-column <name> --value-column <name> [--period <n>]")
        sys.exit(1)

    print(f"📈 趋势分析")
    print(f"   输入: {input_path}")
    print(f"   日期列: {date_column}")
    print(f"   值列: {value_column}")
    print(f"   周期: {period}")

    # 加载数据
    data = load_json(input_path)

    # 从样本数据重建DataFrame
    sample_data = data.get('sample_data', [])
    if sample_data:
        df = pd.DataFrame(sample_data)
    else:
        print("错误: 无法获取数据样本")
        sys.exit(1)

    # 检查列是否存在
    if date_column not in df.columns or value_column not in df.columns:
        print(f"错误: 列 '{date_column}' 或 '{value_column}' 不存在")
        print(f"可用列: {', '.join(df.columns)}")
        sys.exit(1)

    # 趋势分析
    results = analyze_trend(df, date_column, value_column, period)
    print("✓ 趋势分析完成")

    # 保存结果
    save_json(results, output_path)
    print(f"✓ 结果已保存: {output_path}")

    # 打印摘要
    print(f"\n趋势分析摘要:")
    print(f"  - 数据点数: {results['data_points']}")
    print(f"  - 日期范围: {results['date_range']['start']} 至 {results['date_range']['end']}")
    if 'trend_line' in results:
        print(f"  - 趋势斜率: {results['trend_line']['slope']:.4f}")
        print(f"  - R方值: {results['trend_line']['r_squared']:.4f}")
    print(f"  - 异常值: {results['anomalies']['count']} 个")
    print(f"  - 平均增长率: {results['growth_rate']['mean']:.2f}%")

if __name__ == '__main__':
    main()
