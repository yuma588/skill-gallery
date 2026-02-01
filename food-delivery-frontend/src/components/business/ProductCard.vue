<template>
  <div class="product-card" @click="goToDetail">
    <!-- Product Image -->
    <div class="product-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <div v-if="product.stock <= 10" class="stock-badge">库存紧张</div>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <!-- Meta Info -->
      <div class="product-meta">
        <div class="meta-item">
          <el-icon><Star /></el-icon>
          <span>{{ product.rating }}</span>
        </div>
        <div class="meta-item">
          <el-icon><ShoppingBag /></el-icon>
          <span>已售 {{ product.sales }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="product-footer">
        <div class="price">
          <span class="currency">¥</span>
          <span class="amount">{{ product.price.toFixed(2) }}</span>
        </div>
        <el-button
          type="primary"
          :icon="ShoppingCart"
          size="large"
          @click.stop="handleAddToCart"
        >
          加入购物车
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { ElMessage } from 'element-plus'
import type { Product } from '@/types'
import { Star, ShoppingBag, ShoppingCart } from '@element-plus/icons-vue'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart(props.product.id, 1)
    ElMessage.success('已加入购物车')
  } catch (error) {
    ElMessage.error('加入购物车失败')
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  @include card-style;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;

  &:hover {
    .product-image img {
      transform: scale(1.1);
    }

    .stock-badge {
      opacity: 1;
    }
  }
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--light-gray);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .stock-badge {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--accent-red);
    color: var(--white);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0;
    transition: opacity var(--transition-fast);
    animation: pulse 2s ease-in-out infinite;
  }
}

.product-info {
  padding: var(--spacing-lg);
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-sm);
  @include text-ellipsis(2);
  line-height: 1.4;
}

.product-description {
  font-size: 0.9rem;
  color: var(--medium-gray);
  margin-bottom: var(--spacing-md);
  @include text-ellipsis(2);
  line-height: 1.5;
}

.product-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.85rem;
    color: var(--medium-gray);

    .el-icon {
      font-size: 14px;
    }
  }
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 2px;

  .currency {
    font-size: 1rem;
    color: var(--primary-orange);
    font-weight: 600;
  }

  .amount {
    font-size: 1.5rem;
    color: var(--primary-orange);
    font-weight: 700;
  }
}

.el-button {
  border-radius: var(--radius-lg);
  background: var(--overlay-gradient);
  border: none;
  font-weight: 600;
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
</style>
