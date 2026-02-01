<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <el-icon :size="32" color="#FF6B35">
          <Food />
        </el-icon>
        <span class="logo-text">Gourmet Velocity</span>
      </router-link>

      <!-- Search Bar -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索美食..."
          :prefix-icon="Search"
          size="large"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Navigation -->
      <nav class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/orders" class="nav-link">我的订单</router-link>
        <router-link to="/profile" class="nav-link">个人中心</router-link>
      </nav>

      <!-- Actions -->
      <div class="header-actions">
        <!-- Cart Icon -->
        <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" class="cart-badge">
          <el-button :icon="ShoppingCart" circle @click="goToCart" />
        </el-badge>

        <!-- User Menu -->
        <el-dropdown v-if="authStore.isAuthenticated" trigger="click">
          <div class="user-avatar">
            <el-avatar :size="40" :src="authStore.user?.avatar">
              {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- Login/Register Buttons -->
        <div v-else class="auth-buttons">
          <el-button @click="goToLogin">登录</el-button>
          <el-button type="primary" @click="goToRegister">注册</el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { ElMessageBox } from 'element-plus'
import { Food, Search, ShoppingCart } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/', query: { keyword: searchKeyword.value } })
  }
}

const goToCart = () => {
  router.push('/cart')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    authStore.logout()
    router.push('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  background: var(--white);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  transition: transform var(--transition-fast);

  &:hover {
    transform: scale(1.05);
  }

  .logo-text {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-orange);
    background: var(--overlay-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.search-bar {
  flex: 1;
  max-width: 400px;

  :deep(.el-input__wrapper) {
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);

    &:hover,
    &.is-focus {
      box-shadow: var(--shadow-md);
      border-color: var(--primary-orange);
    }
  }
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  font-weight: 500;
  color: var(--dark-gray);
  text-decoration: none;
  position: relative;
  padding: var(--spacing-sm) 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--overlay-gradient);
    transition: width var(--transition-normal);
  }

  &:hover::after,
  &.router-link-active::after {
    width: 100%;
  }

  &.router-link-active {
    color: var(--primary-orange);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.cart-badge {
  :deep(.el-badge__content) {
    background: var(--accent-red);
    border: 2px solid var(--white);
  }

  .el-button {
    background: var(--light-gray);
    border: none;
    transition: all var(--transition-normal);

    &:hover {
      background: var(--primary-orange);
      color: var(--white);
      transform: scale(1.1);
    }
  }
}

.user-avatar {
  cursor: pointer;
  transition: transform var(--transition-fast);

  &:hover {
    transform: scale(1.05);
  }
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);

  .el-button {
    border-radius: var(--radius-lg);
    font-weight: 500;
    transition: all var(--transition-normal);

    &.el-button--primary {
      background: var(--overlay-gradient);
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }
  }
}

@media (max-width: 1024px) {
  .search-bar {
    display: none;
  }

  .nav-links {
    display: none;
  }
}
</style>
