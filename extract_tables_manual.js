#!/usr/bin/env node
/**
 * PDF表格提取工具 - 手动解析版本
 * 基于pdf-skills的思路，但手动解析中文文本
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
            const data = await pdfParse(dataBuffer);

            this.extractionInfo.totalPages = data.numpages;
            this.extractionInfo.extractionTime = new Date().toLocaleString('zh-CN');

            console.log(`📊 总页数: ${data.numpages}`);
            console.log(`📝 文本长度: ${data.text.length} 字符\n`);

            // 打印完整文本内容
            console.log('完整文本内容:');
            console.log('='.repeat(60));
            console.log(data.text);
            console.log('='.repeat(60));
            console.log('');

            // 手动解析表格
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
        console.log('开始手动解析表格...');
        console.log('-'.repeat(60));

        const lines = text.split('\n');
        let tableData = null;
        let inTableSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) continue;

            // 检测表格标题
            if (line.includes('节日名称') && (line.includes('日期') || line.includes('习俗'))) {
                console.log(`✅ 检测到表格标题行: ${line}`);
                
                // 分析标题结构
                let columns = ['节日名称', '日期', '主要习俗'];
                
                tableData = {
                    title: '中国传统节日',
                    headers: columns,
                    rows: []
                };
                inTableSection = true;
                continue;
            }

            // 检测表格内容行
            if (inTableSection && tableData) {
                // 检测节日名称（以节结尾或包含"节"）
                const festivalMatch = line.match(/^(春节|元宵节|清明节|端午节|中秋节|重阳节|七夕节|腊八节|冬至)/);
                
                if (festivalMatch) {
                    const festivalName = festivalMatch[1];
                    const remainingText = line.substring(festivalName.length).trim();
                    
                    // 尝试分割日期和习俗
                    let date = '';
                    let custom = '';
                    
                    // 查找日期模式
                    const dateMatch = remainingText.match(/(农历正月初一|农历正月十五|公历4月4-6日|农历五月初五|农历八月十五|农历九月初九)/);
                    if (dateMatch) {
                        date = dateMatch[1];
                        custom = remainingText.substring(dateMatch.index + dateMatch[1].length).trim();
                    } else {
                        // 如果没有明确的日期分隔，尝试其他方式
                        custom = remainingText;
                    }
                    
                    console.log(`  - ${festivalName}: ${date} | ${custom}`);
                    
                    tableData.rows.push({
                        '节日名称': festivalName,
                        '日期': date,
                        '主要习俗': custom
                    });
                } else {
                    // 检查是否离开了表格区域
                    if (line.length > 50 && !line.includes('节')) {
                        inTableSection = false;
                        if (tableData.rows.length > 0) {
                            this.allTables.push(tableData);
                            console.log(`\n✅ 表格提取完成: ${tableData.rows.length} 行数据\n`);
                        }
                        tableData = null;
                    }
                }
            }
        }

        // 处理最后的表格
        if (tableData && tableData.rows.length > 0) {
            this.allTables.push(tableData);
            console.log(`✅ 表格提取完成: ${tableData.rows.length} 行数据\n`);
        }
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
            let csvContent = '\ufeff'; // BOM for Excel

            for (const table of this.allTables) {
                csvContent += `表格: ${table.title}\n`;
                csvContent += `表格来源,页码,${table.headers.join(',')}\n`;
                
                for (let rowIdx = 0; rowIdx < table.rows.length; rowIdx++) {
                    const row = table.rows[rowIdx];
                    const values = table.headers.map(header => {
                        return `"${String(row[header] || '').replace(/"/g, '""')}"`;
                    });
                    csvContent += `Table_1,,${values.join(',')}\n`;
                }
                
                csvContent += '\n';
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

    exportToMarkdown(outputFilename = null) {
        if (this.allTables.length === 0) {
            console.log('⚠️ 没有表格数据可导出');
            return null;
        }

        if (!outputFilename) {
            const baseName = path.basename(this.pdfPath, path.extname(this.pdfPath));
            outputFilename = `${baseName}_tables.md`;
        }

        const outputPath = path.join(this.outputDir, outputFilename);

        try {
            let mdContent = '# PDF表格提取结果\n\n';
            mdContent += `**源文件**: ${this.pdfPath}\n`;
            mdContent += `**提取时间**: ${this.extractionInfo.extractionTime}\n`;
            mdContent += `**总页数**: ${this.extractionInfo.totalPages}\n`;
            mdContent += `**总表格数**: ${this.extractionInfo.totalTables}\n\n`;

            for (let table of this.allTables) {
                mdContent += `## ${table.title}\n\n`;
                mdContent += `| ${table.headers.join(' | ')} |\n`;
                mdContent += `| ${table.headers.map(() => '---').join(' | ')} |\n`;
                
                for (const row of table.rows) {
                    const values = table.headers.map(header => row[header] || '');
                    mdContent += `| ${values.join(' | ')} |\n`;
                }
                
                mdContent += '\n';
            }

            fs.writeFileSync(outputPath, mdContent, 'utf-8');
            console.log(`✅ Markdown文件已导出: ${outputPath}`);
            return outputPath;

        } catch (error) {
            console.error(`❌ 导出Markdown时出错: ${error.message}`);
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
        
        if (this.allTables.length > 0) {
            console.log('\n表格详情:');
            for (let i = 0; i < this.allTables.length; i++) {
                const table = this.allTables[i];
                console.log(`  表格${i + 1}: ${table.title} (${table.rows.length}行)`);
            }
        }
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

    console.log('🚀 PDF表格提取工具（基于pdf-skills - 手动解析版）');
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
        const mdPath = extractor.exportToMarkdown();

        console.log('\n' + '🎉 提取完成!' + '\n');

        if (csvPath) console.log(`📁 CSV文件: ${csvPath}`);
        if (jsonPath) console.log(`📁 JSON文件: ${jsonPath}`);
        if (mdPath) console.log(`📁 Markdown文件: ${mdPath}`);
    } else {
        console.log('\n❌ 提取失败，请检查错误信息');
    }
}

// 运行
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
