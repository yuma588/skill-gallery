<template>
  <Layout>
    <div class="order-detail-page">
      <div class="page-header">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <h1 class="page-title">订单详情</h1>
      </div>

      <div v-loading="loading" class="detail-content">
        <div v-if="order" class="detail-container">
          <!-- Order Status Card -->
          <div class="status-card">
            <div class="status-info">
              <h2 class="status-title">{{ getStatusTitle(order.status) }}</h2>
              <p class="status-description">{{ getStatusDescription(order.status) }}</p>
            </div>
            <OrderStatusBadge :status="order.status" />
          </div>

          <!-- Order Info Card -->
          <div class="info-card">
            <h3 class="card-title">订单信息</h3>
            <div class="info-row">
              <span class="label">订单号</span>
              <span class="value">{{ order.orderNumber }}</span>
            </div>
            <div class="info-row">
              <span class="label">下单时间</span>
              <span class="value">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div class="info-row">
              <span class="label">支付方式</span>
              <span class="value">{{ getPaymentMethod(order.paymentMethod) }}</span>
            </div>
          </div>

          <!-- Address Card -->
          <div class="info-card">
            <h3 class="card-title">收货地址</h3>
            <div class="address-detail">
              <h4 class="receiver-name">{{ order.address.receiverName }}</h4>
              <p class="receiver-phone">{{ order.address.receiverPhone }}</p>
              <p class="address-full">
                {{ order.address.province }} {{ order.address.city }}
                {{ order.address.district }} {{ order.address.detailAddress }}
              </p>
            </div>
          </div>

          <!-- Items Card -->
          <div class="items-card">
            <h3 class="card-title">商品清单</h3>
            <div class="items-list">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="order-item"
              >
                <img :src="item.productImage" :alt="item.productName" class="item-image" />
                <div class="item-details">
                  <h4 class="item-name">{{ item.productName }}</h4>
                  <p class="item-quantity">数量: {{ item.quantity }}</p>
                </div>
                <p class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Price Summary Card -->
          <div class="price-card">
            <h3 class="card-title">费用明细</h3>
            <div class="price-row">
              <span>商品金额</span>
              <span>¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="price-row">
              <span>配送费</span>
              <span>¥0.00</span>
            </div>
            <div class="price-divider"></div>
            <div class="price-row total">
              <span>实付金额</span>
              <span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="order.status === 'PENDING'" class="action-buttons">
            <el-button type="primary" @click="goToPayment">
              去支付
            </el-button>
            <el-button @click="handleCancelOrder">
              取消订单
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order.store'
import { ElMessageBox, ElMessage } from 'element-plus'
import { OrderStatus } from '@/types'
import Layout from '@/components/layout/Layout.vue'
import OrderStatusBadge from '@/components/business/OrderStatusBadge.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(false)
const order = ref(orderStore.currentOrder)

onMounted(async () => {
  const orderId = route.params.id as string
  if (orderId) {
    await fetchOrderDetail(orderId)
  }
})

const fetchOrderDetail = async (orderId: string) => {
  loading.value = true
  try {
    order.value = await orderStore.fetchOrderDetail(orderId)
  } catch (error) {
    console.error('获取订单详情失败', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

const getStatusTitle = (status: OrderStatus) => {
  const titleMap = {
    [OrderStatus.PENDING]: '等待支付',
    [OrderStatus.PAID]: '支付成功',
    [OrderStatus.PREPARING]: '商家准备中',
    [OrderStatus.DELIVERING]: '配送中',
    [OrderStatus.COMPLETED]: '订单已完成',
    [OrderStatus.CANCELLED]: '订单已取消'
  }
  return titleMap[status] || '未知状态'
}

const getStatusDescription = (status: OrderStatus) => {
  const descMap = {
    [OrderStatus.PENDING]: '请在30分钟内完成支付',
    [OrderStatus.PAID]: '订单已支付，商家正在准备',
    [OrderStatus.PREPARING]: '预计30分钟内完成',
    [OrderStatus.DELIVERING]: '骑手正在配送中，请保持电话畅通',
    [OrderStatus.COMPLETED]: '感谢您的订单，期待您的再次光临',
    [OrderStatus.CANCELLED]: '订单已取消'
  }
  return descMap[status] || ''
}

const getPaymentMethod = (method: string) => {
  const methodMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    credit: '信用卡'
  }
  return methodMap[method] || method
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToPayment = () => {
  if (order.value) {
    router.push(`/payment?orderId=${order.value.id}`)
  }
}

const handleCancelOrder = async () => {
  if (!order.value) return

  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await orderStore.cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    await fetchOrderDetail(order.value.id)
  } catch (error) {
    console.error('取消订单失败', error)
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  max-width: 800px;
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

.detail-content {
  min-height: 400px;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.status-card {
  background: var(--overlay-gradient);
  color: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  .status-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
  }

  .status-description {
    opacity: 0.9;
  }
}

.info-card,
.items-card,
.price-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-lg);
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
  }
}

.address-detail {
  .receiver-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark-gray);
    margin-bottom: var(--spacing-xs);
  }

  .receiver-phone {
    color: var(--medium-gray);
    margin-bottom: var(--spacing-sm);
  }

  .address-full {
    color: var(--dark-gray);
    line-height: 1.6;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--light-gray);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-details {
  flex: 1;

  .item-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-gray);
    margin-bottom: var(--spacing-xs);
  }

  .item-quantity {
    font-size: 0.9rem;
    color: var(--medium-gray);
  }
}

.item-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  font-size: 0.95rem;
  color: var(--dark-gray);

  &.total {
    font-size: 1.25rem;
    font-weight: 600;
    border-top: 1px solid var(--light-gray);
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-lg);
  }
}

.total-price {
  color: var(--primary-orange);
  font-size: 1.5rem;
  font-weight: 700;
}

.price-divider {
  height: 1px;
  background: var(--light-gray);
  margin: var(--spacing-lg) 0;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);

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

@media (max-width: 640px) {
  .order-detail-page {
    padding: var(--spacing-lg);
  }

  .status-card {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .order-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-image {
    width: 100%;
    height: 150px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
