@echo off
chcp 65001 > nul
echo ====================================
echo 购物车功能测试
echo ====================================
echo.

echo [1/3] 检查Node.js环境...
node --version
if errorlevel 1 (
    echo 错误：未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)
echo ✓ Node.js环境正常
echo.

echo [2/3] 启动开发服务器...
start "Dev Server" cmd /k "npm run dev"
echo 等待服务器启动...
timeout /t 5 /nobreak > nul
echo ✓ 服务器已在后台启动
echo.

echo [3/3] 运行测试脚本...
echo.
python test_cart_add.py
echo.

echo ====================================
echo 测试完成
echo ====================================
pause
