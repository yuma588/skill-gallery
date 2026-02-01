<template>
  <Layout>
    <div class="cart-page">
      <div class="page-header">
        <h1 class="page-title">我的购物车</h1>
        <el-button v-if="cartStore.items.length > 0" link @click="handleClearCart">
          清空购物车
        </el-button>
      </div>

      <!-- Cart Content -->
      <div v-loading="cartStore.loading" class="cart-content">
        <div v-if="cartStore.items.length > 0" class="cart-container">
          <!-- Cart Items -->
          <div class="cart-items-section">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
            >
              <img :src="item.productImage" :alt="item.productName" class="item-image" />
              <div class="item-details">
                <h3 class="item-name">{{ item.productName }}</h3>
                <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
              </div>
              <div class="item-actions">
                <el-input-number
                  :model-value="item.quantity"
                  :min="1"
                  size="small"
                  @change="(value) => handleQuantityChange(item, value)"
                />
                <el-button
                  type="danger"
                  :icon="Delete"
                  link
                  @click="handleRemoveItem(item)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <div class="summary-card">
              <h3 class="summary-title">订单摘要</h3>

              <div class="summary-row">
                <span>商品数量</span>
                <span>{{ cartStore.totalCount }} 件</span>
              </div>

              <div class="summary-row">
                <span>商品总价</span>
                <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>

              <div class="summary-row">
                <span>配送费</span>
                <span>¥0.00</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>合计</span>
                <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>

              <el-button
                type="primary"
                size="large"
                :loading="cartStore.loading"
                @click="handleCheckout"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          type="cart"
          title="购物车是空的"
          description="快去添加一些美味的食物吧！"
          action-text="去点餐"
          @action="goToHome"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { ElMessageBox } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { Delete } from '@element-plus/icons-vue'
import type { CartItem } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

onMounted(async () => {
  await cartStore.fetchCart()
})

const handleQuantityChange = async (item: CartItem, quantity: number) => {
  try {
    await cartStore.updateCartItem(item.id, quantity)
  } catch (error) {
    console.error('更新数量失败', error)
  }
}

const handleRemoveItem = async (item: CartItem) => {
  try {
    await ElMessageBox.confirm('确定要从购物车中删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cartStore.removeFromCart(item.id)
  } catch (error) {
    console.error('删除失败', error)
  }
}

const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cartStore.clearCart()
  } catch (error) {
    console.error('清空购物车失败', error)
  }
}

const handleCheckout = () => {
  router.push('/checkout')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-gray);
}

.cart-content {
  min-height: 400px;
}

.cart-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-xl);
}

.cart-items-section {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--light-gray);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--primary-orange);
    box-shadow: var(--shadow-sm);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-sm);
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: flex-end;
}

.cart-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  font-size: 0.95rem;
  color: var(--dark-gray);

  &.total {
    font-size: 1.25rem;
    font-weight: 600;
    border-top: 1px solid var(--light-gray);
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-lg);
  }
}

.total-price {
  color: var(--primary-orange);
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: var(--light-gray);
  margin: var(--spacing-lg) 0;
}

.el-button--primary {
  width: 100%;
  background: var(--overlay-gradient);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  height: 48px;
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

@media (max-width: 1024px) {
  .cart-container {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
