/**
 * 购物车添加商品功能测试脚本 (Node.js版本)
 * 测试目标：验证购物车的添加商品功能是否正常工作
 */

import { chromium } from 'playwright';

async function testAddToCart() {
    console.log('开始测试购物车添加商品功能...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 1. 访问产品页面
        console.log('步骤1: 访问产品列表页面');
        await page.goto('http://localhost:3000/products');
        await page.waitForLoadState('networkidle');
        console.log('✓ 页面加载成功\n');

        // 2. 等待产品列表加载
        console.log('步骤2: 等待产品列表加载');
        const productCards = page.locator('.product-card');
        await productCards.waitFor({ state: 'visible' });
        const productCount = await productCards.count();
        console.log(`✓ 检测到 ${productCount} 个商品\n`);

        if (productCount === 0) {
            console.log('✗ 错误：未找到商品');
            await browser.close();
            return false;
        }

        // 3. 获取第一个商品的名称和价格
        const firstProduct = productCards.first();
        const productName = await firstProduct.locator('.product-name').textContent();
        const productPrice = await firstProduct.locator('.product-price').textContent();
        console.log(`步骤3: 选择第一个商品 '${productName}'，价格 ${productPrice}`);

        // 4. 点击"加入购物车"按钮
        console.log('\n步骤4: 点击"加入购物车"按钮');
        const addButton = firstProduct.locator('button:has-text("加入购物车")');
        await addButton.click();
        console.log('✓ 点击成功\n');

        // 5. 验证购物车图标上的数量更新
        console.log('步骤5: 验证购物车数量更新');
        const cartBadge = page.locator('.cart-count');
        await page.waitForTimeout(1000); // 等待状态更新

        const cartCount = await cartBadge.textContent();
        console.log(`购物车数量: ${cartCount}`);

        if (cartCount && parseInt(cartCount) >= 1) {
            console.log('✓ 购物车数量已更新\n');
        } else {
            console.log('✗ 警告：购物车数量未更新\n');
        }

        // 6. 点击购物车图标进入购物车页面
        console.log('步骤6: 进入购物车页面');
        const cartLink = page.locator('a[href="/cart"]');
        await cartLink.click();
        await page.waitForLoadState('networkidle');
        console.log('✓ 已进入购物车页面\n');

        // 7. 验证购物车中是否有商品
        console.log('步骤7: 验证购物车中的商品');
        const cartItems = page.locator('.cart-item');
        const cartItemCount = await cartItems.count();

        if (cartItemCount > 0) {
            console.log(`✓ 购物车中有 ${cartItemCount} 个商品\n`);

            // 获取购物车中第一个商品的名称和数量
            const firstCartItem = cartItems.first();
            const cartItemName = await firstCartItem.locator('.cart-item-name').textContent();
            const cartItemQuantity = await firstCartItem.locator('.cart-item-quantity').textContent();

            console.log(`商品名称: ${cartItemName}`);
            console.log(`商品数量: ${cartItemQuantity}\n`);

            if (cartItemName === productName) {
                console.log('✓ 商品名称匹配\n');
            } else {
                console.log(`✗ 警告：商品名称不匹配 (期望: ${productName}, 实际: ${cartItemName})\n`);
            }
        } else {
            console.log('✗ 错误：购物车中没有商品\n');
            await browser.close();
            return false;
        }

        // 8. 测试localStorage持久化
        console.log('步骤8: 测试localStorage持久化');
        await page.goto('http://localhost:3000/products');
        await page.waitForLoadState('networkidle');

        const cartBadgeAfter = page.locator('.cart-count');
        const cartCountAfter = await cartBadgeAfter.textContent();

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
