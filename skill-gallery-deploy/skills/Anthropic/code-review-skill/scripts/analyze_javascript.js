#!/usr/bin/env node
/**
 * JavaScript/TypeScript 代码分析脚本
 * 使用 ESLint 进行代码质量检查
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置选项
const config = {
  inputFile: process.argv[2],
  outputFile: process.argv[3] || './analysis_result.json',
  quick: process.argv.includes('--quick')
};

if (!config.inputFile) {
  console.error('错误: 请指定要分析的文件');
  console.error('用法: node analyze_javascript.js <file> [--output <output>] [--quick]');
  process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(config.inputFile)) {
  console.error(`错误: 文件不存在: ${config.inputFile}`);
  process.exit(1);
}

console.log(`📝 分析文件: ${config.inputFile}`);

/**
 * 运行 ESLint 分析
 */
function runESLint(filePath) {
  try {
    // 检查是否安装了 ESLint
    try {
      execSync('npx eslint --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  ESLint 未安装，尝试安装...');
      execSync('npm install eslint --save-dev', { stdio: 'inherit' });
    }

    // 构建 ESLint 命令
    let eslintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.eslintrc.json');
    if (!fs.existsSync(eslintConfig)) {
      eslintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.eslintrc.default.json');
    }

    const command = `npx eslint --format json --config "${eslintConfig}" "${filePath}"`;
    
    console.log('运行 ESLint...');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    const results = JSON.parse(output);

    return results;
  } catch (error) {
    // ESLint 返回非零退出码表示发现问题，但输出仍然有效
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch (e) {
        console.error('解析 ESLint 输出失败:', e.message);
        return null;
      }
    }
    console.error('ESLint 执行失败:', error.message);
    return null;
  }
}

/**
 * 分析圈复杂度
 */
function calculateComplexity(code) {
  // 简化的圈复杂度计算（基于关键字）
  const patterns = [
    /if\s*\\(/g,
    /else\s+if\s*\\(/g,
    /for\s*\\(/g,
    /while\s*\\(/g,
    /case\s+/g,
    /catch\s*\\(/g,
    /\\?/g,
    /&&/g,
    /\\|\\|/g
  ];

  let complexity = 1;
  for (const pattern of patterns) {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }

  return complexity;
}

/**
 * 分析代码行数
 */
function analyzeLinesOfCode(code) {
  const lines = code.split('\n');
  const totalLines = lines.length;
  const codeLines = lines.filter(line => 
    line.trim() !== '' && 
    !line.trim().startsWith('//') && 
    !line.trim().startsWith('*') &&
    !line.trim().startsWith('/*') &&
    !line.trim().startsWith('*/')
  ).length;
  
  return { totalLines, codeLines, blankLines: totalLines - codeLines };
}

/**
 * 分析函数大小
 */
function analyzeFunctions(code) {
  const functionRegex = /function\\s+\\w+\\s*\\([^)]*\\)\\s*\\{[^}]*\\}|const\\s+\\w+\\s*=\\s*(\\([^)]*\\)\\s*=>\\s*\\{[^}]*\\}|\\([^)]*\\)\\s*=>[^;\\n]+)/g;
  const functions = [];
  let match;

  while ((match = functionRegex.exec(code)) !== null) {
    const functionCode = match[0];
    const lines = functionCode.split('\n').length;
    const complexity = calculateComplexity(functionCode);
    
    functions.push({
      name: match[1] || 'anonymous',
      lines: lines,
      complexity: complexity,
      isTooLong: lines > 50,
      isComplex: complexity > 10
    });
  }

  return functions;
}

/**
 * 转换 ESLint 结果为标准格式
 */
function transformESLintResults(eslintResults) {
  if (!eslintResults || !eslintResults[0]) {
    return { issues: [], metrics: {} };
  }

  const file = eslintResults[0];
  const issues = [];
  const metrics = {
    severity: { error: 0, warning: 0 },
    ruleTypes: {
      security: 0,
      quality: 0,
      style: 0,
      performance: 0
    }
  };

  for (const message of file.messages) {
    // 确定问题级别
    let severity = 'warning';
    if (message.severity === 2) {
      severity = 'critical';
      metrics.severity.error++;
    } else {
      metrics.severity.warning++;
    }

    // 确定问题类型（基于规则ID）
    let type = 'style';
    if (message.ruleId) {
      if (message.ruleId.includes('security') || 
          message.ruleId.includes('no-unsafe') ||
          message.ruleId.includes('no-eval')) {
        type = 'security';
      } else if (message.ruleId.includes('complexity') ||
                 message.ruleId.includes('max-lines') ||
                 message.ruleId.includes('no-unused')) {
        type = 'quality';
      } else if (message.ruleId.includes('perf') ||
                 message.ruleId.includes('no-loop')) {
        type = 'performance';
      }
    }
    metrics.ruleTypes[type]++;

    issues.push({
      line: message.line,
      column: message.column,
      severity: severity,
      type: type,
      ruleId: message.ruleId || 'unknown',
      message: message.message,
      suggestion: message.fix ? '可自动修复' : '需要手动修复'
    });
  }

  return { issues, metrics };
}

/**
 * 生成分析报告
 */
function generateReport(eslintResults, complexity, linesInfo, functions) {
  const transformed = transformESLintResults(eslintResults);
  
  // 计算质量分数（0-100）
  const score = Math.max(0, 100 - 
    (transformed.metrics.severity.error * 10) - 
    (transformed.metrics.severity.warning * 2) -
    (functions.filter(f => f.isComplex).length * 5) -
    (functions.filter(f => f.isTooLong).length * 3)
  );

  return {
    file: config.inputFile,
    language: 'JavaScript',
    timestamp: new Date().toISOString(),
    score: score,
    qualityGrade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',
    metrics: {
      ...linesInfo,
      complexity: complexity,
      functions: {
        total: functions.length,
        complexFunctions: functions.filter(f => f.isComplex).length,
        longFunctions: functions.filter(f => f.isTooLong).length
      },
      ...transformed.metrics
    },
    issues: transformed.issues,
    functions: functions,
    recommendations: generateRecommendations(transformed.issues, functions)
  };
}

/**
 * 生成改进建议
 */
function generateRecommendations(issues, functions) {
  const recommendations = [];

  // 安全问题
  const securityIssues = issues.filter(i => i.type === 'security' || i.severity === 'critical');
  if (securityIssues.length > 0) {
    recommendations.push({
      type: 'security',
      priority: 'high',
      message: `发现 ${securityIssues.length} 个安全问题，建议立即修复`,
      actions: securityIssues.map(i => `第 ${i.line} 行: ${i.message}`)
    });
  }

  // 复杂度问题
  const complexFunctions = functions.filter(f => f.isComplex);
  if (complexFunctions.length > 0) {
    recommendations.push({
      type: 'quality',
      priority: 'medium',
      message: `${complexFunctions.length} 个函数复杂度过高（>10），建议重构`,
      functions: complexFunctions.map(f => f.name)
    });
  }

  // 长函数
  const longFunctions = functions.filter(f => f.isTooLong);
  if (longFunctions.length > 0) {
    recommendations.push({
      type: 'quality',
      priority: 'medium',
      message: `${longFunctions.length} 个函数过长（>50行），建议拆分`,
      functions: longFunctions.map(f => f.name)
    });
  }

  // 代码风格
  const styleIssues = issues.filter(i => i.type === 'style');
  if (styleIssues.length > 0) {
    recommendations.push({
      type: 'style',
      priority: 'low',
      message: `${styleIssues.length} 个代码风格问题，可以自动修复`,
      actions: ['运行: npx eslint --fix your_file.js']
    });
  }

  return recommendations;
}

/**
 * 主函数
 */
function main() {
  try {
    // 读取文件内容
    const code = fs.readFileSync(config.inputFile, 'utf8');
    
    // 运行 ESLint
    const eslintResults = runESLint(config.inputFile);
    
    // 计算复杂度
    const complexity = calculateComplexity(code);
    const linesInfo = analyzeLinesOfCode(code);
    const functions = analyzeFunctions(code);
    
    // 生成报告
    const report = generateReport(eslintResults, complexity, linesInfo, functions);
    
    // 输出结果
    console.log(`\\n✅ 分析完成！`);
    console.log(`   质量分数: ${report.score}/100 (${report.qualityGrade})`);
    console.log(`   代码行数: ${report.metrics.codeLines}`);
    console.log(`   圈复杂度: ${complexity}`);
    console.log(`   函数数量: ${functions.length}`);
    console.log(`   问题数量: ${report.issues.length} (${report.metrics.severity.error} 严重, ${report.metrics.severity.warning} 警告)`);
    
    // 保存结果
    fs.mkdirSync(path.dirname(config.outputFile), { recursive: true });
    fs.writeFileSync(config.outputFile, JSON.stringify(report, null, 2));
    console.log(`\\n📄 报告已保存: ${config.outputFile}`);
    
  } catch (error) {
    console.error('分析失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
