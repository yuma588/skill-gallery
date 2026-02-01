#!/usr/bin/env node
/**
 * PDF转图像工具 - 简化版
 * 严格基于pdf-skills的代码示例
 */

const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
const { createCanvas } = require('canvas');

async function renderPDFToImages() {
    try {
        // Load PDF (基于pdf-skills示例第183-186行)
        const loadingTask = pdfjsLib.getDocument('chinese_document.pdf');
        const pdf = await loadingTask.promise;

        console.log(`📄 加载PDF成功，共 ${pdf.numPages} 页`);

        // Render each page to image
        for (let i = 1; i <= pdf.numPages; i++) {
            // Get page (基于pdf-skills示例第189行)
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // Higher resolution for web

            console.log(`📄 正在渲染第 ${i} 页... 尺寸: ${viewport.width}x${viewport.height}`);

            // Create canvas (基于pdf-skills示例第193-196行的概念)
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            // Render to canvas (基于pdf-skills示例第198-203行)
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Save to PNG file
            const outputFilename = `chinese_document_page_${i}.png`;
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputFilename, buffer);

            console.log(`✅ 第 ${i} 页已保存: ${outputFilename}`);
        }

        console.log('\n🎉 所有页面转换完成！');
        console.log(`共生成 ${pdf.numPages} 个图像文件`);
        console.log('\n📁 文件可用于网页展示:');
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`   - chinese_document_page_${i}.png`);
        }

    } catch (error) {
        console.error('❌ 转换失败:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run function
renderPDFToImages();
