<template>
  <el-drawer
    v-model="visible"
    title="购物车"
    direction="rtl"
    size="400px"
    :before-close="handleClose"
  >
    <div class="cart-drawer">
      <!-- Cart Items -->
      <div v-if="cartStore.items.length > 0" class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="cart-item"
        >
          <img :src="item.productImage" :alt="item.productName" class="item-image" />
          <div class="item-info">
            <h4 class="item-name">{{ item.productName }}</h4>
            <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
            <div class="item-actions">
              <el-button-group size="small">
                <el-button :icon="Minus" @click="decreaseQuantity(item)" />
                <el-button>{{ item.quantity }}</el-button>
                <el-button :icon="Plus" @click="increaseQuantity(item)" />
              </el-button-group>
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                link
                @click="removeItem(item)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        type="cart"
        title="购物车是空的"
        description="快去添加一些美味的食物吧！"
      />

      <!-- Cart Footer -->
      <div v-if="cartStore.items.length > 0" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span>商品数量</span>
            <span>{{ cartStore.totalCount }} 件</span>
          </div>
          <div class="summary-row total">
            <span>总计</span>
            <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="cartStore.loading"
          @click="goToCheckout"
        >
          去结算
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import EmptyState from '@/components/common/EmptyState.vue'
import { Minus, Plus, Delete } from '@element-plus/icons-vue'
import type { CartItem } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

const visible = defineModel<boolean>()

const handleClose = () => {
  visible.value = false
}

const increaseQuantity = async (item: CartItem) => {
  try {
    await cartStore.updateCartItem(item.id, item.quantity + 1)
  } catch (error) {
    console.error('更新数量失败', error)
  }
}

const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity > 1) {
    try {
      await cartStore.updateCartItem(item.id, item.quantity - 1)
    } catch (error) {
      console.error('更新数量失败', error)
    }
  }
}

const removeItem = async (item: CartItem) => {
  try {
    await cartStore.removeFromCart(item.id)
  } catch (error) {
    console.error('删除商品失败', error)
  }
}

const goToCheckout = () => {
  handleClose()
  router.push('/checkout')
}
</script>

<style lang="scss" scoped>
.cart-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--spacing-lg);
}

.cart-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--light-gray);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-fast);

  &:hover {
    background: #f0f0f0;
  }
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--dark-gray);
  @include text-ellipsis(1);
}

.item-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-orange);
  margin: var(--spacing-xs) 0;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-footer {
  border-top: 1px solid var(--medium-gray);
  padding-top: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.cart-summary {
  margin-bottom: var(--spacing-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  font-size: 0.95rem;
  color: var(--dark-gray);

  &.total {
    font-size: 1.1rem;
    font-weight: 600;
    border-top: 1px solid var(--light-gray);
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-md);
  }
}

.total-price {
  color: var(--primary-orange);
  font-size: 1.5rem;
  font-weight: 700;
}

.el-button--primary {
  width: 100%;
  background: var(--overlay-gradient);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  height: 48px;
  border-radius: var(--radius-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
</style>
