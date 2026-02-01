<template>
  <Layout>
    <div class="payment-result-page">
      <div class="result-container">
        <!-- Success State -->
        <div v-if="success" class="result-content success">
          <div class="result-icon success-icon">
            <el-icon :size="80" color="#52C41A">
              <CircleCheck />
            </el-icon>
          </div>
          <h1 class="result-title">支付成功</h1>
          <p class="result-description">
            感谢您的支付！订单已提交，商家正在准备中。
          </p>

          <div class="order-info-card">
            <div class="info-row">
              <span class="label">订单号</span>
              <span class="value">{{ orderNumber }}</span>
            </div>
            <div class="info-row">
              <span class="label">支付金额</span>
              <span class="value amount">¥{{ amount }}</span>
            </div>
            <div class="info-row">
              <span class="label">支付时间</span>
              <span class="value">{{ paymentTime }}</span>
            </div>
          </div>

          <div class="result-actions">
            <el-button type="primary" size="large" @click="goToOrders">
              查看订单
            </el-button>
            <el-button size="large" @click="goToHome">
              返回首页
            </el-button>
          </div>

          <!-- Tips -->
          <div class="result-tips">
            <el-icon :size="20" color="#FFC145"><Bell /></el-icon>
            <p>预计30分钟内送达，请保持电话畅通</p>
          </div>
        </div>

        <!-- Failure State -->
        <div v-else class="result-content failure">
          <div class="result-icon failure-icon">
            <el-icon :size="80" color="#FF4D4F">
              <CircleClose />
            </el-icon>
          </div>
          <h1 class="result-title">支付失败</h1>
          <p class="result-description">
            很抱歉，支付过程中出现错误，请重试或联系客服。
          </p>

          <div class="result-actions">
            <el-button type="primary" size="large" @click="retryPayment">
              重新支付
            </el-button>
            <el-button size="large" @click="goToOrders">
              查看订单
            </el-button>
          </div>

          <!-- Contact Support -->
          <div class="contact-support">
            <p>如需帮助，请联系客服：</p>
            <p class="support-phone">400-888-8888</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CircleCheck, CircleClose, Bell } from '@element-plus/icons-vue'
import Layout from '@/components/layout/Layout.vue'

const route = useRoute()
const router = useRouter()

const success = computed(() => route.query.success === 'true')
const orderId = ref(route.query.orderId as string)

// Mock data - 实际应该从后端获取
const orderNumber = computed(() => 'GV' + Date.now())
const amount = computed(() => '99.00')
const paymentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

onMounted(() => {
  // 这里可以根据 orderId 获取订单详情
})

const goToOrders = () => {
  router.push('/orders')
}

const goToHome = () => {
  router.push('/')
}

const retryPayment = () => {
  if (orderId.value) {
    router.push(`/payment?orderId=${orderId.value}`)
  } else {
    router.back()
  }
}
</script>

<style lang="scss" scoped>
.payment-result-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.result-container {
  max-width: 500px;
  width: 100%;
}

.result-content {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
}

.result-icon {
  margin-bottom: var(--spacing-lg);

  &.success-icon {
    animation: successPulse 0.6s ease-out;
  }

  &.failure-icon {
    animation: shake 0.6s ease-out;
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.result-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-md);
}

.result-description {
  color: var(--medium-gray);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.order-info-card {
  background: var(--light-gray);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  font-size: 0.95rem;

  .label {
    color: var(--medium-gray);
  }

  .value {
    color: var(--dark-gray);
    font-weight: 500;

    &.amount {
      color: var(--primary-orange);
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
}

.result-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);

  .el-button {
    flex: 1;
    height: 44px;
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

.result-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
  border-radius: var(--radius-lg);
  border: 1px solid #ffd591;

  p {
    margin: 0;
    color: #d46b08;
    font-size: 0.9rem;
  }
}

.contact-support {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--light-gray);

  p {
    color: var(--medium-gray);
    font-size: 0.95rem;
    margin-bottom: var(--spacing-xs);
  }

  .support-phone {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-orange);
  }
}

@media (max-width: 640px) {
  .payment-result-page {
    padding: var(--spacing-lg);
  }

  .result-content {
    padding: var(--spacing-xl);
  }

  .result-title {
    font-size: 1.5rem;
  }

  .result-actions {
    flex-direction: column;
  }
}
</style>
