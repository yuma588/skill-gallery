#!/usr/bin/env node
/**
 * PDF表格提取工具 (JavaScript版本)
 * 使用pdf-parse提取PDF内容并尝试识别表格
 */

const fs = require('fs');
const path = require('path');

// 检查依赖
let pdfParse;
try {
    pdfParse = require('pdf-parse');
} catch (e) {
    console.error('❌ 错误: 缺少pdf-parse依赖');
    console.log('请运行: npm install pdf-parse');
    process.exit(1);
}

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
            const dataBuffer = fs.readFileSync(this.pdfPath);
            
            // 使用pdf-parse直接解析
            const data = await pdfParse(dataBuffer);

            this.extractionInfo.totalPages = data.numpages;
            this.extractionInfo.extractionTime = new Date().toLocaleString('zh-CN');

            console.log(`📊 总页数: ${data.numpages}`);
            console.log(`📝 文本长度: ${data.text.length} 字符\n`);

            // 打印部分文本内容以便调试
            console.log('文本预览:');
            console.log('-'.repeat(60));
            const preview = data.text.substring(0, 500);
            console.log(preview);
            console.log('-'.repeat(60));
            console.log('');

            // 解析文本，尝试识别表格
            this.parseTables(data.text);

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

        const lines = text.split('\n');
        let currentTable = null;
        let tableStartPage = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) continue;

            // 检测表格特征：多个连续的制表符、竖线或数字密集
            const hasTabDelimiters = line.includes('\t');
            const hasPipes = line.includes('|') && line.split('|').length >= 4;
            const isDenseNumbers = /(\d+[\s\t]+){3,}/.test(line);

            // 更宽松的表格检测：如果一行有多个连续的空格分隔的词
            const multipleSpaces = line.split(/\s{2,}/).length >= 3;

            if (hasTabDelimiters || hasPipes || isDenseNumbers || multipleSpaces) {
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

                if (columns.length > 1) {
                    currentTable.push(columns);
                }
            } else {
                // 表格结束
                if (currentTable && currentTable.length > 1) {
                    this.allTables.push({
                        page: tableStartPage,
                        data: currentTable,
                        shape: [currentTable.length, currentTable[0]?.length || 0],
                        tableId: `Table_${this.allTables.length + 1}`
                    });
                    console.log(`✅ 识别到表格 ${this.allTables.length}: ${currentTable.length}行 × ${currentTable[0]?.length || 0}列`);
                }
                currentTable = null;
            }
        }

        // 处理最后一个表格
        if (currentTable && currentTable.length > 1) {
            this.allTables.push({
                page: tableStartPage,
                data: currentTable,
                shape: [currentTable.length, currentTable[0]?.length || 0],
                tableId: `Table_${this.allTables.length + 1}`
            });
        }
    }

    estimatePage(currentLine, totalLines, totalPages) {
        // 估算当前行所在的页码
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
            outputFilename = `${baseName}_tables.csv`;
        }

        const outputPath = path.join(this.outputDir, outputFilename);

        try {
            let csvContent = '表格来源,页码,行号,内容\n';

            for (const table of this.allTables) {
                for (let rowIdx = 0; rowIdx < table.data.length; rowIdx++) {
                    const row = table.data[rowIdx];
                    // 转义CSV中的引号和逗号
                    const escapedRow = row.map(cell =>
                        `"${String(cell).replace(/"/g, '""')}"`
                    ).join(',');
                    csvContent += `${table.tableId},${table.page},${rowIdx + 1},${escapedRow}\n`;
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
            outputFilename = `${baseName}_tables.json`;
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
            reportFilename = `${baseName}_report.txt`;
        }

        const reportPath = path.join(this.outputDir, reportFilename);

        try {
            let reportContent = '='.repeat(60) + '\n';
            reportContent += 'PDF 表格提取报告\n';
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
                
                // 添加前几行作为预览
                reportContent += `  预览:\n`;
                const previewRows = table.data.slice(0, 3);
                for (let j = 0; j < previewRows.length; j++) {
                    reportContent += `    行${j + 1}: ${JSON.stringify(previewRows[j]).substring(0, 100)}...\n`;
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
    console.error(' Fatal error:', error);
    process.exit(1);
});
