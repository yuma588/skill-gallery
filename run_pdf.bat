@echo off
chcp 65001 >nul
echo 开始生成中文PDF文档...
echo.

cd /d "d:\skill gallery"

if not exist "create_chinese_pdf.js" (
    echo 错误: 脚本文件不存在
    pause
    exit /b 1
)

echo 正在运行Node.js脚本...
node create_chinese_pdf.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 检查PDF文件...
    timeout /t 2 /nobreak >nul
    if exist "chinese_document.pdf" (
        echo.
        echo ✓ PDF生成成功!
        echo 文件位置: d:\skill gallery\chinese_document.pdf
    ) else (
        echo ⚠ PDF文件未找到
    )
) else (
    echo.
    echo ✗ 脚本执行失败
)

echo.
echo 完成!
pause
