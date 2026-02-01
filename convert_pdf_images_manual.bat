@echo off
chcp 65001 >nul
echo ========================================
echo PDF转图像工具（基于pdf-skills）
echo ========================================
echo.

echo 方法1: 使用pdf2image（需要Python）
echo ----------------------------------------
py convert_pdf_to_images_skill.py chinese_document.pdf .
echo.

echo 方法2: 检查系统PDF工具
echo ----------------------------------------
echo 检查pdftoppm...
where pdftoppm >nul 2>&1
if errorlevel 1 (
    echo   未找到pdftoppm
) else (
    echo   找到pdftoppm，尝试转换...
    pdftoppm -png -r 200 chinese_document.pdf page
    ren page-1.png chinese_document_page_1.png >nul 2>&1
    ren page-2.png chinese_document_page_2.png >nul 2>&1
    echo   转换完成
)
echo.

echo 方法3: 检查Magick工具
echo ----------------------------------------
where magick >nul 2>&1
if errorlevel 1 (
    echo   未找到ImageMagick
) else (
    echo   找到ImageMagick，尝试转换...
    magick chinese_document.pdf[0] chinese_document_page_1.png
    magick chinese_document.pdf[1] chinese_document_page_2.png
    echo   转换完成
)
echo.

echo ========================================
echo 完成检查，查看当前目录中的PNG文件
echo ========================================
pause
