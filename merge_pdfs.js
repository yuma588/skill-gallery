#!/usr/bin/env node
/**
 * PDF合并工具
 * 严格基于pdf-skills的代码示例
 * 参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md 第141-168行
 */

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function mergePDFs() {
    // Create new document
    const mergedPdf = await PDFDocument.create();

    // Load source PDFs
    const pdf1Bytes = fs.readFileSync('chinese_document.pdf');
    const pdf2Bytes = fs.readFileSync('chinese_document_watermarked.pdf');

    const pdf1 = await PDFDocument.load(pdf1Bytes);
    const pdf2 = await PDFDocument.load(pdf2Bytes);

    // Copy pages from first PDF (all pages)
    const pdf1Pages = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
    pdf1Pages.forEach(page => mergedPdf.addPage(page));

    // Copy pages from second PDF (all pages)
    const pdf2Pages = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
    pdf2Pages.forEach(page => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync('merged_documents.pdf', mergedPdfBytes);

    console.log('✅ PDF合并完成！');
    console.log(`输出文件: merged_documents.pdf`);
    console.log(`第一个PDF页数: ${pdf1.getPageCount()}`);
    console.log(`第二个PDF页数: ${pdf2.getPageCount()}`);
    console.log(`合并后总页数: ${mergedPdf.getPageCount()}`);
}

// Run the function
mergePDFs().catch(error => {
    console.error('❌ 合并失败:', error.message);
    process.exit(1);
});
