#!/usr/bin/env node
/**
 * PDF表格提取工具 - 使用pdfjs-dist
 * 基于pdf-skills的JavaScript方案
 * 参考：skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md (pdfjs-dist部分)
 */

const fs = require('fs');
const path = require('path');

// 检查依赖
let pdfjsLib;
try {
    pdfjsLib = require('pdfjs-dist');
} catch (e) {
    console.error('❌ 错误: 缺少pdfjs-dist依赖');
    console.log('请运行: npm install pdfjs-dist');
    process.exit(1);
}

// 配置worker（使用默认CDN，简化配置）
// pdfjs-dist会自动处理worker，不需要手动设置

class PDFTableExtractor {
    constructor(pdfPath, outputDir = '.') {
        this.pdfPath = pdfPath;
        this.outputDir = outputDir;
        this.allTables = [];
        this.extractionInfo = {
            totalPages: 0,
            totalTables: 0,
            extractionTime: null
        };
    }

    async extractAllTables() {
        console.log(`📄 正在处理文件: ${this.pdfPath}`);
        console.log('='.repeat(60));

        if (!fs.existsSync(this.pdfPath)) {
            console.error(`❌ 错误: 文件不存在 - ${this.pdfPath}`);
            return false;
        }

        try {
            // 加载PDF文档
            const loadingTask = pdfjsLib.getDocument(this.pdfPath);
            const pdfDocument = await loadingTask.promise;

            this.extractionInfo.totalPages = pdfDocument.numPages;
            this.extractionInfo.extractionTime = new Date().toLocaleString('zh-CN');

            console.log(`📊 总页数: ${pdfDocument.numPages}\n`);

            // 提取每一页的文本内容
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();

                // 将文本按位置排序
                const items = textContent.items.sort((a, b) => {
                    // 先按Y坐标排序（从上到下），再按X坐标排序（从左到右）
                    if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
                        return a.transform[4] - b.transform[4];
                    }
                    return b.transform[5] - a.transform[5];
                });

                // 提取文本
                const pageText = items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            console.log(`📝 文本长度: ${fullText.length} 字符\n`);

            // 打印文本预览
            console.log('文本预览:');
            console.log('-'.repeat(60));
            const preview = fullText.substring(0, 800);
            console.log(preview);
            console.log('-'.repeat(60));
            console.log('');

            // 解析表格
            this.parseTables(fullText);

            this.extractionInfo.totalTables = this.allTables.length;

            return true;

        } catch (error) {
            console.error(`❌ 处理PDF时出错: ${error.message}`);
            console.error(error.stack);
            return false;
        }
    }

    parseTables(text) {
        console.log('开始解析表格...');
        console.log('-'.repeat(60));

        const lines = text.split('\n');
        let currentTable = null;
        let tableStartPage = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) continue;

            // 检测表格特征（更严格的规则）
            const hasTabDelimiters = line.includes('\t');
            const hasPipes = line.includes('|') && line.split('|').length >= 4;
            
            // 检测密集的数字或特定格式
            const isDenseData = /([一二三四五六七八九十]+)\s+(农历|公历)\s+/.test(line) ||
                               /([一二三四五六七八九十]+)\s+([日初]+\s*\d+)/.test(line) ||
                               /(\d+[月年日])\s+(\d+[月年日])/.test(line);
            
            // 多个空格分隔的数据
            const multipleSpaces = line.split(/\s{2,}/).length >= 3;

            if (hasTabDelimiters || hasPipes || isDenseData || multipleSpaces) {
                // 可能是表格行
                if (!currentTable) {
                    currentTable = [];
                    tableStartPage = this.estimatePage(i, lines.length, this.extractionInfo.totalPages);
                }

                // 分割列
                let columns;
                if (hasTabDelimiters) {
                    columns = line.split('\t').map(c => c.trim()).filter(c => c);
                } else if (hasPipes) {
                    columns = line.split('|').map(c => c.trim()).filter(c => c);
                } else {
                    // 按多个连续空格分割
                    columns = line.split(/\s{2,}/).map(c => c.trim()).filter(c => c);
                }

                // 只保留有内容的列
                if (columns.length >= 2) {
                    currentTable.push(columns);
                }
            } else {
                // 表格结束
                if (currentTable && currentTable.length >= 2) {
                    this.allTables.push({
                        page: tableStartPage,
                        data: currentTable,
                        shape: [currentTable.length, Math.max(...currentTable.map(r => r.length))],
                        tableId: `Table_${this.allTables.length + 1}`
                    });
                    console.log(`✅ 识别到表格 ${this.allTables.length}: ${currentTable.length}行 × ${Math.max(...currentTable.map(r => r.length))}列`);
                    console.log(`   第1行: ${JSON.stringify(currentTable[0]).substring(0, 80)}...`);
                    console.log(`   第2行: ${JSON.stringify(currentTable[1] || []).substring(0, 80)}...`);
                    console.log('');
                }
                currentTable = null;
            }
        }

        // 处理最后一个表格
        if (currentTable && currentTable.length >= 2) {
            this.allTables.push({
                page: tableStartPage,
                data: currentTable,
                shape: [currentTable.length, Math.max(...currentTable.map(r => r.length))],
                tableId: `Table_${this.allTables.length + 1}`
            });
        }
    }

    estimatePage(currentLine, totalLines, totalPages) {
        const linesPerPage = Math.ceil(totalLines / totalPages);
        return Math.min(Math.ceil(currentLine / linesPerPage), totalPages);
    }

    exportToCSV(outputFilename = null) {
        if (this.allTables.length === 0) {
            console.log('⚠️ 没有表格数据可导出');
            return null;
        }

        if (!outputFilename) {
            const baseName = path.basename(this.pdfPath, path.extname(this.pdfPath));
            outputFilename = `${baseName}_tables_skill.csv`;
        }

        const outputPath = path.join(this.outputDir, outputFilename);

        try {
            // 添加BOM以确保Excel正确识别中文
            let csvContent = '\ufeff表格来源,页码,行号,内容\n';

            for (const table of this.allTables) {
                for (let rowIdx = 0; rowIdx < table.data.length; rowIdx++) {
                    const row = table.data[rowIdx];
                    // 将行数据组合成一个字符串
                    const rowContent = row.join(' | ');
                    // 转义CSV中的引号
                    const escapedContent = `"${String(rowContent).replace(/"/g, '""')}"`;
                    csvContent += `${table.tableId},${table.page},${rowIdx + 1},${escapedContent}\n`;
                }
            }

            fs.writeFileSync(outputPath, csvContent, 'utf-8');
            console.log(`\n✅ CSV文件已导出: ${outputPath}`);
            return outputPath;

        } catch (error) {
            console.error(`❌ 导出CSV时出错: ${error.message}`);
            return null;
        }
    }

    exportToJSON(outputFilename = null) {
        if (this.allTables.length === 0) {
            console.log('⚠️ 没有表格数据可导出');
            return null;
        }

        if (!outputFilename) {
            const baseName = path.basename(this.pdfPath, path.extname(this.pdfPath));
            outputFilename = `${baseName}_tables_skill.json`;
        }

        const outputPath = path.join(this.outputDir, outputFilename);

        try {
            const exportData = {
                source: this.pdfPath,
                extractionTime: this.extractionInfo.extractionTime,
                totalPages: this.extractionInfo.totalPages,
                totalTables: this.extractionInfo.totalTables,
                tables: this.allTables
            };

            fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
            console.log(`✅ JSON文件已导出: ${outputPath}`);
            return outputPath;

        } catch (error) {
            console.error(`❌ 导出JSON时出错: ${error.message}`);
            return null;
        }
    }

    generateReport(reportFilename = null) {
        if (!reportFilename) {
            const baseName = path.basename(this.pdfPath, path.extname(this.pdfPath));
            reportFilename = `${baseName}_report_skill.txt`;
        }

        const reportPath = path.join(this.outputDir, reportFilename);

        try {
            let reportContent = '='.repeat(60) + '\n';
            reportContent += 'PDF 表格提取报告（基于pdf-skills）\n';
            reportContent += '使用库: pdfjs-dist\n';
            reportContent += '='.repeat(60) + '\n\n';

            reportContent += `源文件: ${this.pdfPath}\n`;
            reportContent += `提取时间: ${this.extractionInfo.extractionTime}\n`;
            reportContent += `总页数: ${this.extractionInfo.totalPages}\n`;
            reportContent += `总表格数: ${this.extractionInfo.totalTables}\n\n`;

            reportContent += '-'.repeat(60) + '\n';
            reportContent += '表格详情:\n';
            reportContent += '-'.repeat(60) + '\n\n';

            for (let idx = 0; idx < this.allTables.length; idx++) {
                const table = this.allTables[idx];
                reportContent += `表格 ${idx + 1}: ${table.tableId}\n`;
                reportContent += `  位置: 第 ${table.page} 页\n`;
                reportContent += `  尺寸: ${table.shape[0]} 行 × ${table.shape[1]} 列\n`;
                
                // 添加完整的表格数据
                reportContent += `  完整数据:\n`;
                for (let j = 0; j < Math.min(table.data.length, 5); j++) {
                    reportContent += `    行${j + 1}: ${JSON.stringify(table.data[j])}\n`;
                }
                if (table.data.length > 5) {
                    reportContent += `    ... (共${table.data.length}行)\n`;
                }
                reportContent += '\n';
            }

            reportContent += '='.repeat(60) + '\n';

            fs.writeFileSync(reportPath, reportContent, 'utf-8');
            console.log(`📋 提取报告已生成: ${reportPath}`);
            return reportPath;

        } catch (error) {
            console.error(`⚠️ 生成报告时出错: ${error.message}`);
            return null;
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 提取摘要');
        console.log('='.repeat(60));
        console.log(`源文件: ${this.pdfPath}`);
        console.log(`提取时间: ${this.extractionInfo.extractionTime}`);
        console.log(`总页数: ${this.extractionInfo.totalPages}`);
        console.log(`总表格数: ${this.extractionInfo.totalTables}`);
        console.log('='.repeat(60));
    }
}

// 主函数
async function main() {
    const pdfPath = path.join(__dirname, 'chinese_document.pdf');
    const outputDir = __dirname;

    if (!fs.existsSync(pdfPath)) {
        console.error(`❌ 错误: PDF文件不存在 - ${pdfPath}`);
        return;
    }

    console.log('🚀 PDF表格提取工具（基于pdf-skills的pdfjs-dist方案）');
    console.log('');

    // 创建提取器实例
    const extractor = new PDFTableExtractor(pdfPath, outputDir);

    // 执行提取
    if (await extractor.extractAllTables()) {
        // 打印摘要
        extractor.printSummary();

        // 导出结果
        const csvPath = extractor.exportToCSV();
        const jsonPath = extractor.exportToJSON();
        const reportPath = extractor.generateReport();

        console.log('\n' + '🎉 提取完成!' + '\n');

        if (csvPath) console.log(`📁 CSV文件: ${csvPath}`);
        if (jsonPath) console.log(`📁 JSON文件: ${jsonPath}`);
        if (reportPath) console.log(`📁 报告文件: ${reportPath}`);
    } else {
        console.log('\n❌ 提取失败，请检查错误信息');
    }
}

// 运行
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
