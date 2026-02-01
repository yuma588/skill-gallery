<template>
  <div class="landing-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🍕</span>
          <span class="logo-text">Gourmet Velocity</span>
        </div>
        <nav class="nav">
          <router-link to="/products" class="nav-link">首页</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            <span class="cart-icon">🛒</span>
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/register" class="nav-link">注册</router-link>
        </nav>
      </div>
    </header>

    <!-- 主 Banner -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">美味与速度<br/>的完美结合</h1>
        <p class="hero-subtitle">
          数以万计的美食，30分钟内送达<br/>
          让您足不出户，享受舌尖上的美味
        </p>
        <button class="cta-button" @click="goToProducts">
          开始点餐 →
        </button>
      </div>
      <div class="hero-image">
        <div class="food-icon food-1">🍔</div>
        <div class="food-icon food-2">🍕</div>
        <div class="food-icon food-3">🍟</div>
        <div class="food-icon food-4">🥤</div>
      </div>
    </div>

    <!-- 特色介绍 -->
    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3 class="feature-title">极速配送</h3>
        <p class="feature-desc">30分钟内送达，美味不等待</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">👨‍🍳</div>
        <h3 class="feature-title">专业厨师</h3>
        <p class="feature-desc">顶级厨师团队，匠心制作</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🌟</div>
        <h3 class="feature-title">品质保证</h3>
        <p class="feature-desc">严选食材，新鲜直达</p>
      </div>
    </div>

    <!-- 分类预览 -->
    <div class="category-preview">
      <h2 class="section-title">热门分类</h2>
      <div class="category-grid">
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">🍔</span>
          <span class="cat-name">汉堡</span>
        </div>
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">🍕</span>
          <span class="cat-name">披萨</span>
        </div>
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">🍗</span>
          <span class="cat-name">炸鸡</span>
        </div>
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">☕</span>
          <span class="cat-name">咖啡</span>
        </div>
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">🍰</span>
          <span class="cat-name">甜点</span>
        </div>
        <div class="category-item" @click="goToProducts">
          <span class="cat-emoji">🥤</span>
          <span class="cat-name">饮品</span>
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
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const router = useRouter()
const cartStore = useCartStore()

const cartCount = computed(() => cartStore.totalCount)

const goToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.landing-page {
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

/* Hero 区域 */
.hero-section {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  min-height: 500px;
  color: white;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.8;
  opacity: 0.95;
  margin-bottom: 2rem;
}

.cta-button {
  background: white;
  color: #FF6B35;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.food-icon {
  font-size: 5rem;
  animation: float 3s ease-in-out infinite;
}

.food-1 {
  animation-delay: 0s;
}

.food-2 {
  animation-delay: 0.5s;
}

.food-3 {
  animation-delay: 1s;
}

.food-4 {
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 特色介绍 */
.features-section {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: #8D99AE;
  font-size: 1rem;
  line-height: 1.6;
}

/* 分类预览 */
.category-preview {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem 4rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 2rem;
  text-align: center;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.category-item {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #fff5f0 0%, white 100%);
}

.cat-emoji {
  display: block;
  font-size: 4rem;
  margin-bottom: 1rem;
}

.cat-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D3142;
}

/* 页脚 */
.footer {
  background: #2D3142;
  color: white;
  text-align: center;
  padding: 2rem;
}

.footer-text {
  opacity: 0.8;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .features-section,
  .category-grid {
    grid-template-columns: 1fr;
  }

  .nav {
    gap: 1rem;
  }
}
</style>
