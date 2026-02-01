import { chromium } from 'playwright';

async function testCartFunctionality() {
    console.log('====================================');
    console.log('购物车添加商品功能自动化测试');
    console.log('====================================\n');
    
    let browser;
    try {
        // 尝试使用已安装的Chromium
        browser = await chromium.launch({
            headless: false,
            args: ['--start-maximized']
        });
    } catch (error) {
        console.log('Playwright浏览器未安装，正在下载...');
        console.log('请运行: npx playwright install chromium');
        console.log('\n或者使用简化版测试...\n');
        
        // 降级到简单的HTTP测试
        return await runSimpleTest();
    }
    
    const page = await browser.newPage();
    const testResults = [];
    
    try {
        // 测试1: 访问产品页面
        console.log('【测试1】访问产品页面...');
        await page.goto('http://localhost:3000/products', { 
            waitUntil: 'networkidle',
            timeout: 10000 
        });
        
        const pageTitle = await page.title();
        console.log(`✓ 页面标题: ${pageTitle}`);
        testResults.push({ name: '访问产品页面', status: '通过' });
        
        // 测试2: 检查商品是否显示
        console.log('\n【测试2】检查商品显示...');
        await page.waitForSelector('.product-card', { timeout: 5000 });
        const productCount = await page.locator('.product-card').count();
        console.log(`✓ 检测到 ${productCount} 个商品`);
        testResults.push({ name: '商品显示', status: '通过' });
        
        // 测试3: 获取第一个商品信息
        console.log('\n【测试3】获取第一个商品信息...');
        const firstProduct = await page.locator('.product-card').first();
        const productName = await firstProduct.locator('.product-name').textContent();
        const productPrice = await firstProduct.locator('.product-price').textContent();
        console.log(`✓ 商品名称: ${productName}`);
        console.log(`✓ 商品价格: ${productPrice}`);
        testResults.push({ name: '获取商品信息', status: '通过' });
        
        // 测试4: 点击"加入购物车"按钮
        console.log('\n【测试4】点击"加入购物车"按钮...');
        const addButton = firstProduct.locator('button:has-text("加入购物车")');
        await addButton.click();
        console.log('✓ 成功点击"加入购物车"按钮');
        testResults.push({ name: '点击按钮', status: '通过' });
        
        // 测试5: 验证购物车图标更新
        console.log('\n【测试5】验证购物车图标更新...');
        await page.waitForTimeout(1000);
        
        const cartCount = await page.locator('.cart-count').textContent();
        
        if (cartCount && parseInt(cartCount) >= 1) {
            console.log(`✓ 购物车数量已更新为: ${cartCount}`);
            testResults.push({ name: '购物车图标更新', status: '通过' });
        } else {
            console.log(`✗ 购物车数量未正确更新: ${cartCount || '0'}`);
            testResults.push({ name: '购物车图标更新', status: '失败' });
        }
        
        // 测试6: 进入购物车页面
        console.log('\n【测试6】进入购物车页面...');
        const cartLink = page.locator('a[href="/cart"]');
        await cartLink.click();
        await page.waitForLoadState('networkidle');
        console.log('✓ 成功进入购物车页面');
        testResults.push({ name: '进入购物车页面', status: '通过' });
        
        // 测试7: 验证购物车中的商品
        console.log('\n【测试7】验证购物车中的商品...');
        await page.waitForSelector('.cart-item', { timeout: 5000 });
        
        const cartItems = page.locator('.cart-item');
        const cartItemCount = await cartItems.count();
        
        if (cartItemCount > 0) {
            console.log(`✓ 购物车中有 ${cartItemCount} 个商品`);
            
            const cartItemName = await cartItems.first().locator('.cart-item-name').textContent();
            console.log(`  商品名称: ${cartItemName}`);
            
            if (cartItemName === productName) {
                console.log('✓ 商品名称匹配');
                testResults.push({ name: '商品信息匹配', status: '通过' });
            } else {
                console.log(`✗ 商品名称不匹配 (期望: ${productName}, 实际: ${cartItemName})`);
                testResults.push({ name: '商品信息匹配', status: '失败' });
            }
            testResults.push({ name: '购物车商品显示', status: '通过' });
        } else {
            console.log('✗ 购物车中没有商品');
            testResults.push({ name: '购物车商品显示', status: '失败' });
        }
        
        // 测试8: 测试localStorage持久化
        console.log('\n【测试8】测试localStorage持久化...');
        await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
        
        const cartCountAfter = await page.locator('.cart-count').textContent();
        
        if (cartCountAfter && parseInt(cartCountAfter) >= 1) {
            console.log(`✓ 购物车数据持久化成功，数量保持为: ${cartCountAfter}`);
            testResults.push({ name: 'localStorage持久化', status: '通过' });
        } else {
            console.log('✗ 购物车数据未持久化');
            testResults.push({ name: 'localStorage持久化', status: '失败' });
        }
        
    } catch (error) {
        console.error(`\n✗ 测试过程中出错: ${error.message}`);
        testResults.push({ name: '测试执行', status: `失败: ${error.message}` });
    } finally {
        await browser.close();
    }
    
    printTestResults(testResults);
    return testResults.filter(r => r.status === '失败').length === 0;
}

async function runSimpleTest() {
    console.log('运行简化版测试...\n');
    
    const testResults = [];
    
    // 测试页面是否可以访问
    console.log('【测试】检查页面是否可访问...');
    try {
        const response = await fetch('http://localhost:3000/products');
        if (response.ok) {
            console.log('✓ 产品页面可以访问');
            testResults.push({ name: '产品页面访问', status: '通过' });
        } else {
            console.log(`✗ 产品页面访问失败: ${response.status}`);
            testResults.push({ name: '产品页面访问', status: '失败' });
        }
    } catch (error) {
        console.log(`✗ 无法连接到服务器: ${error.message}`);
        testResults.push({ name: '产品页面访问', status: `失败: ${error.message}` });
    }
    
    // 测试购物车页面
    console.log('\n【测试】检查购物车页面是否可访问...');
    try {
        const response = await fetch('http://localhost:3000/cart');
        if (response.ok) {
            console.log('✓ 购物车页面可以访问');
            testResults.push({ name: '购物车页面访问', status: '通过' });
        } else {
            console.log(`✗ 购物车页面访问失败: ${response.status}`);
            testResults.push({ name: '购物车页面访问', status: '失败' });
        }
    } catch (error) {
        console.log(`✗ 无法连接到购物车页面: ${error.message}`);
        testResults.push({ name: '购物车页面访问', status: `失败: ${error.message}` });
    }
    
    printTestResults(testResults);
    return testResults.filter(r => r.status === '失败').length === 0;
}

function printTestResults(testResults) {
    console.log('\n====================================');
    console.log('测试结果汇总');
    console.log('====================================\n');
    
    const passed = testResults.filter(r => r.status === '通过').length;
    const failed = testResults.filter(r => r.status !== '通过').length;
    
    testResults.forEach((result, index) => {
        const status = result.status === '通过' ? '✓' : '✗';
        console.log(`${status} ${result.name}: ${result.status}`);
    });
    
    console.log(`\n总计: ${testResults.length} 个测试`);
    console.log(`通过: ${passed} 个`);
    console.log(`失败: ${failed} 个`);
    console.log('====================================\n');
    
    if (failed === 0) {
        console.log('🎉 所有测试通过！');
    } else {
        console.log('⚠️  存在失败的测试，请检查上述错误信息');
    }
}

// 运行测试
testCartFunctionality()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('测试运行失败:', error);
        process.exit(1);
    });
