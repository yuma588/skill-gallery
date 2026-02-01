@echo off
chcp 65001 >nul
echo ========================================
echo PDF表格提取工具 - 自动运行脚本
echo ========================================
echo.

echo [1/3] 检查Python环境...
python --version
if errorlevel 1 (
    echo ❌ 错误: 未检测到Python，请先安装Python
    pause
    exit /b 1
)
echo ✅ Python环境正常
echo.

echo [2/3] 安装依赖包...
echo 正在安装: pdfplumber, pandas, openpyxl
python -m pip install pdfplumber pandas openpyxl
if errorlevel 1 (
    echo ⚠️ 警告: 依赖安装可能失败，尝试继续运行...
) else (
    echo ✅ 依赖包安装完成
)
echo.

echo [3/3] 运行表格提取脚本...
python extract_tables.py
if errorlevel 1 (
    echo ❌ 脚本运行失败
) else (
    echo ✅ 脚本运行完成
)

echo.
echo ========================================
echo 按任意键退出...
pause >nul
