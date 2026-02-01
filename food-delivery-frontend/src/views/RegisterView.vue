<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Side - Form -->
      <div class="register-left">
        <div class="register-form-container">
          <div class="logo-section">
            <el-icon :size="48" color="#FF6B35">
              <Food />
            </el-icon>
            <h2>创建账号</h2>
            <p>加入 Gourmet Velocity，开启美食之旅</p>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="register-form"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                size="large"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="请输入手机号"
                size="large"
                :prefix-icon="Phone"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="agreeTerms">
                我已阅读并同意
                <a href="#" class="terms-link">《服务条款》</a>
                和
                <a href="#" class="terms-link">《隐私政策》</a>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="primary"
              native-type="submit"
              size="large"
              :loading="loading"
              class="register-button"
            >
              注册
            </el-button>
          </el-form>

          <div class="login-link">
            已有账号？
            <router-link to="/login">立即登录</router-link>
          </div>
        </div>
      </div>

      <!-- Right Side - Illustration -->
      <div class="register-right">
        <div class="illustration">
          <div class="circle-bg"></div>
          <div class="food-icons">
            <el-icon :size="80" color="#FF6B35" class="food-icon food-1"><Food /></el-icon>
            <el-icon :size="60" color="#FFC145" class="food-icon food-2"><Coffee /></el-icon>
            <el-icon :size="70" color="#D32F2F" class="food-icon food-3"><Pizza /></el-icon>
          </div>
          <h1 class="welcome-text">开启美食之旅</h1>
          <p class="subtitle-text">数以万计的美味等你来探索</p>
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
import { Food, User, Message, Phone, Lock, Coffee, Pizza } from '@element-plus/icons-vue'
import type { RegisterRequest } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const confirmPassword = ref('')
const agreeTerms = ref(false)

const registerForm = reactive<RegisterRequest>({
  username: '',
  password: '',
  email: '',
  phone: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    if (!agreeTerms.value) {
      ElMessage.warning('请先同意服务条款和隐私政策')
      return
    }

    loading.value = true
    await authStore.register(registerForm)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (error) {
    console.error('注册失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  padding: var(--spacing-lg);
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  min-height: 700px;
}

.register-left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.register-form-container {
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

  p {
    color: var(--medium-gray);
    font-size: 0.95rem;
  }
}

.register-form {
  :deep(.el-form-item) {
    margin-bottom: var(--spacing-md);
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

  .terms-link {
    color: var(--primary-orange);
    text-decoration: none;

    &:hover {
      color: var(--accent-red);
    }
  }
}

.register-button {
  width: 100%;
  background: var(--overlay-gradient);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  height: 48px;
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.login-link {
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

.register-right {
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

@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .register-right {
    display: none;
  }
}
</style>
