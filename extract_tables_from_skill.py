#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF表格提取工具
基于pdf-skills提供的代码示例
参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md
"""

import pdfplumber
import pandas as pd

# PDF文件路径
pdf_path = "d:/skill gallery/chinese_document.pdf"

# 提取所有表格
all_tables = []

print(f"正在处理PDF文件: {pdf_path}")
print("-" * 60)

with pdfplumber.open(pdf_path) as pdf:
    print(f"总页数: {len(pdf.pages)}\n")
    
    for i, page in enumerate(pdf.pages, 1):
        tables = page.extract_tables()
        
        if tables:
            print(f"第 {i} 页: 发现 {len(tables)} 个表格")
            
            for j, table in enumerate(tables, 1):
                if table:  # 检查表格是否为空
                    # 第一行作为列名，其余作为数据
                    if len(table) > 1:
                        df = pd.DataFrame(table[1:], columns=table[0])
                    else:
                        df = pd.DataFrame(table)
                    
                    all_tables.append(df)
                    print(f"  - 表格 {j}: {df.shape[0]} 行 × {df.shape[1]} 列")
        else:
            print(f"第 {i} 页: 无表格")

# 合并所有表格
if all_tables:
    print("\n" + "=" * 60)
    print("开始导出表格数据...")
    print("=" * 60)
    
    combined_df = pd.concat(all_tables, ignore_index=True)
    
    # 导出到Excel
    excel_output = "chinese_document_tables_skill.xlsx"
    combined_df.to_excel(excel_output, index=False)
    print(f"✅ Excel文件已导出: {excel_output}")
    
    # 导出为CSV
    csv_output = "chinese_document_tables_skill.csv"
    combined_df.to_csv(csv_output, index=False, encoding='utf-8-sig')
    print(f"✅ CSV文件已导出: {csv_output}")
    
    print(f"\n总计: {len(all_tables)} 个表格，{len(combined_df)} 行数据")
else:
    print("\n未检测到任何表格")
