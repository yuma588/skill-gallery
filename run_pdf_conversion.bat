@echo off
chcp 65001 >nul
echo ========================================
echo PDF转图像工具（基于pdf-skills）
echo ========================================
echo.
echo 运行转换脚本...
echo.
node convert_pdf_final.js

if errorlevel 1 (
    echo.
    echo ❌ 转换失败
    echo.
) else (
    echo.
    echo ========================================
    echo ✅ 转换完成！
    echo ========================================
    echo.
    echo 生成的文件:
    dir /b chinese_document_page_*.png
)

echo.
echo 按任意键退出...
pause >nul
