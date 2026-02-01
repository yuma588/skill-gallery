<template>
  <Layout>
    <div class="payment-page">
      <div class="page-header">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <h1 class="page-title">支付订单</h1>
      </div>

      <div v-loading="loading" class="payment-content">
        <div v-if="order" class="payment-container">
          <!-- Order Summary Card -->
          <div class="order-summary-card">
            <div class="summary-header">
              <h3 class="card-title">订单金额</h3>
              <p class="order-number">订单号: {{ order.orderNumber }}</p>
            </div>
            <div class="amount-display">
              <span class="currency">¥</span>
              <span class="amount">{{ order.totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Methods Card -->
          <div class="payment-methods-card">
            <h3 class="card-title">选择支付方式</h3>
            <div class="payment-methods">
              <div
                v-for="method in paymentMethods"
                :key="method.value"
                class="payment-method-item"
                :class="{ active: selectedPaymentMethod === method.value }"
                @click="selectPaymentMethod(method.value)"
              >
                <div class="method-icon">
                  <el-icon :size="32" :color="method.color">
                    <component :is="method.icon" />
                  </el-icon>
                </div>
                <div class="method-info">
                  <h4 class="method-name">{{ method.name }}</h4>
                  <p class="method-desc">{{ method.description }}</p>
                </div>
                <el-icon v-if="selectedPaymentMethod === method.value" :size="24" color="#FF6B35">
                  <CircleCheck />
                </el-icon>
              </div>
            </div>
          </div>

          <!-- Security Tips -->
          <div class="security-tips">
            <div class="tip-item">
              <el-icon :size="20" color="#52C41A"><Lock /></el-icon>
              <span>支付过程全程加密</span>
            </div>
            <div class="tip-item">
              <el-icon :size="20" color="#52C41A"><Shield /></el-icon>
              <span>资金安全有保障</span>
            </div>
            <div class="tip-item">
              <el-icon :size="20" color="#52C41A"><Phone /></el-icon>
              <span>7x24小时客服支持</span>
            </div>
          </div>

          <!-- Submit Button -->
          <el-button
            type="primary"
            size="large"
            :loading="submitting"
            :disabled="!selectedPaymentMethod"
            @click="handlePayment"
            class="payment-button"
          >
            立即支付 ¥{{ order.totalAmount.toFixed(2) }}
          </el-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order.store'
import { ElMessage } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Shield,
  Phone,
  CircleCheck
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(false)
const submitting = ref(false)
const order = ref(orderStore.currentOrder)
const selectedPaymentMethod = ref<'alipay' | 'wechat' | 'credit'>('alipay')

const paymentMethods = [
  {
    value: 'alipay',
    name: '支付宝',
    description: '推荐使用支付宝支付',
    icon: 'CreditCard',
    color: '#1677FF'
  },
  {
    value: 'wechat',
    name: '微信支付',
    description: '安全便捷的微信支付',
    icon: 'CreditCard',
    color: '#07C160'
  },
  {
    value: 'credit',
    name: '信用卡',
    description: '支持主流信用卡',
    icon: 'CreditCard',
    color: '#FF6B35'
  }
]

onMounted(async () => {
  const orderId = route.query.orderId as string
  if (orderId) {
    await fetchOrderDetail(orderId)
  } else {
    ElMessage.error('订单ID不存在')
    router.back()
  }
})

const fetchOrderDetail = async (orderId: string) => {
  loading.value = true
  try {
    order.value = await orderStore.fetchOrderDetail(orderId)
  } catch (error) {
    console.error('获取订单详情失败', error)
    ElMessage.error('获取订单详情失败')
    router.back()
  } finally {
    loading.value = false
  }
}

const selectPaymentMethod = (method: 'alipay' | 'wechat' | 'credit') => {
  selectedPaymentMethod.value = method
}

const handlePayment = async () => {
  if (!selectedPaymentMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  if (!order.value) {
    ElMessage.error('订单信息不存在')
    return
  }

  try {
    submitting.value = true

    // 调用支付 API
    // await api.post('/payment', {
    //   orderId: order.value.id,
    //   paymentMethod: selectedPaymentMethod.value
    // })

    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('支付成功')
    router.push({
      path: '/payment/result',
      query: { success: 'true', orderId: order.value.id }
    })
  } catch (error) {
    console.error('支付失败', error)
    ElMessage.error('支付失败，请重试')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.payment-page {
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

.payment-content {
  min-height: 400px;
}

.payment-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.order-summary-card {
  background: var(--overlay-gradient);
  color: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
}

.summary-header {
  margin-bottom: var(--spacing-lg);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.order-number {
  opacity: 0.9;
  font-size: 0.95rem;
}

.amount-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--spacing-xs);
}

.currency {
  font-size: 2rem;
  font-weight: 600;
}

.amount {
  font-size: 3.5rem;
  font-weight: 700;
}

.payment-methods-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.payment-method-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 2px solid var(--light-gray);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--primary-orange);
    background: #fff5f0;
  }

  &.active {
    border-color: var(--primary-orange);
    background: linear-gradient(135deg, #fff5f0 0%, var(--white) 100%);
    box-shadow: var(--shadow-md);
  }
}

.method-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-info {
  flex: 1;

  .method-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark-gray);
    margin-bottom: var(--spacing-xs);
  }

  .method-desc {
    font-size: 0.85rem;
    color: var(--medium-gray);
  }
}

.security-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.tip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.85rem;
  color: var(--medium-gray);
  text-align: center;
}

.payment-button {
  width: 100%;
  height: 52px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  background: var(--overlay-gradient);
  border: none;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 640px) {
  .payment-page {
    padding: var(--spacing-lg);
  }

  .amount {
    font-size: 2.5rem;
  }

  .currency {
    font-size: 1.5rem;
  }

  .security-tips {
    grid-template-columns: 1fr;
  }
}
</style>
