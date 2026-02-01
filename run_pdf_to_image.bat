@echo off
chcp 65001 >nul
echo ========================================
echo PDF转图像工具（基于pdf-skills）
echo ========================================
echo.

echo [1/2] 检查Python环境...
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Python环境
    echo 请先安装Python: https://python.org
    pause
    exit /b 1
)
echo ✅ Python环境正常
echo.

echo [2/2] 安装依赖并转换...
echo.
echo 正在安装pdf2image...
py -m pip install --quiet pdf2image pillow
echo.

echo 开始转换PDF...
py convert_pdf_to_images_skill.py chinese_document.pdf .

if errorlevel 1 (
    echo.
    echo ❌ 转换失败
    echo.
    echo 可能需要先安装poppler（pdf2image的依赖）
    echo 下载地址: https://github.com/oschwartz10612/poppler-windows/releases
) else (
    echo.
    echo ✅ 转换完成！
)

echo.
echo ========================================
echo 按任意键退出...
pause >nul
