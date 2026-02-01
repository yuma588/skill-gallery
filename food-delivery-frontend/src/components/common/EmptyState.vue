<template>
  <div class="empty-state">
    <div class="empty-icon">
      <el-icon :size="80" :color="iconColor">
        <component :is="iconComponent" />
      </el-icon>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <el-button v-if="actionText" type="primary" @click="handleAction">
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ShoppingCart,
  Document,
  Search,
  Box,
  Picture
} from '@element-plus/icons-vue'

const props = defineProps<{
  type?: 'cart' | 'order' | 'search' | 'data' | 'image'
  title?: string
  description?: string
  actionText?: string
}>()

const emit = defineEmits<{
  action: []
}>()

const iconComponent = computed(() => {
  const iconMap = {
    cart: ShoppingCart,
    order: Document,
    search: Search,
    data: Box,
    image: Picture
  }
  return iconMap[props.type || 'data']
})

const iconColor = computed(() => {
  const colorMap = {
    cart: '#FF6B35',
    order: '#FFC145',
    search: '#8D99AE',
    data: '#D32F2F',
    image: '#2D3142'
  }
  return colorMap[props.type || 'data']
})

const handleAction = () => {
  emit('action')
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
  min-height: 400px;

  .empty-icon {
    margin-bottom: var(--spacing-xl);
    opacity: 0.6;
    transition: all var(--transition-normal);

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-gray);
    margin-bottom: var(--spacing-md);
  }

  .empty-description {
    font-size: 0.95rem;
    color: var(--medium-gray);
    max-width: 400px;
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
  }

  .el-button {
    @include button-primary;
  }
}
</style>
