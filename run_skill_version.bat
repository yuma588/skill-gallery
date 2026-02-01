@echo off
chcp 65001 >nul
echo ========================================
echo PDF表格提取工具（基于pdf-skills）
echo ========================================
echo.

echo 正在检查Python环境...
python --version
if errorlevel 1 (
    echo.
    echo ❌ 错误: 未检测到Python环境
    echo.
    echo 请按以下步骤操作:
    echo 1. 访问 https://python.org 下载Python
    echo 2. 安装Python时勾选"Add Python to PATH"
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo.
echo 正在安装依赖库...
pip install pdfplumber pandas openpyxl
if errorlevel 1 (
    echo.
    echo ⚠️ 依赖安装失败，尝试继续...
)

echo.
echo 开始提取表格数据...
echo.
python extract_tables_from_skill.py

if errorlevel 1 (
    echo.
    echo ❌ 脚本运行失败
) else (
    echo.
    echo ✅ 运行完成！
    echo.
    echo 生成的文件:
    dir /b chinese_document_tables_skill.*
)

echo.
echo ========================================
echo 按任意键退出...
pause >nul
