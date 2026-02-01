#!/usr/bin/env node
/**
 * 统一代码分析入口脚本
 * 根据文件扩展名自动选择相应的分析工具
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 支持的语言及其对应的分析脚本
const LANGUAGE_MAP = {
  '.js': 'analyze_javascript.js',
  '.jsx': 'analyze_javascript.js',
  '.ts': 'analyze_javascript.js',
  '.tsx': 'analyze_javascript.js',
  '.py': 'analyze_python.js',
  '.java': 'analyze_java.js',
  '.go': 'analyze_go.js'
};

// 配置选项
const config = {
  inputPath: process.argv[2] || '.',
  outputDir: process.argv[3] || './reviews',
  quick: process.argv.includes('--quick'),
  verbose: process.argv.includes('--verbose')
};

/**
 * 获取文件的语言类型
 */
function getFileLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return LANGUAGE_MAP[ext] || null;
}

/**
 * 递归查找代码文件
 */
function findCodeFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 跳过 node_modules, .git 等目录
      if (!['node_modules', '.git', '.vscode', '__pycache__', 'venv', 'dist', 'build'].includes(entry.name)) {
        files.push(...findCodeFiles(fullPath));
      }
    } else if (entry.isFile()) {
      const language = getFileLanguage(fullPath);
      if (language) {
        files.push({ path: fullPath, language });
      }
    }
  }

  return files;
}

/**
 * 运行分析脚本
 */
function runAnalysis(filePath, language) {
  const scriptPath = path.join(__dirname, language);
  const outputPath = path.join(config.outputDir, `${path.basename(filePath, path.extname(filePath))}_analysis.json`);
  
  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  try {
    const command = `node "${scriptPath}" "${filePath}" --output "${outputPath}"${config.quick ? ' --quick' : ''}`;
    if (config.verbose) {
      console.log(`\n执行: ${command}`);
    }
    execSync(command, { stdio: 'inherit' });
    return { success: true, outputPath };
  } catch (error) {
    console.error(`✗ 分析失败: ${filePath}`);
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 生成汇总报告
 */
function generateSummary(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    successCount: results.filter(r => r.success).length,
    failureCount: results.filter(r => !r.success).length,
    results: results
  };

  const summaryPath = path.join(config.outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log(`\n📊 汇总报告已生成: ${summaryPath}`);
  return summary;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 开始代码分析...\n');
  
  // 检查输入路径是否存在
  if (!fs.existsSync(config.inputPath)) {
    console.error(`错误: 路径不存在: ${config.inputPath}`);
    process.exit(1);
  }

  let filesToAnalyze = [];

  if (fs.statSync(config.inputPath).isFile()) {
    // 分析单个文件
    const language = getFileLanguage(config.inputPath);
    if (!language) {
      console.error(`错误: 不支持的文件类型: ${path.extname(config.inputPath)}`);
      process.exit(1);
    }
    filesToAnalyze = [{ path: config.inputPath, language }];
  } else {
    // 分析整个目录
    console.log(`扫描目录: ${config.inputPath}`);
    filesToAnalyze = findCodeFiles(config.inputPath);
    console.log(`找到 ${filesToAnalyze.length} 个代码文件\n`);
  }

  // 确保输出目录存在
  fs.mkdirSync(config.outputDir, { recursive: true });

  // 运行分析
  const results = [];
  for (let i = 0; i < filesToAnalyze.length; i++) {
    const file = filesToAnalyze[i];
    console.log(`[${i + 1}/${filesToAnalyze.length}] 分析: ${file.path}`);
    
    const result = runAnalysis(file.path, file.language);
    results.push({
      file: file.path,
      language: file.language,
      ...result
    });
  }

  // 生成汇总报告
  const summary = generateSummary(results);

  // 打印统计信息
  console.log('\n' + '='.repeat(50));
  console.log('分析完成！');
  console.log(`总计文件: ${summary.totalFiles}`);
  console.log(`成功: ${summary.successCount}`);
  console.log(`失败: ${summary.failureCount}`);
  console.log('='.repeat(50));

  // 如果全部成功，提示可以生成报告
  if (summary.successCount > 0) {
    console.log(`\n提示: 运行以下命令生成详细报告:`);
    console.log(`node scripts/generate_report.js --input ${path.join(config.outputDir, 'summary.json')} --output ${path.join(config.outputDir, 'review_report.md')}`);
  }
}

// 运行主函数
main();
