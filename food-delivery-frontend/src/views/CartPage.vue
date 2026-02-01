<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">🍕</span>
          <span class="logo-text">Gourmet Velocity</span>
        </router-link>
        <nav class="nav">
          <router-link to="/products" class="nav-link">返回点餐</router-link>
        </nav>
      </div>
    </header>

    <!-- 购物车内容 -->
    <div class="container">
      <h1 class="page-title">
        🛒 购物车
        <span v-if="totalCount > 0" class="count-badge">{{ totalCount }}件商品</span>
      </h1>

      <!-- 购物车为空 -->
      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <p class="empty-text">购物车是空的</p>
        <router-link to="/products" class="btn-shopping">
          去点餐
        </router-link>
      </div>

      <!-- 购物车有商品 -->
      <div v-else class="cart-content">
        <!-- 商品列表 -->
        <div class="cart-items">
          <div
            v-for="item in items"
            :key="item.id"
            class="cart-item"
          >
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-desc">{{ item.description }}</p>
              <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            </div>
            <div class="item-actions">
              <div class="quantity-control">
                <button
                  class="qty-btn qty-minus"
                  @click="decrementQuantity(item.id)"
                  :disabled="item.quantity <= 1"
                >
                  −
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn qty-plus" @click="incrementQuantity(item.id)">
                  +
                </button>
              </div>
              <div class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
              <button class="btn-remove" @click="removeFromCart(item.id)">
                删除
              </button>
            </div>
          </div>
        </div>

        <!-- 订单摘要 -->
        <div class="cart-summary">
          <h2 class="summary-title">订单摘要</h2>
          <div class="summary-item">
            <span>商品数量</span>
            <span>{{ totalCount }} 件</span>
          </div>
          <div class="summary-item">
            <span>小计</span>
            <span>¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-item delivery">
            <span>配送费</span>
            <span>¥{{ deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="summary-line"></div>
          <div class="summary-item total">
            <span>总计</span>
            <span class="total-price">¥{{ (totalPrice + deliveryFee).toFixed(2) }}</span>
          </div>
          <button class="btn-checkout" @click="checkout">
            立即结算
          </button>
          <button class="btn-clear" @click="clearCart">
            清空购物车
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p class="footer-text">© 2024 Gourmet Velocity. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const cartStore = useCartStore()

const items = computed(() => cartStore.items)
const totalCount = computed(() => cartStore.totalCount)
const totalPrice = computed(() => cartStore.totalPrice)

// 配送费
const deliveryFee = computed(() => {
  return totalPrice.value > 0 ? 5.00 : 0
})

// 增加数量
const incrementQuantity = (productId: string) => {
  cartStore.incrementQuantity(productId)
}

// 减少数量
const decrementQuantity = (productId: string) => {
  cartStore.decrementQuantity(productId)
}

// 从购物车移除
const removeFromCart = (productId: string) => {
  if (confirm('确定要删除这个商品吗?')) {
    cartStore.removeFromCart(productId)
  }
}

// 清空购物车
const clearCart = () => {
  if (confirm('确定要清空购物车吗?')) {
    cartStore.clearCart()
  }
}

// 结算
const checkout = () => {
  alert(`订单金额: ¥${(totalPrice.value + deliveryFee.value).toFixed(2)}\n\n结算功能即将上线,敬请期待!`)
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 2rem;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.count-badge {
  font-size: 1.2rem;
  font-weight: 600;
  color: #FF6B35;
}

/* 空购物车 */
.empty-cart {
  text-align: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
}

.empty-text {
  color: #8D99AE;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-shopping {
  display: inline-block;
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-shopping:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

/* 购物车内容 */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

/* 商品列表 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 0.5rem;
}

.item-desc {
  color: #8D99AE;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FF6B35;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.25rem;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 6px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D3142;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: #FF6B35;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.item-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D3142;
}

.btn-remove {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  color: #EF476F;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #EF476F;
  color: white;
  border-color: #EF476F;
}

/* 订单摘要 */
.cart-summary {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #8D99AE;
  font-size: 1rem;
}

.summary-item.delivery {
  color: #06D6A0;
}

.summary-line {
  height: 1px;
  background: #e0e0e0;
  margin: 1rem 0;
}

.summary-item.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D3142;
}

.total-price {
  color: #FF6B35;
  font-size: 1.5rem;
}

.btn-checkout {
  width: 100%;
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-clear {
  width: 100%;
  background: white;
  color: #EF476F;
  border: 1px solid #EF476F;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #EF476F;
  color: white;
}

/* 页脚 */
.footer {
  background: #2D3142;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
}

.footer-text {
  opacity: 0.8;
}

/* 响应式 */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-actions {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
