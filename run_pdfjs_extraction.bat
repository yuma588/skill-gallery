@echo off
chcp 65001 >nul
echo ========================================
echo PDF表格提取工具（基于pdf-skills）
echo ========================================
echo.

echo 检查Node.js环境...
node --version
if errorlevel 1 (
    echo.
    echo ❌ 错误: 未检测到Node.js环境
    pause
    exit /b 1
)

echo.
echo 开始提取表格数据...
echo.
node extract_tables.js

echo.
echo ========================================
echo 按任意键退出...
pause >nul
