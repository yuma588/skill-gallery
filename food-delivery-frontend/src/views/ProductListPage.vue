<template>
  <div class="product-list-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">🍕</span>
          <span class="logo-text">Gourmet Velocity</span>
        </router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">返回首页</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            <span class="cart-icon">🛒</span>
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-btn"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        <span class="cat-icon">{{ cat.emoji }}</span>
        <span class="cat-name">{{ cat.name }}</span>
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索美食..."
      />
    </div>

    <!-- 商品列表 -->
    <div class="container">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
              <button class="btn-add" @click="addToCart(product)">
                加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">🍽️</div>
        <p class="empty-text">没有找到相关美食</p>
        <button class="btn-reset" @click="resetFilters">查看全部</button>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p class="footer-text">© 2024 Gourmet Velocity. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const cartStore = useCartStore()

const cartCount = computed(() => cartStore.totalCount)

const categories = [
  { id: 'all', name: '全部', emoji: '🍽️' },
  { id: 'burger', name: '汉堡', emoji: '🍔' },
  { id: 'pizza', name: '披萨', emoji: '🍕' },
  { id: 'chicken', name: '炸鸡', emoji: '🍗' },
  { id: 'coffee', name: '咖啡', emoji: '☕' },
  { id: 'dessert', name: '甜点', emoji: '🍰' },
  { id: 'drink', name: '饮品', emoji: '🥤' }
]

const products = [
  {
    id: '1',
    name: '经典芝士汉堡',
    description: '精选牛肉饼配芝士、生菜、番茄',
    price: 28.00,
    categoryId: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    id: '2',
    name: '玛格丽特披萨',
    description: '经典意式披萨，番茄酱、马苏里拉奶酪',
    price: 58.00,
    categoryId: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    id: '3',
    name: '香辣炸鸡桶',
    description: '外酥里嫩的香辣炸鸡，配薯条和可乐',
    price: 45.00,
    categoryId: 'chicken',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400'
  },
  {
    id: '4',
    name: '焦糖玛奇朵',
    description: '浓缩咖啡配香草糖浆和牛奶',
    price: 32.00,
    categoryId: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
  },
  {
    id: '5',
    name: '草莓蛋糕',
    description: '新鲜草莓配奶油，松软海绵蛋糕',
    price: 38.00,
    categoryId: 'dessert',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'
  },
  {
    id: '6',
    name: '冰柠檬茶',
    description: '新鲜柠檬，清爽解暑',
    price: 18.00,
    categoryId: 'drink',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'
  },
  {
    id: '7',
    name: '双层牛肉堡',
    description: '双层牛肉饼，双倍满足',
    price: 36.00,
    categoryId: 'burger',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400'
  },
  {
    id: '8',
    name: '意式香肠披萨',
    description: '意大利香肠、蘑菇、洋葱、马苏里拉奶酪',
    price: 68.00,
    categoryId: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  },
  {
    id: '9',
    name: '美式炸鸡',
    description: '经典美式风味，外酥里嫩',
    price: 38.00,
    categoryId: 'chicken',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400'
  },
  {
    id: '10',
    name: '卡布奇诺',
    description: '浓缩咖啡配热牛奶和奶泡',
    price: 28.00,
    categoryId: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
  },
  {
    id: '11',
    name: '巧克力蛋糕',
    description: '浓郁巧克力，甜蜜享受',
    price: 42.00,
    categoryId: 'dessert',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
  },
  {
    id: '12',
    name: '鲜榨橙汁',
    description: '新鲜橙子，维C满满',
    price: 22.00,
    categoryId: 'drink',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'
  }
]

const selectedCategory = ref('all')
const searchQuery = ref('')

const pageTitle = computed(() => {
  const cat = categories.find(c => c.id === selectedCategory.value)
  return cat ? cat.name : '全部美食'
})

const filteredProducts = computed(() => {
  let result = products

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.categoryId === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return result
})

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const resetFilters = () => {
  selectedCategory.value = 'all'
  searchQuery.value = ''
}

const addToCart = (product: any) => {
  cartStore.addToCart(product)
}
</script>

<style scoped>
.product-list-page {
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

.cart-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-count {
  background: #EF476F;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 分类筛选 */
.category-filter {
  background: white;
  padding: 1rem 2rem;
  overflow-x: auto;
  display: flex;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: #FF6B35;
  background: #fff5f0;
}

.category-btn.active {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  border-color: #FF6B35;
  color: white;
}

.cat-icon {
  font-size: 1.5rem;
}

.cat-name {
  font-weight: 600;
}

/* 搜索栏 */
.search-bar {
  max-width: 600px;
  margin: 1.5rem auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 1.25rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-input::placeholder {
  color: #8D99AE;
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
  text-align: center;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 0.5rem;
}

.product-desc {
  color: #8D99AE;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF6B35;
}

.btn-add {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
}

.empty-text {
  color: #8D99AE;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.btn-reset {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .category-filter {
    justify-content: flex-start;
  }
}
</style>
