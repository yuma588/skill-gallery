/**
 * PDF转图像 - ESM版
 * 使用动态导入处理ESM模块
 */

console.log('开始PDF转图像处理...');
console.log('基于pdf-skills的方法\n');

const fs = require('fs');

async function convertPDF() {
    try {
        // 动态导入ESM模块
        const pdfjsModule = await import('pdfjs-dist/build/pdf.mjs');
        const canvasModule = await import('canvas');

        const { createCanvas } = canvasModule;
        const pdfjsLib = pdfjsModule;

        console.log('✅ 模块加载成功\n');

        // Load PDF (基于pdf-skills)
        const pdfPath = 'chinese_document.pdf';

        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ 文件不存在: ${pdfPath}`);
            process.exit(1);
        }

        console.log(`📄 加载PDF: ${pdfPath}`);

        // Create document loading task
        const loadingTask = pdfjsLib.getDocument({
            url: pdfPath,
            useSystemFonts: true
        });

        const pdf = await loadingTask.promise;

        console.log(`✅ PDF加载成功，共 ${pdf.numPages} 页\n`);

        // Convert each page
        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`📄 处理第 ${i} 页...`);

            // Get page
            const page = await pdf.getPage(i);

            // Get viewport with high resolution
            const viewport = page.getViewport({ scale: 2.0 });

            console.log(`   尺寸: ${viewport.width} x ${viewport.height} px`);

            // Create canvas
            const c = createCanvas(viewport.width, viewport.height);
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
