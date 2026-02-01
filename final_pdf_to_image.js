#!/usr/bin/env node
/**
 * PDF转图像 - 最终版
 * 严格基于pdf-skills的方法
 */

console.log('开始PDF转图像处理...');
console.log('基于pdf-skills提供的解决方案\n');

const fs = require('fs');
const path = require('path');

// 检查依赖
console.log('检查依赖...');

let pdfjsLib, canvas;

try {
    pdfjsLib = require('pdfjs-dist');
    console.log('✅ pdfjs-dist 已安装');
} catch (e) {
    console.log('❌ pdfjs-dist 未找到');
    console.log('运行: npm install pdfjs-dist');
    process.exit(1);
}

try {
    canvas = require('canvas');
    console.log('✅ canvas 已安装');
} catch (e) {
    console.log('❌ canvas 未找到');
    console.log('运行: npm install canvas');
    process.exit(1);
}

console.log('\n开始转换...\n');

async function convertPDF() {
    try {
        // 基于pdf-skills reference.md 第174-206行的方法
        const pdfPath = 'chinese_document.pdf';

        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ 文件不存在: ${pdfPath}`);
            process.exit(1);
        }

        console.log(`📄 加载PDF: ${pdfPath}`);

        // Load PDF
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        console.log(`✅ PDF加载成功，共 ${pdf.numPages} 页\n`);

        // Convert each page
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`📄 处理第 ${i} 页...`);

            // Get page
            const page = await pdf.getPage(i);

            // Get viewport with high resolution for web (基于pdf-skills)
            const viewport = page.getViewport({ scale: 2.0 });

            console.log(`   尺寸: ${viewport.width} x ${viewport.height} px`);

            // Create canvas
            const c = canvas.createCanvas(viewport.width, viewport.height);
            const context = c.getContext('2d');

            // Render page to canvas (基于pdf-skills)
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Save as PNG
            const filename = `chinese_document_page_${i}.png`;
            const buffer = c.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            const sizeKB = (buffer.length / 1024).toFixed(1);
            console.log(`   ✅ 已保存: ${filename} (${sizeKB} KB)\n`);
        }

        console.log('='.repeat(60));
        console.log('🎉 转换完成！');
        console.log(`总共生成 ${pdf.numPages} 个PNG图像文件`);
        console.log('='.repeat(60));

        console.log('\n📁 生成的文件:');
        for (let i = 1; i <= pdf.numPages; i++) {
            const filename = `chinese_document_page_${i}.png`;
            if (fs.existsSync(filename)) {
                const stats = fs.statSync(filename);
                const sizeKB = (stats.size / 1024).toFixed(1);
                console.log(`   ${filename} (${sizeKB} KB)`);
            }
        }

        console.log('\n💡 这些PNG图像可以用于网页展示');
        console.log('格式: PNG (无损)');
        console.log('分辨率: 200 DPI (适合网页)');

    } catch (error) {
        console.error('\n❌ 转换失败:');
        console.error(error.message);
        if (error.stack) {
            console.error('\n详细错误:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// 运行转换
convertPDF();
