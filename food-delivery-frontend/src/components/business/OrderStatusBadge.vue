<template>
  <div class="order-status-badge" :class="`status-${status.toLowerCase()}`">
    <el-icon class="status-icon">
      <component :is="iconComponent" />
    </el-icon>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OrderStatus } from '@/types'
import {
  Clock,
  CircleCheck,
  Loading,
  Van,
  CircleClose,
  Tickets
} from '@element-plus/icons-vue'

const props = defineProps<{
  status: OrderStatus
}>()

const iconComponent = computed(() => {
  const iconMap = {
    [OrderStatus.PENDING]: Clock,
    [OrderStatus.PAID]: CircleCheck,
    [OrderStatus.PREPARING]: Loading,
    [OrderStatus.DELIVERING]: Van,
    [OrderStatus.COMPLETED]: Tickets,
    [OrderStatus.CANCELLED]: CircleClose
  }
  return iconMap[props.status] || Clock
})

const statusText = computed(() => {
  const textMap = {
    [OrderStatus.PENDING]: '待支付',
    [OrderStatus.PAID]: '已支付',
    [OrderStatus.PREPARING]: '准备中',
    [OrderStatus.DELIVERING]: '配送中',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消'
  }
  return textMap[props.status] || '未知'
})
</script>

<style lang="scss" scoped>
.order-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--transition-fast);

  .status-icon {
    font-size: 16px;
  }

  &.status-pending {
    background: #fff3cd;
    color: #856404;

    .status-icon {
      animation: spin 2s linear infinite;
    }
  }

  &.status-paid {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.status-preparing {
    background: #d4edda;
    color: #155724;

    .status-icon {
      animation: spin 1s linear infinite;
    }
  }

  &.status-delivering {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.status-completed {
    background: #d4edda;
    color: #155724;
  }

  &.status-cancelled {
    background: #f8d7da;
    color: #721c24;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
