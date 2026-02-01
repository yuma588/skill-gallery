#!/usr/bin/env node
/**
 * Python 代码分析脚本
 * 使用 Pylint 和 Bandit 进行代码质量检查
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
  console.error('用法: node analyze_python.js <file> [--output <output>] [--quick]');
  process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(config.inputFile)) {
  console.error(`错误: 文件不存在: ${config.inputFile}`);
  process.exit(1);
}

console.log(`📝 分析文件: ${config.inputFile}`);

/**
 * 运行 Pylint 分析
 */
function runPylint(filePath) {
  try {
    // 检查是否安装了 Pylint
    try {
      execSync('pylint --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  Pylint 未安装，请运行: pip install pylint');
      return null;
    }

    // 构建 Pylint 命令
    let pylintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.pylintrc');
    if (!fs.existsSync(pylintConfig)) {
      pylintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.pylintrc.default');
    }

    const command = `pylint --rcfile="${pylintConfig}" --output-format=json "${filePath}"`;
    
    console.log('运行 Pylint...');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return JSON.parse(output || '[]');
  } catch (error) {
    // Pylint 返回非零退出码表示发现问题，但输出仍然有效
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout || '[]');
      } catch (e) {
        console.error('解析 Pylint 输出失败:', e.message);
        return [];
      }
    }
    return [];
  }
}

/**
 * 运行 Bandit 安全分析
 */
function runBandit(filePath) {
  try {
    // 检查是否安装了 Bandit
    try {
      execSync('bandit --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  Bandit 未安装，跳过安全分析');
      return [];
    }

    const command = `bandit -f json "${filePath}"`;
    
    console.log('运行 Bandit 安全检查...');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    const result = JSON.parse(output);
    return result.results || [];
  } catch (error) {
    // Bandit 返回非零退出码表示发现问题
    if (error.stdout) {
      try {
        const result = JSON.parse(error.stdout);
        return result.results || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

/**
 * 分析圈复杂度（简化版本）
 */
function calculateComplexity(code) {
  const patterns = [
    /if\s+/g,
    /elif\s+/g,
    /for\s+/g,
    /while\s+/g,
    /except\s+/g,
    /except\s+[^:]+:/g,
    /except\s*\(/g
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
    !line.trim().startsWith('#')
  ).length;
  
  return { totalLines, codeLines, blankLines: totalLines - codeLines };
}

/**
 * 分析函数/方法
 */
function analyzeFunctions(code) {
  const functionRegex = /def\\s+(\\w+)\\s*\\([^)]*\\)\\s*:/g;
  const functions = [];
  let match;

  while ((match = functionRegex.exec(code)) !== null) {
    const funcName = match[1];
    const funcStart = match.index;
    
    // 简化：只计算到下一个 def 或 class
    let funcEnd = code.indexOf('\\ndef ', funcStart + 1);
    if (funcEnd === -1) funcEnd = code.indexOf('\\nclass ', funcStart + 1);
    if (funcEnd === -1) funcEnd = code.length;

    const funcCode = code.substring(funcStart, funcEnd);
    const lines = funcCode.split('\n').length;
    const complexity = calculateComplexity(funcCode);
    
    functions.push({
      name: funcName,
      lines: lines,
      complexity: complexity,
      isTooLong: lines > 50,
      isComplex: complexity > 10
    });
  }

  return functions;
}

/**
 * 转换 Pylint 结果为标准格式
 */
function transformPylintResults(pylintResults) {
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

  for (const message of pylintResults) {
    let severity = 'warning';
    if (['E', 'F'].includes(message.type)) {
      severity = 'critical';
      metrics.severity.error++;
    } else {
      metrics.severity.warning++;
    }

    let type = 'style';
    const msgSymbol = message['message-id'] || '';
    if (msgSymbol.includes('security') || 
        msgSymbol.includes('C0301')) {
      type = 'security';
    } else if (msgSymbol.includes('C0103') ||
               msgSymbol.includes('C0111') ||
               msgSymbol.includes('R0903')) {
      type = 'quality';
    }

    metrics.ruleTypes[type]++;

    issues.push({
      line: message.line,
      column: message.column,
      severity: severity,
      type: type,
      ruleId: message['message-id'],
      message: message.message,
      suggestion: message.symbol
    });
  }

  return { issues, metrics };
}

/**
 * 转换 Bandit 结果为标准格式
 */
function transformBanditResults(banditResults) {
  const issues = [];
  const metrics = {
    severity: { error: 0, warning: 0 },
    ruleTypes: { security: 0 }
  };

  for (const result of banditResults) {
    const severity = result.issue_severity.toLowerCase();
    issues.push({
      line: result.line_number,
      column: 0,
      severity: severity === 'high' || severity === 'medium' ? 'critical' : 'warning',
      type: 'security',
      ruleId: result.test_id,
      message: result.issue_text,
      suggestion: result.more_info || ''
    });
    metrics.severity.error++;
    metrics.ruleTypes.security++;
  }

  return { issues, metrics };
}

/**
 * 生成分析报告
 */
function generateReport(pylintResults, banditResults, complexity, linesInfo, functions) {
  const pylintTransformed = transformPylintResults(pylintResults);
  const banditTransformed = transformBanditResults(banditResults);
  
  const allIssues = [...pylintTransformed.issues, ...banditTransformed.issues];
  
  // 计算质量分数（0-100）
  const score = Math.max(0, 100 - 
    (pylintTransformed.metrics.severity.error * 5) - 
    (pylintTransformed.metrics.severity.warning * 1) -
    (banditTransformed.metrics.severity.error * 15) -
    (functions.filter(f => f.isComplex).length * 5) -
    (functions.filter(f => f.isTooLong).length * 3)
  );

  return {
    file: config.inputFile,
    language: 'Python',
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
      pylint: pylintTransformed.metrics,
      bandit: banditTransformed.metrics
    },
    issues: allIssues.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, suggestion: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    functions: functions,
    recommendations: generateRecommendations(allIssues, functions)
  };
}

/**
 * 生成改进建议
 */
function generateRecommendations(issues, functions) {
  const recommendations = [];

  // 安全问题
  const securityIssues = issues.filter(i => i.type === 'security');
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

  return recommendations;
}

/**
 * 主函数
 */
function main() {
  try {
    // 读取文件内容
    const code = fs.readFileSync(config.inputFile, 'utf8');
    
    // 运行分析工具
    const pylintResults = runPylint(config.inputFile) || [];
    const banditResults = runBandit(config.inputFile);
    
    // 计算复杂度
    const complexity = calculateComplexity(code);
    const linesInfo = analyzeLinesOfCode(code);
    const functions = analyzeFunctions(code);
    
    // 生成报告
    const report = generateReport(pylintResults, banditResults, complexity, linesInfo, functions);
    
    // 输出结果
    console.log(`\\n✅ 分析完成！`);
    console.log(`   质量分数: ${report.score}/100 (${report.qualityGrade})`);
    console.log(`   代码行数: ${report.metrics.codeLines}`);
    console.log(`   圈复杂度: ${complexity}`);
    console.log(`   函数数量: ${functions.length}`);
    console.log(`   Pylint 问题: ${report.metrics.pylint.severity.error + report.metrics.pylint.severity.warning}`);
    console.log(`   安全问题: ${report.metrics.bandit.severity.error}`);
    
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
