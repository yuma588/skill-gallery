#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF合并工具
严格基于pdf-skills的代码示例
参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/SKILL.md 第32-44行
"""

from pypdf import PdfWriter, PdfReader

# 按照pdf-skills示例进行合并
writer = PdfWriter()
for pdf_file in ["chinese_document.pdf", "chinese_document_watermarked.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged_documents.pdf", "wb") as output:
    writer.write(output)

print("✅ PDF合并完成！")
print(f"输出文件: merged_documents.pdf")
