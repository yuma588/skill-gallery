#!/usr/bin/env node
/**
 * 自动应用代码修复
 * 支持自动修复可修复的问题（如格式化、简单规范问题）
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置选项
const config = {
  file: process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : null,
  directory: process.argv.includes('--directory') ? process.argv[process.argv.indexOf('--directory') + 1] : null,
  fixLevel: process.argv.includes('--fix-level') ? process.argv[process.argv.indexOf('--fix-level') + 1] : 'warning',
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose')
};

if (!config.file && !config.directory) {
  console.error('错误: 请指定要修复的文件或目录');
  console.error('用法: node apply_fixes.js --file <file> | --directory <dir> [--fix-level warning|suggestion] [--dry-run]');
  process.exit(1);
}

console.log(`🔧 应用代码修复...`);
console.log(`   修复级别: ${config.fixLevel}`);
console.log(`   模拟运行: ${config.dryRun ? '是' : '否'}`);

/**
 * 运行 ESLint --fix
 */
function fixWithESLint(filePath) {
  try {
    // 检查是否安装了 ESLint
    try {
      execSync('npx eslint --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  ESLint 未安装，跳过 JavaScript 文件修复');
      return false;
    }

    let eslintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.eslintrc.json');
    if (!fs.existsSync(eslintConfig)) {
      eslintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.eslintrc.default.json');
    }

    const command = `npx eslint --fix --config "${eslintConfig}" "${filePath}"`;
    
    if (config.verbose) {
      console.log(`执行: ${command}`);
    }
    
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`修复失败: ${filePath}`);
    return false;
  }
}

/**
 * 运行 Pylint --fix
 */
function fixWithPylint(filePath) {
  try {
    // 检查是否安装了 Pylint
    try {
      execSync('pylint --version', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  Pylint 未安装，跳过 Python 文件修复');
      return false;
    }

    let pylintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.pylintrc');
    if (!fs.existsSync(pylintConfig)) {
      pylintConfig = path.join(__dirname, '..', 'references', 'tool_configurations', '.pylintrc.default');
    }

    // Pylint 本身不支持 --fix，这里使用 black 进行格式化
    const command = `black "${filePath}"`;
    
    if (config.verbose) {
      console.log(`执行: ${command}`);
    }
    
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`修复失败: ${filePath}`);
    return false;
  }
}

/**
 * 获取文件语言
 */
function getFileLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    return 'javascript';
  } else if (ext === '.py') {
    return 'python';
  } else if (ext === '.java') {
    return 'java';
  }
  return null;
}

/**
 * 修复单个文件
 */
function fixFile(filePath) {
  const language = getFileLanguage(filePath);
  if (!language) {
    console.warn(`跳过不支持的文件类型: ${filePath}`);
    return { success: false, reason: 'unsupported_type' };
  }

  console.log(`\\n修复文件: ${filePath}`);
  
  if (config.dryRun) {
    console.log('  [模拟运行] 跳过实际修复');
    return { success: true, fixed: true, language };
  }

  let fixed = false;
  
  if (language === 'javascript' || language === 'typescript') {
    fixed = fixWithESLint(filePath);
  } else if (language === 'python') {
    fixed = fixWithPylint(filePath);
  }

  return { success: fixed, fixed, language };
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
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * 主函数
 */
function main() {
  try {
    const startTime = Date.now();
    let results = [];
    
    if (config.file) {
      // 修复单个文件
      const result = fixFile(config.file);
      results.push({ file: config.file, ...result });
    } else if (config.directory) {
      // 修复整个目录
      console.log(`\\n扫描目录: ${config.directory}`);
      const files = findCodeFiles(config.directory);
      console.log(`找到 ${files.length} 个代码文件\\n`);
      
      for (let i = 0; i < files.length; i++) {
        const result = fixFile(files[i]);
        results.push({ file: files[i], ...result });
        
        if (config.verbose && i < files.length - 1) {
          console.log('---');
        }
      }
    }
    
    // 统计结果
    const fixedCount = results.filter(r => r.fixed).length;
    const failedCount = results.filter(r => r.success === false).length;
    const skippedCount = results.filter(r => r.reason === 'unsupported_type').length;
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // 打印统计
    console.log('\\n' + '='.repeat(50));
    console.log('修复完成！');
    console.log(`总计文件: ${results.length}`);
    console.log(`已修复: ${fixedCount}`);
    console.log(`修复失败: ${failedCount}`);
    console.log(`已跳过: ${skippedCount}`);
    console.log(`耗时: ${elapsedTime} 秒`);
    console.log('='.repeat(50));
    
    if (config.dryRun) {
      console.log('\\n提示: 使用 --no-dry-run 实际应用修复');
    }
    
  } catch (error) {
    console.error('修复失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
