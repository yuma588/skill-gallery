const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function addTextWatermark(inputPath, outputPath, text, options = {}) {
    try {
        // 默认配置
        const {
            opacity = 0.3,
            rotation = 45,
            fontSize = 60,
            color = { r: 0.5, g: 0.5, b: 0.5 }  // 灰色
        } = options;

        // 读取 PDF 文件
        const existingPdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        
        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        // 为每一页添加水印
        for (const page of pages) {
            const { width, height } = page.getSize();
            
            // 绘制文字水印
            page.drawText(text, {
                x: width / 2,
                y: height / 2,
                size: fontSize,
                font: await pdfDoc.embedFont('Helvetica-Bold'),
                color: rgb(color.r, color.g, color.b),
                opacity: opacity,
                rotate: {
                    type: 'degrees',
                    angle: rotation
                },
                xOffsets: [-text.length * fontSize / 4, text.length * fontSize / 4],
                yOffsets: [0, 0]
            });
        }

        // 保存修改后的 PDF
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);

        console.log(`✓ 水印添加完成！保存至: ${outputPath}`);
        console.log(`  原文件页数: ${totalPages} 页`);
        console.log(`  水印文字: ${text}`);
        console.log(`  旋转角度: ${rotation}°`);
        console.log(`  透明度: ${opacity}`);

    } catch (error) {
        console.error('✗ 添加水印失败:', error.message);
        throw error;
    }
}

// 主程序
(async () => {
    const inputPdf = 'chinese_document.pdf';
    const outputPdf = 'chinese_document_watermarked.pdf';
    const watermarkText = 'CONFIDENTIAL';

    // 检查输入文件是否存在
    if (!fs.existsSync(inputPdf)) {
        console.error(`✗ 找不到文件: ${inputPdf}`);
        process.exit(1);
    }

    // 水印参数
    const watermarkOptions = {
        opacity: 0.3,        // 透明度 (0-1)
        rotation: 45,        // 旋转角度 (度)
        fontSize: 60,        // 字体大小
        color: { r: 0.5, g: 0.5, b: 0.5 }  // 灰色
    };

    await addTextWatermark(inputPdf, outputPdf, watermarkText, watermarkOptions);
})();
