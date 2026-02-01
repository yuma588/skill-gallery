import puppeteer from 'puppeteer';

async function testCartFunctionality() {
    console.log('====================================');
    console.log('购物车添加商品功能自动化测试');
    console.log('====================================\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    const testResults = [];
    
    try {
        // 测试1: 访问产品页面
        console.log('【测试1】访问产品页面...');
        await page.goto('http://localhost:3000/products', { 
            waitUntil: 'networkidle2',
            timeout: 10000 
        });
        
        const pageTitle = await page.title();
        console.log(`✓ 页面标题: ${pageTitle}`);
        testResults.push({ name: '访问产品页面', status: '通过' });
        
        // 测试2: 检查商品是否显示
        console.log('\n【测试2】检查商品显示...');
        await page.waitForSelector('.product-card', { timeout: 5000 });
        const productCount = await page.$$eval('.product-card', cards => cards.length);
        console.log(`✓ 检测到 ${productCount} 个商品`);
        testResults.push({ name: '商品显示', status: '通过' });
        
        // 测试3: 获取第一个商品信息
        console.log('\n【测试3】获取第一个商品信息...');
        const firstProduct = await page.evaluate(() => {
            const card = document.querySelector('.product-card');
            return {
                name: card.querySelector('.product-name')?.textContent?.trim(),
                price: card.querySelector('.product-price')?.textContent?.trim()
            };
        });
        console.log(`✓ 商品名称: ${firstProduct.name}`);
        console.log(`✓ 商品价格: ${firstProduct.price}`);
        testResults.push({ name: '获取商品信息', status: '通过' });
        
        // 测试4: 点击"加入购物车"按钮
        console.log('\n【测试4】点击"加入购物车"按钮...');
        const firstCard = (await page.$$('.product-card'))[0];
        const addButton = await firstCard.$('.btn-add');
        
        if (addButton) {
            await addButton.click();
            console.log('✓ 成功点击"加入购物车"按钮');
            testResults.push({ name: '点击按钮', status: '通过' });
        } else {
            throw new Error('未找到"加入购物车"按钮');
        }
        
        // 测试5: 验证购物车图标更新
        console.log('\n【测试5】验证购物车图标更新...');
        await page.waitForTimeout(1000);
        
        const cartCount = await page.evaluate(() => {
            const badge = document.querySelector('.cart-count');
            return badge ? badge.textContent : '0';
        });
        
        if (cartCount && parseInt(cartCount) >= 1) {
            console.log(`✓ 购物车数量已更新为: ${cartCount}`);
            testResults.push({ name: '购物车图标更新', status: '通过' });
        } else {
            console.log(`✗ 购物车数量未正确更新: ${cartCount}`);
            testResults.push({ name: '购物车图标更新', status: '失败' });
        }
        
        // 测试6: 进入购物车页面
        console.log('\n【测试6】进入购物车页面...');
        const cartLink = await page.$('a[href="/cart"]');
        if (cartLink) {
            await cartLink.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('✓ 成功进入购物车页面');
            testResults.push({ name: '进入购物车页面', status: '通过' });
        } else {
            throw new Error('未找到购物车链接');
        }
        
        // 测试7: 验证购物车中的商品
        console.log('\n【测试7】验证购物车中的商品...');
        await page.waitForSelector('.cart-item', { timeout: 5000 });
        
        const cartItems = await page.evaluate(() => {
            const items = document.querySelectorAll('.cart-item');
            return Array.from(items).map(item => ({
                name: item.querySelector('.cart-item-name')?.textContent?.trim(),
                quantity: item.querySelector('.cart-item-quantity')?.textContent?.trim(),
                price: item.querySelector('.cart-item-price')?.textContent?.trim()
            }));
        });
        
        if (cartItems.length > 0) {
            console.log(`✓ 购物车中有 ${cartItems.length} 个商品`);
            cartItems.forEach((item, index) => {
                console.log(`  商品${index + 1}: ${item.name}, 数量: ${item.quantity}`);
            });
            
            // 验证商品名称是否匹配
            if (cartItems[0].name === firstProduct.name) {
                console.log('✓ 商品名称匹配');
                testResults.push({ name: '商品信息匹配', status: '通过' });
            } else {
                console.log(`✗ 商品名称不匹配 (期望: ${firstProduct.name}, 实际: ${cartItems[0].name})`);
                testResults.push({ name: '商品信息匹配', status: '失败' });
            }
            testResults.push({ name: '购物车商品显示', status: '通过' });
        } else {
            console.log('✗ 购物车中没有商品');
            testResults.push({ name: '购物车商品显示', status: '失败' });
        }
        
        // 测试8: 测试localStorage持久化
        console.log('\n【测试8】测试localStorage持久化...');
        await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
        
        const cartCountAfter = await page.evaluate(() => {
            const badge = document.querySelector('.cart-count');
            return badge ? badge.textContent : '0';
        });
        
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
    
    // 输出测试结果
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
    
    return failed === 0;
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
