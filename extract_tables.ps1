# PDF表格提取工具 - PowerShell脚本

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "PDF表格提取工具"  -ForegroundColor Cyan
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host ""

# 检查Python
Write-Host "[1/3] 检查Python环境..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 未检测到Python，请先安装Python" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit 1
}

# 安装依赖
Write-Host "`n[2/3] 安装依赖包..." -ForegroundColor Yellow
Write-Host "正在安装: pdfplumber, pandas, openpyxl" -ForegroundColor Cyan
python -m pip install pdfplumber pandas openpyxl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 依赖包安装完成" -ForegroundColor Green
} else {
    Write-Host "⚠️ 警告: 依赖安装可能失败，尝试继续运行..." -ForegroundColor Yellow
}

# 运行脚本
Write-Host "`n[3/3] 运行表格提取脚本..." -ForegroundColor Yellow
python extract_tables.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 脚本运行完成" -ForegroundColor Green
} else {
    Write-Host "`n❌ 脚本运行失败" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "按Enter键退出..." -ForegroundColor Cyan
Read-Host
