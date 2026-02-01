#!/usr/bin/env node
/**
 * PDF转图像工具 - 使用pdfjs-dist
 * 基于pdf-skills的代码示例 (reference.md 第174-206行)
 */

// 尝试多种导入方式
let pdfjsLib;
try {
    // 方式1: 直接导入
    pdfjsLib = require('pdfjs-dist');
    console.log('✅ 方式1: 直接导入成功');
} catch (e) {
    try {
        // 方式2: 使用legacy build
        pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
        console.log('✅ 方式2: legacy build成功');
    } catch (e2) {
        try {
            // 方式3: 使用ESM
            import('pdfjs-dist').then(module => {
                pdfjsLib = module;
                console.log('✅ 方式3: ESM成功');
                runConversion();
            }).catch(e3 => {
                console.error('所有导入方式失败');
                process.exit(1);
            });
        } catch (e3) {
            console.error('导入失败:', e3.message);
            process.exit(1);
        }
    }
}

if (pdfjsLib) {
    runConversion();
}

async function runConversion() {
    try {
        const fs = require('fs');
        const { createCanvas } = require('canvas');

        console.log('开始加载PDF...');

        // Load PDF (基于pdf-skills示例)
        const loadingTask = pdfjsLib.getDocument({
            url: 'chinese_document.pdf',
            standardFontDataUrl: null
        });

        const pdf = await loadingTask.promise;
        console.log(`✅ PDF加载成功，共 ${pdf.numPages} 页`);

        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`\n处理第 ${i} 页...`);

            // Get page (基于pdf-skills示例)
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // High resolution

            console.log(`   页面尺寸: ${viewport.width} x ${viewport.height}`);

            // Create canvas
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            // Render page (基于pdf-skills示例)
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Save to PNG
            const filename = `chinese_document_page_${i}.png`;
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filename, buffer);

            console.log(`   ✅ 已保存: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 所有页面转换完成！');
        console.log(`共生成 ${pdf.numPages} 个PNG图像文件`);
        console.log('文件可用于网页展示');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ 转换失败:', error.message);
        console.error(error);
        process.exit(1);
    }
}
