/**
 * 购物车添加商品功能测试脚本 (使用Puppeteer)
 */

import puppeteer from 'puppeteer';

async function testAddToCart() {
    console.log('开始测试购物车添加商品功能...\n');

    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null 
    });
    const page = await browser.newPage();

    try {
        // 1. 访问产品页面
        console.log('步骤1: 访问产品列表页面');
        await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle0' });
        console.log('✓ 页面加载成功\n');

        // 2. 等待产品列表加载
        console.log('步骤2: 等待产品列表加载');
        await page.waitForSelector('.product-card', { timeout: 10000 });
        const productCount = await page.evaluate(() => {
            return document.querySelectorAll('.product-card').length;
        });
        console.log(`✓ 检测到 ${productCount} 个商品\n`);

        if (productCount === 0) {
            console.log('✗ 错误：未找到商品');
            await browser.close();
            return false;
        }

        // 3. 获取第一个商品的名称和价格
        const firstProduct = await page.evaluate(() => {
            const firstCard = document.querySelector('.product-card');
            return {
                name: firstCard.querySelector('.product-name')?.textContent?.trim() || '',
                price: firstCard.querySelector('.product-price')?.textContent?.trim() || ''
            };
        });
        console.log(`步骤3: 选择第一个商品 '${firstProduct.name}'，价格 ${firstProduct.price}`);

        // 4. 点击"加入购物车"按钮
        console.log('\n步骤4: 点击"加入购物车"按钮');
        const firstCard = (await page.$$('.product-card'))[0];
        const addButton = await firstCard.$('button');
        
        if (addButton) {
            await addButton.click();
            console.log('✓ 点击成功\n');
        } else {
            console.log('✗ 错误：未找到加入购物车按钮');
            await browser.close();
            return false;
        }

        // 5. 验证购物车图标上的数量更新
        console.log('步骤5: 验证购物车数量更新');
        await page.waitForTimeout(1000); // 等待状态更新

        const cartCount = await page.evaluate(() => {
            const badge = document.querySelector('.cart-count');
            return badge ? badge.textContent : '0';
        });
        console.log(`购物车数量: ${cartCount}`);

        if (cartCount && parseInt(cartCount) >= 1) {
            console.log('✓ 购物车数量已更新\n');
        } else {
            console.log('✗ 警告：购物车数量未更新\n');
        }

        // 6. 点击购物车图标进入购物车页面
        console.log('步骤6: 进入购物车页面');
        const cartLink = await page.$('a[href="/cart"]');
        if (cartLink) {
            await cartLink.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            console.log('✓ 已进入购物车页面\n');
        } else {
            console.log('✗ 错误：未找到购物车链接');
            await browser.close();
            return false;
        }

        // 7. 验证购物车中是否有商品
        console.log('步骤7: 验证购物车中的商品');
        await page.waitForSelector('.cart-item', { timeout: 5000 });
        const cartItemCount = await page.evaluate(() => {
            return document.querySelectorAll('.cart-item').length;
        });

        if (cartItemCount > 0) {
            console.log(`✓ 购物车中有 ${cartItemCount} 个商品\n`);

            // 获取购物车中第一个商品的名称和数量
            const cartItem = await page.evaluate(() => {
                const firstItem = document.querySelector('.cart-item');
                return {
                    name: firstItem.querySelector('.cart-item-name')?.textContent?.trim() || '',
                    quantity: firstItem.querySelector('.cart-item-quantity')?.textContent?.trim() || ''
                };
            });

            console.log(`商品名称: ${cartItem.name}`);
            console.log(`商品数量: ${cartItem.quantity}\n`);

            if (cartItem.name === firstProduct.name) {
                console.log('✓ 商品名称匹配\n');
            } else {
                console.log(`✗ 警告：商品名称不匹配 (期望: ${firstProduct.name}, 实际: ${cartItem.name})\n`);
            }
        } else {
            console.log('✗ 错误：购物车中没有商品\n');
            await browser.close();
            return false;
        }

        // 8. 测试localStorage持久化
        console.log('步骤8: 测试localStorage持久化');
        await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle0' });

        const cartCountAfter = await page.evaluate(() => {
            const badge = document.querySelector('.cart-count');
            return badge ? badge.textContent : '0';
        });

        if (cartCountAfter && parseInt(cartCountAfter) >= 1) {
            console.log(`✓ 购物车数量保持为 ${cartCountAfter}（localStorage正常）\n`);
        } else {
            console.log('✗ 警告：购物车数据未持久化\n');
        }

        console.log('\n' + '='.repeat(50));
        console.log('测试完成！购物车功能基本正常 ✓');
        console.log('='.repeat(50));

        await browser.close();
        return true;

    } catch (error) {
        console.log(`\n✗ 测试失败，错误信息: ${error.message}`);
        await browser.close();
        return false;
    }
}

// 运行测试
(async () => {
    const success = await testAddToCart();
    process.exit(success ? 0 : 1);
})();
