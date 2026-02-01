<template>
  <Layout>
    <div v-loading="productStore.loading" class="product-detail-page">
      <div v-if="product" class="detail-container">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" />
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-meta">
            <span class="rating">
              <el-icon><Star /></el-icon>
              {{ product.rating }}
            </span>
            <span class="sales">已售 {{ product.sales }} 份</span>
            <span class="category">{{ product.categoryName }}</span>
          </div>

          <div class="product-price">
            <span class="currency">¥</span>
            <span class="amount">{{ product.price.toFixed(2) }}</span>
            <span class="stock">库存 {{ product.stock }} 件</span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- Quantity Selector -->
          <div class="quantity-section">
            <span class="quantity-label">数量</span>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="product.stock"
              size="large"
            />
          </div>

          <!-- Actions -->
          <div class="action-buttons">
            <el-button
              type="primary"
              size="large"
              :icon="ShoppingCart"
              :loading="cartStore.loading"
              @click="handleAddToCart"
            >
              加入购物车
            </el-button>
            <el-button
              type="danger"
              size="large"
              :icon="Wallet"
              :loading="cartStore.loading"
              @click="handleBuyNow"
            >
              立即购买
            </el-button>
          </div>

          <!-- Product Features -->
          <div class="product-features">
            <div class="feature-item">
              <el-icon :size="24" color="#FF6B35"><Check /></el-icon>
              <span>30分钟内送达</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24" color="#FFC145"><Check /></el-icon>
              <span>新鲜食材</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24" color="#D32F2F"><Check /></el-icon>
              <span>品质保证</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product.store'
import { useCartStore } from '@/stores/cart.store'
import { ElMessage } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import { Star, ShoppingCart, Wallet, Check } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const quantity = ref(1)

const product = computed(() => productStore.currentProduct)

onMounted(async () => {
  const productId = route.params.id as string
  try {
    await productStore.fetchProductDetail(productId)
  } catch (error) {
    console.error('获取商品详情失败', error)
    ElMessage.error('获取商品详情失败')
  }
})

const handleAddToCart = async () => {
  if (!product.value) return

  try {
    await cartStore.addToCart(product.value.id, quantity.value)
    ElMessage.success(`已添加 ${quantity.value} 件到购物车`)
  } catch (error) {
    console.error('加入购物车失败', error)
    ElMessage.error('加入购物车失败')
  }
}

const handleBuyNow = async () => {
  if (!product.value) return

  try {
    await cartStore.addToCart(product.value.id, quantity.value)
    ElMessage.success('正在跳转到结算页面...')
    router.push('/checkout')
  } catch (error) {
    console.error('加入购物车失败', error)
    ElMessage.error('操作失败')
  }
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: calc(100vh - 72px);
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

.product-images {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.main-image {
  width: 100%;
  height: 500px;
  background: var(--light-gray);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  padding: var(--spacing-xl);
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-md);
  line-height: 1.3;
}

.product-meta {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  font-size: 0.95rem;
  color: var(--medium-gray);

  .rating,
  .sales,
  .category {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .rating .el-icon {
    color: #FFC145;
  }
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--light-gray);

  .currency {
    font-size: 1.5rem;
    color: var(--primary-orange);
    font-weight: 600;
  }

  .amount {
    font-size: 2.5rem;
    color: var(--primary-orange);
    font-weight: 700;
  }

  .stock {
    font-size: 0.9rem;
    color: var(--medium-gray);
    margin-left: auto;
  }
}

.product-description {
  font-size: 1rem;
  color: var(--dark-gray);
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.quantity-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-gray);
  min-width: 60px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);

  .el-button {
    height: 48px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: var(--radius-lg);
    transition: all var(--transition-normal);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    &.el-button--primary {
      background: var(--overlay-gradient);
      border: none;
    }

    &.el-button--danger {
      background: linear-gradient(135deg, #D32F2F 0%, #F44336 100%);
      border: none;
    }
  }
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.95rem;
  color: var(--dark-gray);
}

@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
  }

  .main-image {
    height: 400px;
  }
}

@media (max-width: 640px) {
  .product-detail-page {
    padding: var(--spacing-lg);
  }

  .product-info {
    padding: var(--spacing-lg);
  }

  .product-name {
    font-size: 1.5rem;
  }

  .product-meta {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .product-price {
    .amount {
      font-size: 2rem;
    }
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
