# PowerShell脚本：运行中文PDF生成
$ErrorActionPreference = "Continue"

Write-Host "开始生成中文PDF文档..." -ForegroundColor Green

$scriptPath = "d:\skill gallery\create_chinese_pdf.js"
$pdfPath = "d:\skill gallery\chinese_document.pdf"

Write-Host "脚本路径: $scriptPath" -ForegroundColor Yellow

# 检查脚本是否存在
if (-not (Test-Path $scriptPath)) {
    Write-Host "错误: 脚本文件不存在" -ForegroundColor Red
    exit 1
}

# 运行Node.js脚本
try {
    Write-Host "正在运行Node.js脚本..." -ForegroundColor Yellow
    node $scriptPath
    
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
        # 检查PDF是否生成
        Start-Sleep -Seconds 2
        if (Test-Path $pdfPath) {
            Write-Host "✓ PDF生成成功!" -ForegroundColor Green
            Write-Host "文件位置: $pdfPath" -ForegroundColor Cyan
        } else {
            Write-Host "⚠ PDF文件未找到，可能正在生成中" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ 脚本执行失败，退出代码: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 执行出错: $_" -ForegroundColor Red
    exit 1
}

Write-Host "完成!" -ForegroundColor Green
