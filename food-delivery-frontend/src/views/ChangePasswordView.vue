<template>
  <Layout>
    <div class="change-password-page">
      <div class="page-header">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <h1 class="page-title">修改密码</h1>
      </div>

      <div class="password-form-container">
        <div class="security-tip">
          <el-icon :size="32" color="#FFC145"><Lock /></el-icon>
          <p>为了您的账户安全，请定期修改密码</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="password-form"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="formData.oldPassword"
              type="password"
              placeholder="请输入原密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="formData.newPassword"
              type="password"
              placeholder="请输入新密码（6-20位）"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSubmit"
            >
              确认修改
            </el-button>
            <el-button size="large" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="password-requirements">
          <h4 class="requirements-title">密码要求：</h4>
          <ul class="requirements-list">
            <li>长度为 6-20 个字符</li>
            <li>建议使用字母、数字和特殊字符组合</li>
            <li>不要使用过于简单的密码，如 123456</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import { ArrowLeft, Lock } from '@element-plus/icons-vue'

const router = useRouter()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const formRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    // 调用 API 修改密码
    // await api.put('/auth/password', {
    //   oldPassword: formData.oldPassword,
    //   newPassword: formData.newPassword
    // })

    ElMessage.success('密码修改成功，请重新登录')
    router.push('/login')
  } catch (error) {
    console.error('修改密码失败', error)
    ElMessage.error('修改失败，请检查原密码是否正确')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.change-password-page {
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

.password-form-container {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-md);
}

.security-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, #fff5f0 0%, var(--white) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  text-align: center;

  p {
    color: var(--dark-gray);
    font-size: 1rem;
    line-height: 1.6;
  }
}

.password-form {
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
    width: 140px;
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

.password-requirements {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--light-gray);
}

.requirements-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-md);
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: var(--spacing-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--medium-gray);
    font-size: 0.95rem;
    line-height: 1.6;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--primary-orange);
      font-weight: 700;
    }
  }
}

@media (max-width: 640px) {
  .password-form-container {
    padding: var(--spacing-lg);
  }

  .password-form {
    :deep(.el-form-item__label) {
      width: 90px !important;
    }

    .el-button {
      width: 100%;
      margin-bottom: var(--spacing-md);
    }
  }
}
</style>
