#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF表格提取工具
从PDF文档中提取表格数据，支持中文，并导出为Excel和CSV格式
"""

import pdfplumber
import pandas as pd
import json
from datetime import datetime
import os
import sys


class PDFTableExtractor:
    """PDF表格提取器"""
    
    def __init__(self, pdf_path, output_dir="."):
        """
        初始化提取器
        
        Args:
            pdf_path: PDF文件路径
            output_dir: 输出目录
        """
        self.pdf_path = pdf_path
        self.output_dir = output_dir
        self.all_tables = []  # 存储所有表格数据
        self.extraction_info = {
            'total_pages': 0,
            'total_tables': 0,
            'tables_by_page': {},
            'extraction_time': None
        }
    
    def extract_all_tables(self):
        """提取PDF中的所有表格"""
        print(f"📄 正在处理文件: {self.pdf_path}")
        print("=" * 60)
        
        if not os.path.exists(self.pdf_path):
            print(f"❌ 错误: 文件不存在 - {self.pdf_path}")
            return False
        
        try:
            with pdfplumber.open(self.pdf_path) as pdf:
                self.extraction_info['total_pages'] = len(pdf)
                self.extraction_info['extraction_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                print(f"📊 总页数: {len(pdf)}\n")
                
                for page_num, page in enumerate(pdf.pages, 1):
                    self._extract_tables_from_page(page, page_num)
                
                self.extraction_info['total_tables'] = len(self.all_tables)
                
                return True
                
        except Exception as e:
            print(f"❌ 处理PDF时出错: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    def _extract_tables_from_page(self, page, page_num):
        """从单页提取表格"""
        try:
            # 使用更精确的表格提取设置
            table_settings = {
                "vertical_strategy": "lines",
                "horizontal_strategy": "lines",
                "snap_tolerance": 5,
                "intersection_tolerance": 15,
            }
            
            # 尝试提取表格
            tables = page.extract_tables(table_settings)
            
            if not tables:
                # 如果使用lines策略没有找到表格，尝试默认策略
                tables = page.extract_tables()
            
            if tables:
                print(f"✅ 第 {page_num} 页: 发现 {len(tables)} 个表格")
                
                for table_num, table in enumerate(tables, 1):
                    # 将表格数据转换为DataFrame
                    df = pd.DataFrame(table)
                    
                    # 清洗数据：处理空值
                    df = df.fillna('').astype(str)
                    
                    # 移除完全为空的行和列
                    df = df.dropna(how='all')
                    df = df.loc[:, (df != '').any(axis=0)]
                    
                    table_info = {
                        'page': page_num,
                        'table_num': table_num,
                        'data': df,
                        'shape': df.shape,
                        'table_id': f"Page{page_num}_Table{table_num}"
                    }
                    
                    self.all_tables.append(table_info)
                    print(f"   └─ 表格 {table_num}: {df.shape[0]}行 × {df.shape[1]}列")
                
                self.extraction_info['tables_by_page'][page_num] = len(tables)
            else:
                # 即使没有表格，也记录
                print(f"⚪ 第 {page_num} 页: 未检测到表格")
                
        except Exception as e:
            print(f"⚠️ 第 {page_num} 页处理时出错: {str(e)}")
    
    def export_to_excel(self, output_filename=None):
        """导出表格到Excel文件"""
        if not self.all_tables:
            print("⚠️ 没有表格数据可导出")
            return None
        
        if output_filename is None:
            base_name = os.path.splitext(os.path.basename(self.pdf_path))[0]
            output_filename = f"{base_name}_tables.xlsx"
        
        output_path = os.path.join(self.output_dir, output_filename)
        
        try:
            with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
                for table_info in self.all_tables:
                    sheet_name = table_info['table_id'][:31]  # Excel sheet名称最多31字符
                    table_info['data'].to_excel(
                        writer,
                        sheet_name=sheet_name,
                        index=False,
                        header=False  # 不使用默认的DataFrame行号
                    )
            
            print(f"\n✅ Excel文件已导出: {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ 导出Excel时出错: {str(e)}")
            return None
    
    def export_to_csv(self, output_filename=None):
        """导出表格到CSV文件"""
        if not self.all_tables:
            print("⚠️ 没有表格数据可导出")
            return None
        
        if output_filename is None:
            base_name = os.path.splitext(os.path.basename(self.pdf_path))[0]
            output_filename = f"{base_name}_tables.csv"
        
        output_path = os.path.join(self.output_dir, output_filename)
        
        try:
            # 将所有表格合并导出到一个CSV文件
            all_data = []
            for table_info in self.all_tables:
                # 添加标识列
                df = table_info['data'].copy()
                df.insert(0, '表格来源', table_info['table_id'])
                df.insert(1, '页码', table_info['page'])
                all_data.append(df)
            
            merged_df = pd.concat(all_data, ignore_index=True)
            merged_df.to_csv(output_path, index=False, encoding='utf-8-sig')
            
            print(f"✅ CSV文件已导出: {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ 导出CSV时出错: {str(e)}")
            return None
    
    def generate_report(self, report_filename=None):
        """生成提取报告"""
        if report_filename is None:
            base_name = os.path.splitext(os.path.basename(self.pdf_path))[0]
            report_filename = f"{base_name}_report.txt"
        
        report_path = os.path.join(self.output_dir, report_filename)
        
        try:
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write("=" * 60 + "\n")
                f.write("PDF 表格提取报告\n")
                f.write("=" * 60 + "\n\n")
                
                f.write(f"源文件: {self.pdf_path}\n")
                f.write(f"提取时间: {self.extraction_info['extraction_time']}\n")
                f.write(f"总页数: {self.extraction_info['total_pages']}\n")
                f.write(f"总表格数: {self.extraction_info['total_tables']}\n\n")
                
                f.write("-" * 60 + "\n")
                f.write("表格详情:\n")
                f.write("-" * 60 + "\n\n")
                
                for idx, table_info in enumerate(self.all_tables, 1):
                    f.write(f"表格 {idx}: {table_info['table_id']}\n")
                    f.write(f"  位置: 第 {table_info['page']} 页\n")
                    f.write(f"  尺寸: {table_info['shape'][0]} 行 × {table_info['shape'][1]} 列\n\n")
                
                f.write("=" * 60 + "\n")
            
            print(f"📋 提取报告已生成: {report_path}")
            return report_path
            
        except Exception as e:
            print(f"⚠️ 生成报告时出错: {str(e)}")
            return None
    
    def print_summary(self):
        """打印提取摘要"""
        print("\n" + "=" * 60)
        print("📊 提取摘要")
        print("=" * 60)
        print(f"源文件: {self.pdf_path}")
        print(f"提取时间: {self.extraction_info['extraction_time']}")
        print(f"总页数: {self.extraction_info['total_pages']}")
        print(f"总表格数: {self.extraction_info['total_tables']}")
        print("=" * 60)


def main():
    """主函数"""
    # PDF文件路径
    pdf_path = r"d:\skill gallery\chinese_document.pdf"
    output_dir = r"d:\skill gallery"
    
    # 检查文件是否存在
    if not os.path.exists(pdf_path):
        print(f"❌ 错误: PDF文件不存在 - {pdf_path}")
        return
    
    # 创建提取器实例
    extractor = PDFTableExtractor(pdf_path, output_dir)
    
    # 执行提取
    if extractor.extract_all_tables():
        # 打印摘要
        extractor.print_summary()
        
        # 导出结果
        excel_path = extractor.export_to_excel()
        csv_path = extractor.export_to_csv()
        report_path = extractor.generate_report()
        
        print("\n" + "🎉 提取完成!" + "\n")
        
        if excel_path:
            print(f"📁 Excel文件: {excel_path}")
        if csv_path:
            print(f"📁 CSV文件: {csv_path}")
        if report_path:
            print(f"📁 报告文件: {report_path}")
    else:
        print("\n❌ 提取失败，请检查错误信息")


if __name__ == "__main__":
    main()
