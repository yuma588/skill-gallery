<template>
  <div class="simple-home">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">Gourmet Velocity</h1>
      <nav class="nav">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">菜单</a>
        <a href="#" class="nav-link">订单</a>
      </nav>
    </header>

    <!-- Banner -->
    <div class="banner">
      <h2 class="banner-title">美味与速度</h2>
      <p class="banner-text">Gourmet Velocity - 您的点餐专家</p>
    </div>

    <!-- Products -->
    <div class="container">
      <h3 class="section-title">精选美食</h3>
      <div class="products-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
              <button class="btn-add">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const products = ref([
  {
    id: '1',
    name: '经典芝士汉堡',
    description: '精选牛肉饼配芝士、生菜、番茄',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    id: '2',
    name: '玛格丽特披萨',
    description: '经典意式披萨，番茄酱、马苏里拉奶酪',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    id: '3',
    name: '香辣炸鸡桶',
    description: '外酥里嫩的香辣炸鸡，配薯条和可乐',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400'
  },
  {
    id: '4',
    name: '焦糖玛奇朵',
    description: '浓缩咖啡配香草糖浆和牛奶',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
  },
  {
    id: '5',
    name: '草莓蛋糕',
    description: '新鲜草莓配奶油，松软海绵蛋糕',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'
  },
  {
    id: '6',
    name: '冰柠檬茶',
    description: '新鲜柠檬，清爽解暑',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'
  },
  {
    id: '7',
    name: '双层牛肉堡',
    description: '双层牛肉饼，双倍满足',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400'
  },
  {
    id: '8',
    name: '意式香肠披萨',
    description: '意大利香肠、蘑菇、洋葱、马苏里拉奶酪',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  }
])
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
}

.simple-home {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
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

.banner {
  background: linear-gradient(135deg, #FF6B35 0%, #FFC145 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.banner-text {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2D3142;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
  font-weight: 600;
  color: #2D3142;
  margin-bottom: 0.5rem;
}

.product-desc {
  color: #8D99AE;
  font-size: 0.95rem;
  line-height: 1.5;
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
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 1.75rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
