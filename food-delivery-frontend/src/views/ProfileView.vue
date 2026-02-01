<template>
  <Layout>
    <div class="profile-page">
      <div class="profile-container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="profile-cover"></div>
          <div class="profile-info">
            <div class="avatar-wrapper">
              <el-avatar :size="100" :src="authStore.user?.avatar">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <el-button class="edit-avatar-btn" :icon="Camera" circle size="small" />
            </div>
            <h2 class="username">{{ authStore.user?.username }}</h2>
            <p class="user-email">{{ authStore.user?.email }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ orderCount }}</span>
                <span class="stat-label">订单</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">0</span>
                <span class="stat-label">优惠券</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">0</span>
                <span class="stat-label">收藏</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Grid -->
        <div class="menu-grid">
          <div class="menu-item" @click="goToEditProfile">
            <div class="menu-icon">
              <el-icon :size="24"><User /></el-icon>
            </div>
            <span class="menu-text">个人信息</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item" @click="goToAddressManagement">
            <div class="menu-icon">
              <el-icon :size="24"><Location /></el-icon>
            </div>
            <span class="menu-text">收货地址</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item" @click="goToChangePassword">
            <div class="menu-icon">
              <el-icon :size="24"><Lock /></el-icon>
            </div>
            <span class="menu-text">修改密码</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item">
            <div class="menu-icon">
              <el-icon :size="24"><Bell /></el-icon>
            </div>
            <span class="menu-text">消息通知</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item">
            <div class="menu-icon">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <span class="menu-text">我的收藏</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>

          <div class="menu-item">
            <div class="menu-icon">
              <el-icon :size="24"><ChatDotSquare /></el-icon>
            </div>
            <span class="menu-text">客服帮助</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- Logout Button -->
        <div class="logout-section">
          <el-button type="danger" size="large" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useOrderStore } from '@/stores/order.store'
import { ElMessageBox } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import {
  User,
  Location,
  Lock,
  Bell,
  Star,
  ChatDotSquare,
  Camera,
  ArrowRight,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()

const orderCount = ref(0)

onMounted(async () => {
  await fetchOrderCount()
})

const fetchOrderCount = async () => {
  try {
    const response = await orderStore.fetchOrders()
    orderCount.value = response.total || 0
  } catch (error) {
    console.error('获取订单数量失败', error)
  }
}

const goToEditProfile = () => {
  router.push('/profile/edit')
}

const goToAddressManagement = () => {
  router.push('/profile/address')
}

const goToChangePassword = () => {
  router.push('/profile/password')
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
.profile-page {
  min-height: calc(100vh - 72px);
  background: var(--bg-gradient);
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
}

.profile-cover {
  height: 150px;
  background: var(--overlay-gradient);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(transparent, var(--white));
  }
}

.profile-info {
  padding: var(--spacing-xl);
  text-align: center;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);

  .el-avatar {
    border: 4px solid var(--white);
    box-shadow: var(--shadow-md);
  }

  .edit-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--primary-orange);
    border: 2px solid var(--white);
    color: var(--white);
  }
}

.username {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xs);
}

.user-email {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-lg);
}

.user-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--medium-gray);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--light-gray);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.menu-item {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);

    .menu-icon {
      background: var(--overlay-gradient);
      color: var(--white);
    }
  }

  .menu-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-orange);
    transition: all var(--transition-normal);
  }

  .menu-text {
    font-weight: 500;
    color: var(--dark-gray);
  }

  .menu-arrow {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    color: var(--medium-gray);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  &:hover .menu-arrow {
    opacity: 1;
  }
}

.logout-section {
  text-align: center;

  .el-button {
    width: 100%;
    max-width: 400px;
    height: 48px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: var(--radius-lg);
    transition: all var(--transition-normal);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
}

@media (max-width: 640px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .user-stats {
    gap: var(--spacing-md);
  }
}
</style>
