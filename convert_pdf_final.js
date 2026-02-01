#!/usr/bin/env node
/**
 * PDF转图像工具 - 最终版本
 * 严格基于pdf-skills的代码示例
 * 参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md 第174-206行
 */

const fs = require('fs');
const path = require('path');

// 导入pdfjs-dist (使用3.x版本以支持Node.js CommonJS)
const pdfjsLib = require('pdfjs-dist');
const { createCanvas } = require('canvas');

console.log('='.repeat(60));
console.log('PDF转图像工具（基于pdf-skills）');
console.log('='.repeat(60));
console.log(`PDF.js版本: ${pdfjsLib.version}\n`);

async function convertPDF() {
    try {
        const pdfPath = 'chinese_document.pdf';

        // 检查文件是否存在
        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ 错误: 文件不存在 - ${pdfPath}`);
            process.exit(1);
        }

        console.log(`📄 正在处理文件: ${pdfPath}\n`);

        // Load PDF (基于pdf-skills示例第183-186行)
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        console.log(`✅ PDF加载成功`);
        console.log(`📊 总页数: ${pdf.numPages} 页\n`);

        // Convert each page to image (基于pdf-skills示例第189-203行)
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`[${i}/${pdf.numPages}] 处理第 ${i} 页...`);

            // Get page (基于pdf-skills示例第189行)
            const page = await pdf.getPage(i);

            // Get viewport with scale (基于pdf-skills示例第190行)
            // scale=2.0 提供高分辨率，适合网页展示
            const viewport = page.getViewport({ scale: 2.0 });

            console.log(`   页面尺寸: ${Math.round(viewport.width)} × ${Math.round(viewport.height)} px`);

            // Create canvas (基于pdf-skills示例第193-196行的概念)
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            // Render page to canvas (基于pdf-skills示例第198-203行)
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Save to PNG file
            const filename = `chinese_document_page_${i}.png`;
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            const sizeKB = (buffer.length / 1024).toFixed(1);
            console.log(`   ✅ 已保存: ${filename} (${sizeKB} KB)\n`);
        }

        console.log('='.repeat(60));
        console.log('🎉 转换完成！');
        console.log('='.repeat(60));
        console.log(`📊 总共生成 ${pdf.numPages} 个PNG图像文件`);
        console.log('📁 所有文件位于当前目录');
        console.log('🌐 文件可用于网页展示');
        console.log('='.repeat(60));

        // 列出生成的文件
        console.log('\n生成的文件列表:');
        for (let i = 1; i <= pdf.numPages; i++) {
            const filename = `chinese_document_page_${i}.png`;
            if (fs.existsSync(filename)) {
                const stats = fs.statSync(filename);
                const sizeKB = (stats.size / 1024).toFixed(1);
                console.log(`   ✅ ${filename} (${sizeKB} KB)`);
            }
        }

        console.log('\n💡 使用建议:');
        console.log('   - 在HTML中使用: <img src="chinese_document_page_1.png" alt="Page 1">');
        console.log('   - 建议使用响应式CSS: max-width: 100%; height: auto;');
        console.log('   - 文件格式: PNG (无损压缩)');
        console.log('   - 分辨率: 约200 DPI (适合网页展示)');

    } catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ 转换失败');
        console.error('='.repeat(60));
        console.error(`错误信息: ${error.message}`);
        console.error('\n完整错误堆栈:');
        console.error(error.stack);
        process.exit(1);
    }
}

// 运行转换
console.log('开始转换...\n');
convertPDF();
