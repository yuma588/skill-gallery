/**
 * 启动服务器并运行测试的脚本 (Node.js版本)
 */

const child_process = require('child_process');
const net = require('net');

function isPortReady(port, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const check = () => {
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for port ${port}`));
                return;
            }
            
            const client = net.createConnection({ port: port, host: 'localhost' });
            
            client.on('connect', () => {
                client.end();
                resolve(true);
            });
            
            client.on('error', () => {
                setTimeout(check, 500);
            });
        };
        
        check();
    });
}

async function main() {
    const serverProcess = child_process.spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        shell: true,
        detached: true,
        stdio: 'ignore'
    });

    console.log('正在启动开发服务器...');
    console.log(`进程ID: ${serverProcess.pid}`);
    
    try {
        // 等待服务器启动
        await isPortReady(3000);
        console.log('✓ 服务器已在 http://localhost:3000 启动\n');
        console.log('现在可以手动访问以下网址：');
        console.log('- http://localhost:3000/products (产品列表)');
        console.log('- http://localhost:3000/cart (购物车)\n');
        console.log('要停止服务器，请按 Ctrl+C\n');
        
        // 保持服务器运行
        process.on('SIGINT', () => {
            console.log('\n正在停止服务器...');
            process.kill(-serverProcess.pid);
            process.exit(0);
        });
        
        // 防止进程退出
        await new Promise(() => {});
        
    } catch (error) {
        console.error(`启动服务器失败: ${error.message}`);
        process.kill(-serverProcess.pid);
        process.exit(1);
    }
}

main();
