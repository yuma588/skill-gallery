<template>
  <Layout>
    <div class="edit-profile-page">
      <div class="page-header">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <h1 class="page-title">编辑个人信息</h1>
      </div>

      <div class="profile-form-container">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <el-avatar :size="120" :src="formData.avatar || authStore.user?.avatar">
              {{ formData.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <el-button class="change-avatar-btn" :icon="Camera" circle size="large" />
          </div>
          <p class="avatar-tip">点击上传头像</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          class="profile-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSubmit"
            >
              保存修改
            </el-button>
            <el-button size="large" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import { ArrowLeft, Camera } from '@element-plus/icons-vue'
import type { User } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  avatar: ''
})

const formRules: FormRules = {
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
  ]
}

onMounted(() => {
  if (authStore.user) {
    Object.assign(formData, authStore.user)
  }
})

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    // 调用 API 更新用户信息
    // await api.put('/auth/profile', formData)

    ElMessage.success('个人信息更新成功')
    await authStore.fetchUserInfo()
    router.back()
  } catch (error) {
    console.error('更新失败', error)
    ElMessage.error('更新失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  if (authStore.user) {
    Object.assign(formData, authStore.user)
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.edit-profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-gray);
}

.profile-form-container {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-md);
}

.avatar-section {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);

  .el-avatar {
    border: 4px solid var(--light-gray);
  }

  .change-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--primary-orange);
    border: 4px solid var(--white);
    color: var(--white);
    transition: all var(--transition-normal);

    &:hover {
      transform: scale(1.1);
      background: var(--accent-red);
    }
  }
}

.avatar-tip {
  color: var(--medium-gray);
  font-size: 0.9rem;
}

.profile-form {
  :deep(.el-form-item) {
    margin-bottom: var(--spacing-xl);
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

  .el-button {
    width: 120px;
    border-radius: var(--radius-lg);
    font-weight: 600;

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

@media (max-width: 640px) {
  .profile-form-container {
    padding: var(--spacing-lg);
  }

  .profile-form {
    :deep(.el-form-item__label) {
      width: 80px !important;
    }

    .el-button {
      width: 100%;
      margin-bottom: var(--spacing-md);
    }
  }
}
</style>
