#!/usr/bin/env node
/**
 * PDF转图像工具 - 极简版
 * 基于pdf-skills的渲染概念
 */

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');
const fs = require('fs');

async function convertPDF() {
    try {
        console.log('开始加载PDF...');

        // Load PDF
        const loadingTask = pdfjsLib.getDocument('chinese_document.pdf');
        const pdf = await loadingTask.promise;

        console.log(`PDF加载成功，共 ${pdf.numPages} 页`);

        // Render each page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });

            console.log(`渲染第 ${i} 页...`);

            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const filename = `chinese_document_page_${i}.png`;
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            console.log(`✅ 已保存: ${filename}`);
        }

        console.log('\n转换完成！');

    } catch (error) {
        console.error('错误:', error.message);
        console.error(error);
        process.exit(1);
    }
}

convertPDF();
