#!/usr/bin/env python3
"""
Excel数据分析脚本
读取Excel文件并进行基础数据预处理
"""

import sys
import json
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

def load_excel(file_path, sheet_name=None):
    """
    加载Excel文件

    Args:
        file_path: Excel文件路径
        sheet_name: 工作表名称（可选）

    Returns:
        DataFrame: 加载的数据
    """
    try:
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
        else:
            df = pd.read_excel(file_path)
        return df
    except Exception as e:
        print(f"错误: 读取Excel文件失败 - {e}")
        sys.exit(1)

def clean_data(df):
    """
    数据清洗和预处理

    Args:
        df: 原始DataFrame

    Returns:
        DataFrame: 清洗后的数据
    """
    # 处理缺失值
    df_cleaned = df.copy()

    # 数值列：填充中位数
    numeric_cols = df_cleaned.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df_cleaned[col].isnull().sum() > 0:
            median_val = df_cleaned[col].median()
            df_cleaned[col].fillna(median_val, inplace=True)

    # 字符列：填充"无数据"
    string_cols = df_cleaned.select_dtypes(include=['object']).columns
    for col in string_cols:
        if df_cleaned[col].isnull().sum() > 0:
            df_cleaned[col].fillna('无数据', inplace=True)

    # 尝试转换日期列
    for col in df_cleaned.columns:
        col_lower = str(col).lower()
        if 'date' in col_lower or '日期' in col_lower or '时间' in col_lower:
            try:
                df_cleaned[col] = pd.to_datetime(df_cleaned[col], errors='coerce')
            except:
                pass

    return df_cleaned

def analyze_data_structure(df):
    """
    分析数据结构

    Args:
        df: DataFrame

    Returns:
        dict: 数据结构信息
    """
    structure = {
        'total_rows': len(df),
        'total_columns': len(df.columns),
        'column_names': list(df.columns),
        'data_types': {col: str(dtype) for col, dtype in df.dtypes.items()},
        'missing_values': {col: int(df[col].isnull().sum()) for col in df.columns},
        'memory_usage': float(df.memory_usage(deep=True).sum() / 1024)
    }

    return structure

def identify_column_types(df):
    """
    识别列的类型（数值、日期、分类）

    Args:
        df: DataFrame

    Returns:
        dict: 列类型分类
    """
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    date_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

    return {
        'numeric': numeric_cols,
        'date': date_cols,
        'categorical': categorical_cols
    }

def save_json(data, output_path):
    """
    保存分析结果为JSON

    Args:
        data: 要保存的数据
        output_path: 输出文件路径
    """
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)

def main():
    # 解析命令行参数
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'analysis_result.json'
    sheet_name = None

    # 解析参数
    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == '--sheet' and i + 1 < len(sys.argv):
            sheet_name = sys.argv[i + 1]
            i += 2
        else:
            i += 1

    if not file_path:
        print("错误: 请指定Excel文件路径")
        print("用法: python analyze_excel.py <file> [--sheet <name>] [--output <output>]")
        sys.exit(1)

    print(f"📊 分析文件: {file_path}")

    # 加载数据
    df = load_excel(file_path, sheet_name)
    print(f"✓ 加载完成: {len(df)} 行 × {len(df.columns)} 列")

    # 数据清洗
    df_cleaned = clean_data(df)
    print("✓ 数据清洗完成")

    # 分析数据结构
    structure = analyze_data_structure(df_cleaned)

    # 识别列类型
    column_types = identify_column_types(df_cleaned)

    # 保存数据样本
    sample_data = df_cleaned.head(10).to_dict('records')

    # 组装结果
    result = {
        'file_path': file_path,
        'timestamp': datetime.now().isoformat(),
        'structure': structure,
        'column_types': column_types,
        'sample_data': sample_data
    }

    # 保存结果
    save_json(result, output_path)
    print(f"✓ 结果已保存: {output_path}")
    print(f"\n数据概要:")
    print(f"  - 总行数: {structure['total_rows']}")
    print(f"  - 总列数: {structure['total_columns']}")
    print(f"  - 数值列: {len(column_types['numeric'])}")
    print(f"  - 日期列: {len(column_types['date'])}")
    print(f"  - 分类列: {len(column_types['categorical'])}")
    print(f"  - 内存占用: {structure['memory_usage']:.2f} KB")

if __name__ == '__main__':
    main()
