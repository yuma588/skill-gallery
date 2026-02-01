#!/usr/bin/env node
/**
 * 生成代码审查报告
 * 将分析结果转换为 Markdown 或 HTML 格式
 */

const fs = require('fs');
const path = require('path');

// 配置选项
const config = {
  inputFile: process.argv[2],
  outputFile: process.argv[3] || './review_report.md',
  format: process.argv.includes('--html') ? 'html' : 'markdown',
  type: process.argv.includes('--type') ? process.argv[process.argv.indexOf('--type') + 1] : 'full'
};

if (!config.inputFile) {
  console.error('错误: 请指定输入文件');
  console.error('用法: node generate_report.js --input <file> [--output <file>] [--format markdown|html]');
  process.exit(1);
}

console.log(`📄 生成报告...`);
console.log(`   输入: ${config.inputFile}`);
console.log(`   输出: ${config.outputFile}`);

/**
 * 读取分析结果
 */
function readAnalysisResults(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取分析结果失败:', error.message);
    process.exit(1);
  }
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(results) {
  const isSummary = results.results !== undefined;
  const data = isSummary ? results.results : [results];
  
  let md = '';

  // 标题
  md += '# 代码审查报告\\n\\n';
  md += `**生成时间:** ${new Date().toLocaleString('zh-CN')}\\n\\n`;
  
  if (isSummary) {
    md += '## 执行摘要\\n\\n';
    md += `- **总计文件:** ${results.totalFiles}\\n`;
    md += `- **成功分析:** ${results.successCount}\\n`;
    md += `- **分析失败:** ${results.failureCount}\\n\\n';
  }

  // 详细报告
  for (let i = 0; i < data.length; i++) {
    const result = data[i];
    if (!result.success) continue;
    
    const fileResult = isSummary ? readAnalysisResults(result.outputPath) : result;
    
    md += `## 文件 ${i + 1}: ${path.basename(fileResult.file)}\\n\\n`;
    
    // 质量评分
    const gradeColor = fileResult.qualityGrade === 'A' ? '🟢' : 
                       fileResult.qualityGrade === 'B' ? '🟡' : 
                       fileResult.qualityGrade === 'C' ? '🟠' : '🔴';
    
    md += `### 质量评估\\n\\n`;
    md += `${gradeColor} **质量分数:** ${fileResult.score}/100 (等级: ${fileResult.qualityGrade})\\n\\n`;
    
    // 代码指标
    md += `### 代码指标\\n\\n`;
    md += `| 指标 | 值 |\\n`;
    md += `|------|-----|\\n`;
    md += `| 代码行数 | ${fileResult.metrics.codeLines} |\\n`;
    md += `| 空行数 | ${fileResult.metrics.blankLines} |\\n`;
    md += `| 圈复杂度 | ${fileResult.metrics.complexity} |\\n`;
    
    if (fileResult.metrics.functions) {
      md += `| 函数数量 | ${fileResult.metrics.functions.total} |\\n`;
      md += `| 复杂函数 | ${fileResult.metrics.functions.complexFunctions} |\\n`;
      md += `| 长函数 | ${fileResult.metrics.functions.longFunctions} |\\n`;
    }
    
    if (fileResult.metrics.pylint) {
      md += `| Pylint 错误 | ${fileResult.metrics.pylint.severity.error} |\\n`;
      md += `| Pylint 警告 | ${fileResult.metrics.pylint.severity.warning} |\\n`;
    }
    
    if (fileResult.metrics.bandit) {
      md += `| 安全问题 | ${fileResult.metrics.bandit.severity.error} |\\n`;
    }
    
    if (fileResult.metrics.severity) {
      md += `| 严重问题 | ${fileResult.metrics.severity.error} |\\n`;
      md += `| 警告 | ${fileResult.metrics.severity.warning} |\\n`;
    }
    
    md += '\\n';
    
    // 问题列表
    if (fileResult.issues && result.issues.length > 0) {
      md += `### 发现的问题\\n\\n`;
      
      // 按严重程度分组
      const critical = result.issues.filter(i => i.severity === 'critical');
      const warnings = result.issues.filter(i => i.severity === 'warning');
      const suggestions = result.issues.filter(i => i.severity === 'suggestion');
      
      if (critical.length > 0) {
        md += `#### 🔴 严重问题 (${critical.length})\\n\\n`;
        for (const issue of critical) {
          md += `- **第 ${issue.line} 行** [${issue.ruleId}]: ${issue.message}\\n`;
          if (issue.suggestion) {
            md += `  - 建议: ${issue.suggestion}\\n`;
          }
        }
        md += '\\n';
      }
      
      if (warnings.length > 0) {
        md += `#### 🟡 警告 (${warnings.length})\\n\\n`;
        for (const issue of warnings) {
          md += `- **第 ${issue.line} 行** [${issue.ruleId}]: ${issue.message}\\n`;
        }
        md += '\\n';
      }
      
      if (suggestions.length > 0) {
        md += `#### 🔵 建议 (${suggestions.length})\\n\\n`;
        for (const issue of suggestions) {
          md += `- **第 ${issue.line} 行** [${issue.ruleId}]: ${issue.message}\\n`;
        }
        md += '\\n';
      }
    } else {
      md += `### ✅ 未发现问题\\n\\n`;
      md += `恭喜！此文件通过了所有代码质量检查。\\n\\n`;
    }
    
    // 改进建议
    if (fileResult.recommendations && fileResult.recommendations.length > 0) {
      md += `### 改进建议\\n\\n`;
      for (const rec of fileResult.recommendations) {
        const priorityIcon = rec.priority === 'high' ? '🔴' : 
                            rec.priority === 'medium' ? '🟡' : '🔵';
        md += `#### ${priorityIcon} ${rec.type} (${rec.priority})\\n\\n`;
        md += `${rec.message}\\n\\n`;
        if (rec.actions) {
          md += `**操作步骤:**\\n`;
          for (const action of rec.actions) {
            md += `- ${action}\\n`;
          }
          md += '\\n';
        }
        if (rec.functions) {
          md += `**涉及函数:**\\n`;
          for (const func of rec.functions) {
            md += `- ${func}\\n`;
          }
          md += '\\n';
        }
      }
    }
    
    // 分隔线
    if (i < data.length - 1) {
      md += '---\\n\\n';
    }
  }
  
  // 页脚
  md += '\\n---\\n\\n';
  md += '*此报告由代码审查技能自动生成*\\n';
  
  return md;
}

/**
 * 生成 HTML 报告
 */
function generateHTMLReport(results) {
  const md = generateMarkdownReport(results);
  
  // 简单的 Markdown 到 HTML 转换（实际项目中应使用专业的转换库）
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>代码审查报告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
    }
    h3 {
      color: #555;
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #3498db;
      color: white;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .critical {
      color: #e74c3c;
      font-weight: bold;
    }
    .warning {
      color: #f39c12;
    }
    .suggestion {
      color: #3498db;
    }
    .grade-A {
      color: #27ae60;
      font-weight: bold;
    }
    .grade-B {
      color: #f39c12;
      font-weight: bold;
    }
    .grade-C, .grade-D {
      color: #e74c3c;
      font-weight: bold;
    }
    .code-block {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .metric-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 10px 0;
    }
    hr {
      border: none;
      border-top: 2px solid #eee;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
`;

  // 转换 Markdown 内容（简化版）
  html += md
    .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
    .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
    .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
    .replace(/#### (.*?)(\n|$)/g, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\\n/g, '<br>\n')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  html += `
  </div>
</body>
</html>`;

  return html;
}

/**
 * 主函数
 */
function main() {
  try {
    // 读取分析结果
    const results = readAnalysisResults(config.inputFile);
    
    // 生成报告
    let report;
    if (config.format === 'html') {
      report = generateHTMLReport(results);
      console.log('生成 HTML 格式报告...');
    } else {
      report = generateMarkdownReport(results);
      console.log('生成 Markdown 格式报告...');
    }
    
    // 确保输出目录存在
    fs.mkdirSync(path.dirname(config.outputFile), { recursive: true });
    
    // 保存报告
    fs.writeFileSync(config.outputFile, report, 'utf8');
    
    console.log(`✅ 报告已生成: ${config.outputFile}`);
    console.log(`   格式: ${config.format}`);
    console.log(`   大小: ${(report.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('生成报告失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
