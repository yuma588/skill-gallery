<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Illustration -->
      <div class="login-left">
        <div class="illustration">
          <div class="circle-bg"></div>
          <div class="food-icons">
            <el-icon :size="80" color="#FF6B35" class="food-icon food-1"><Food /></el-icon>
            <el-icon :size="60" color="#FFC145" class="food-icon food-2"><Coffee /></el-icon>
            <el-icon :size="70" color="#D32F2F" class="food-icon food-3"><Pizza /></el-icon>
          </div>
          <h1 class="welcome-text">欢迎回来</h1>
          <p class="subtitle-text">美味与速度的完美结合</p>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="login-right">
        <div class="login-form-container">
          <div class="logo-section">
            <el-icon :size="48" color="#FF6B35">
              <Food />
            </el-icon>
            <h2>Gourmet Velocity</h2>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <router-link to="/forgot-password" class="forgot-link">忘记密码？</router-link>
            </div>

            <el-button
              type="primary"
              native-type="submit"
              size="large"
              :loading="loading"
              class="login-button"
            >
              登录
            </el-button>
          </el-form>

          <div class="register-link">
            还没有账号？
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Food, User, Lock, Coffee, Pizza } from '@element-plus/icons-vue'
import type { LoginRequest } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true
    await authStore.login(loginForm)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  padding: var(--spacing-lg);
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  min-height: 600px;
}

.login-left {
  background: var(--overlay-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  position: relative;
  overflow: hidden;
}

.illustration {
  text-align: center;
  color: var(--white);
  position: relative;
  z-index: 1;
}

.circle-bg {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.food-icons {
  position: relative;
  height: 200px;
  margin-bottom: var(--spacing-2xl);

  .food-icon {
    position: absolute;
    transition: all var(--transition-normal);

    &.food-1 {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      animation: float 3s ease-in-out infinite;
    }

    &.food-2 {
      bottom: 20px;
      left: 20%;
      animation: float 3s ease-in-out infinite 0.5s;
    }

    &.food-3 {
      bottom: 30px;
      right: 20%;
      animation: float 3s ease-in-out infinite 1s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.welcome-text {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.subtitle-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: var(--spacing-2xl);

  h2 {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--dark-gray);
    margin-top: var(--spacing-md);
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: var(--spacing-lg);
  }

  :deep(.el-input__wrapper) {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);

    &:hover,
    &.is-focus {
      box-shadow: var(--shadow-md);
      border-color: var(--primary-orange);
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);

  .forgot-link {
    color: var(--primary-orange);
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: var(--accent-red);
    }
  }
}

.login-button {
  width: 100%;
  background: var(--overlay-gradient);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  height: 48px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.register-link {
  text-align: center;
  color: var(--medium-gray);

  a {
    color: var(--primary-orange);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      color: var(--accent-red);
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .login-left {
    display: none;
  }
}
</style>
