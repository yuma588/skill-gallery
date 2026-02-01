<template>
  <Layout>
    <div class="checkout-page">
      <h1 class="page-title">订单确认</h1>

      <div v-loading="loading" class="checkout-content">
        <div class="checkout-container">
          <!-- Left Section -->
          <div class="checkout-left">
            <!-- Address Section -->
            <div class="checkout-section">
              <h3 class="section-title">
                <el-icon><Location /></el-icon>
                收货地址
              </h3>
              <div v-if="selectedAddress" class="address-card selected">
                <div class="address-info">
                  <h4 class="receiver-name">{{ selectedAddress.receiverName }}</h4>
                  <p class="receiver-phone">{{ selectedAddress.receiverPhone }}</p>
                  <p class="address-detail">
                    {{ selectedAddress.province }} {{ selectedAddress.city }}
                    {{ selectedAddress.district }} {{ selectedAddress.detailAddress }}
                  </p>
                </div>
                <el-tag type="primary" size="small">默认</el-tag>
              </div>
              <el-button link type="primary" @click="showAddressDialog">
                更换地址
              </el-button>
            </div>

            <!-- Items Section -->
            <div class="checkout-section">
              <h3 class="section-title">
                <el-icon><ShoppingCart /></el-icon>
                商品清单
              </h3>
              <div class="checkout-items">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="checkout-item"
                >
                  <img :src="item.productImage" :alt="item.productName" class="item-image" />
                  <div class="item-details">
                    <h4 class="item-name">{{ item.productName }}</h4>
                    <p class="item-quantity">x {{ item.quantity }}</p>
                  </div>
                  <p class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Section - Summary -->
          <div class="checkout-right">
            <div class="order-summary">
              <h3 class="summary-title">订单金额</h3>

              <div class="summary-row">
                <span>商品金额</span>
                <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>

              <div class="summary-row">
                <span>配送费</span>
                <span>¥0.00</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>实付金额</span>
                <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>

              <el-button
                type="primary"
                size="large"
                :loading="submitting"
                @click="handleSubmitOrder"
              >
                提交订单
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Selection Dialog -->
      <el-dialog
        v-model="addressDialogVisible"
        title="选择收货地址"
        width="600px"
        @close="fetchAddresses"
      >
        <div v-loading="orderStore.loading" class="address-list">
          <div
            v-for="address in orderStore.addresses"
            :key="address.id"
            class="address-card"
            :class="{ selected: selectedAddress?.id === address.id }"
            @click="handleSelectAddress(address)"
          >
            <div class="address-info">
              <h4 class="receiver-name">{{ address.receiverName }}</h4>
              <p class="receiver-phone">{{ address.receiverPhone }}</p>
              <p class="address-detail">
                {{ address.province }} {{ address.city }}
                {{ address.district }} {{ address.detailAddress }}
              </p>
            </div>
            <el-icon v-if="selectedAddress?.id === address.id" :size="24" color="#FF6B35">
              <Check />
            </el-icon>
          </div>
        </div>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useOrderStore } from '@/stores/order.store'
import { ElMessage } from 'element-plus'
import Layout from '@/components/layout/Layout.vue'
import { Location, ShoppingCart, Check } from '@element-plus/icons-vue'
import type { Address } from '@/types'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const loading = ref(false)
const submitting = ref(false)
const addressDialogVisible = ref(false)
const selectedAddress = ref<Address | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      cartStore.fetchCart(),
      fetchAddresses()
    ])

    // 自动选择默认地址
    const defaultAddress = orderStore.addresses.find(addr => addr.isDefault)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
    }
  } catch (error) {
    console.error('初始化失败', error)
  } finally {
    loading.value = false
  }
})

const fetchAddresses = async () => {
  try {
    await orderStore.fetchAddresses()
  } catch (error) {
    console.error('获取地址列表失败', error)
  }
}

const showAddressDialog = () => {
  addressDialogVisible.value = true
}

const handleSelectAddress = (address: Address) => {
  selectedAddress.value = address
  addressDialogVisible.value = false
}

const handleSubmitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  try {
    submitting.value = true

    const orderData = {
      addressId: selectedAddress.value.id,
      items: cartStore.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }

    const order = await orderStore.createOrder(orderData)
    ElMessage.success('订单创建成功')
    router.push(`/payment?orderId=${order.id}`)
  } catch (error) {
    console.error('创建订单失败', error)
    ElMessage.error('订单创建失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xl);
}

.checkout-content {
  min-height: 400px;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-xl);
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.checkout-section {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-lg);

  .el-icon {
    color: var(--primary-orange);
  }
}

.address-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  background: var(--light-gray);
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;

  &.selected {
    border-color: var(--primary-orange);
    background: linear-gradient(135deg, #fff5f0 0%, var(--light-gray) 100%);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.address-info {
  flex: 1;
}

.receiver-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xs);
}

.receiver-phone {
  font-size: 0.95rem;
  color: var(--medium-gray);
  margin-bottom: var(--spacing-xs);
}

.address-detail {
  font-size: 0.95rem;
  color: var(--dark-gray);
  line-height: 1.5;
}

.checkout-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--light-gray);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.item-details {
  flex: 1;
}

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

.item-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.checkout-right {
  position: sticky;
  top: 100px;
}

.order-summary {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-lg);
}

.summary-row {
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
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: var(--light-gray);
  margin: var(--spacing-lg) 0;
}

.el-button--primary {
  width: 100%;
  background: var(--overlay-gradient);
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  height: 48px;
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 500px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }

  .checkout-right {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: var(--spacing-lg);
  }

  .checkout-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-image {
    width: 100%;
    height: 150px;
  }
}
</style>
