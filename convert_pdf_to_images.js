#!/usr/bin/env node
/**
 * PDF转图像工具
 * 严格基于pdf-skills的代码示例
 * 参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md 第174-206行
 */

const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
const path = require('path');

// Configure worker (基于pdf-skills示例)
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
    __dirname,
    'node_modules',
    'pdfjs-dist',
    'build',
    'pdf.worker.mjs'
);

async function renderPDFToImages() {
    try {
        // Load PDF (基于pdf-skills示例)
        const loadingTask = pdfjsLib.getDocument('chinese_document.pdf');
        const pdf = await loadingTask.promise;

        console.log(`📄 加载PDF成功，共 ${pdf.numPages} 页`);

        // Render each page to image (基于pdf-skills示例的渲染逻辑)
        for (let i = 1; i <= pdf.numPages; i++) {
            // Get page
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // Higher resolution

            console.log(`📄 正在渲染第 ${i} 页...`);

            // Create canvas
            const canvas = require('canvas').createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            // Render to canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Save to file (PNG format for web)
            const outputFilename = `chinese_document_page_${i}.png`;
            const outputStream = fs.createWriteStream(outputFilename);
            const pngStream = canvas.createPNGStream();

            pngStream.pipe(outputStream);

            await new Promise((resolve, reject) => {
                outputStream.on('finish', resolve);
                outputStream.on('error', reject);
            });

            console.log(`✅ 第 ${i} 页已保存: ${outputFilename}`);
        }

        console.log('\n🎉 所有页面转换完成！');
        console.log(`共生成 ${pdf.numPages} 个图像文件`);

    } catch (error) {
        console.error('❌ 转换失败:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run function
renderPDFToImages();
