<template>
  <Layout>
    <div class="orders-page">
      <h1 class="page-title">我的订单</h1>

      <!-- Order Tabs -->
      <div class="order-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="全部订单" name="all" />
          <el-tab-pane label="待支付" name="pending" />
          <el-tab-pane label="已支付" name="paid" />
          <el-tab-pane label="准备中" name="preparing" />
          <el-tab-pane label="配送中" name="delivering" />
          <el-tab-pane label="已完成" name="completed" />
          <el-tab-pane label="已取消" name="cancelled" />
        </el-tabs>
      </div>

      <!-- Order List -->
      <div v-loading="orderStore.loading" class="orders-content">
        <div v-if="filteredOrders.length > 0" class="orders-list">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="order-card"
            @click="goToOrderDetail(order.id)"
          >
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">订单号: {{ order.orderNumber }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <OrderStatusBadge :status="order.status" />
            </div>

            <div class="order-items-preview">
              <div
                v-for="(item, index) in order.items.slice(0, 3)"
                :key="index"
                class="item-preview"
              >
                <img :src="item.productImage" :alt="item.productName" />
              </div>
              <div v-if="order.items.length > 3" class="more-items">
                +{{ order.items.length - 3 }}
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span>实付金额：</span>
                <span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
              <el-button
                v-if="order.status === 'PENDING'"
                type="primary"
                size="small"
                @click.stop="goToPayment(order.id)"
              >
                去支付
              </el-button>
              <el-button
                v-if="order.status === 'PENDING'"
                size="small"
                @click.stop="handleCancelOrder(order.id)"
              >
                取消订单
              </el-button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          type="order"
          title="暂无订单"
          description="快去点一些美味的外卖吧"
          action-text="去点餐"
          @action="goToHome"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order.store'
import { ElMessageBox, ElMessage } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import OrderStatusBadge from '@/components/business/OrderStatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const orderStore = useOrderStore()

const activeTab = ref('all')

onMounted(async () => {
  await fetchOrders()
})

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orderStore.orders
  }
  return orderStore.orders.filter(order => order.status.toLowerCase() === activeTab.value)
})

const fetchOrders = async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('获取订单列表失败', error)
  }
}

const handleTabChange = () => {
  // Tab change handled by computed property
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

const goToOrderDetail = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

const goToPayment = (orderId: string) => {
  router.push(`/payment?orderId=${orderId}`)
}

const handleCancelOrder = async (orderId: string) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await orderStore.cancelOrder(orderId)
    ElMessage.success('订单已取消')
    await fetchOrders()
  } catch (error) {
    console.error('取消订单失败', error)
  }
}

const goToHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.orders-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xl);
}

.order-tabs {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    font-weight: 600;
    color: var(--medium-gray);

    &:hover {
      color: var(--primary-orange);
    }

    &.is-active {
      color: var(--primary-orange);
    }
  }

  :deep(.el-tabs__active-bar) {
    background: var(--overlay-gradient);
    height: 3px;
  }
}

.orders-content {
  min-height: 400px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--light-gray);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.order-number {
  font-weight: 600;
  color: var(--dark-gray);
}

.order-date {
  font-size: 0.85rem;
  color: var(--medium-gray);
}

.order-items-preview {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.item-preview {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--light-gray);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.more-items {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium-gray);
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  font-size: 0.95rem;
  color: var(--dark-gray);
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.el-button {
  border-radius: var(--radius-md);
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

@media (max-width: 640px) {
  .orders-page {
    padding: var(--spacing-lg);
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .order-footer {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .el-button {
    width: 100%;
  }
}
</style>
