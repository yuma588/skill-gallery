/**
 * 简单的页面加载测试脚本
 * 验证产品页面和购物车页面是否可以正常访问
 */

async function testPageLoad() {
    console.log('开始测试页面加载...\n');
    
    const pages = [
        { name: '产品列表页', url: 'http://localhost:3000/products' },
        { name: '购物车页面', url: 'http://localhost:3000/cart' },
        { name: '首页', url: 'http://localhost:3000/' }
    ];
    
    for (const page of pages) {
        console.log(`测试: ${page.name} (${page.url})`);
        try {
            const response = await fetch(page.url);
            if (response.ok) {
                console.log(`  ✓ 状态码: ${response.status} ${response.statusText}\n`);
            } else {
                console.log(`  ✗ 错误: 状态码 ${response.status}\n`);
            }
        } catch (error) {
            console.log(`  ✗ 失败: ${error.message}\n`);
        }
    }
    
    console.log('页面加载测试完成！');
}

testPageLoad();
