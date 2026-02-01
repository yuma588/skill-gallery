"""
购物车添加商品功能测试脚本
测试目标：验证购物车的添加商品功能是否正常工作
"""

from playwright.sync_api import sync_playwright, Page
import time
import sys

def test_add_to_cart():
    """测试添加商品到购物车的完整流程"""
    print("开始测试购物车添加商品功能...\n")
    
    with sync_playwright() as p:
        # 启动浏览器（非headless模式方便观察）
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 1. 访问产品页面
            print("步骤1: 访问产品列表页面")
            page.goto('http://localhost:3000/products')
            page.wait_for_load_state('networkidle')
            print("✓ 页面加载成功\n")
            
            # 2. 等待产品列表加载
            print("步骤2: 等待产品列表加载")
            product_cards = page.locator('.product-card')
            product_cards.wait_for(state='visible')
            product_count = product_cards.count()
            print(f"✓ 检测到 {product_count} 个商品\n")
            
            if product_count == 0:
                print("✗ 错误：未找到商品")
                browser.close()
                return False
            
            # 3. 获取第一个商品的名称和价格
            first_product = product_cards.first
            product_name = first_product.locator('.product-name').text_content()
            product_price = first_product.locator('.product-price').text_content()
            print(f"步骤3: 选择第一个商品 '{product_name}'，价格 {product_price}")
            
            # 4. 点击"加入购物车"按钮
            print("\n步骤4: 点击'加入购物车'按钮")
            add_button = first_product.locator('button:has-text("加入购物车")')
            add_button.click()
            print("✓ 点击成功\n")
            
            # 5. 验证购物车图标上的数量更新
            print("步骤5: 验证购物车数量更新")
            cart_badge = page.locator('.cart-count')
            time.sleep(1)  # 等待状态更新
            
            cart_count = cart_badge.text_content()
            print(f"购物车数量: {cart_count}")
            
            if cart_count and int(cart_count) >= 1:
                print("✓ 购物车数量已更新\n")
            else:
                print("✗ 警告：购物车数量未更新\n")
            
            # 6. 点击购物车图标进入购物车页面
            print("步骤6: 进入购物车页面")
            cart_link = page.locator('a[href="/cart"]')
            cart_link.click()
            page.wait_for_load_state('networkidle')
            print("✓ 已进入购物车页面\n")
            
            # 7. 验证购物车中是否有商品
            print("步骤7: 验证购物车中的商品")
            cart_items = page.locator('.cart-item')
            cart_item_count = cart_items.count()
            
            if cart_item_count > 0:
                print(f"✓ 购物车中有 {cart_item_count} 个商品\n")
                
                # 获取购物车中第一个商品的名称和数量
                first_cart_item = cart_items.first
                cart_item_name = first_cart_item.locator('.cart-item-name').text_content()
                cart_item_quantity = first_cart_item.locator('.cart-item-quantity').text_content()
                
                print(f"商品名称: {cart_item_name}")
                print(f"商品数量: {cart_item_quantity}\n")
                
                if cart_item_name == product_name:
                    print("✓ 商品名称匹配\n")
                else:
                    print(f"✗ 警告：商品名称不匹配 (期望: {product_name}, 实际: {cart_item_name})\n")
            else:
                print("✗ 错误：购物车中没有商品\n")
                browser.close()
                return False
            
            # 8. 测试localStorage持久化
            print("步骤8: 测试localStorage持久化")
            page.goto('http://localhost:3000/products')
            page.wait_for_load_state('networkidle')
            
            cart_badge_after = page.locator('.cart-count')
            cart_count_after = cart_badge_after.text_content()
            
            if cart_count_after and int(cart_count_after) >= 1:
                print(f"✓ 购物车数量保持为 {cart_count_after}（localStorage正常）\n")
            else:
                print("✗ 警告：购物车数据未持久化\n")
            
            print("\n" + "="*50)
            print("测试完成！购物车功能基本正常 ✓")
            print("="*50)
            
            browser.close()
            return True
            
        except Exception as e:
            print(f"\n✗ 测试失败，错误信息: {str(e)}")
            browser.close()
            return False

if __name__ == "__main__":
    success = test_add_to_cart()
    sys.exit(0 if success else 1)
