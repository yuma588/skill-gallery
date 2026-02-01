<template>
  <div class="category-filter">
    <div class="category-scroll">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: modelValue === category.id }"
        @click="handleSelect(category.id)"
      >
        <div class="category-icon">
          <el-icon :size="24">
            <component :is="getIconComponent(category.icon)" />
          </el-icon>
        </div>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types'
import {
  Coffee,
  Bowl,
  Pizza,
  Hamburger,
  Dessert,
  Watermelon,
  WineBottle,
  Chicken
} from '@element-plus/icons-vue'

const props = defineProps<{
  categories: Category[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const iconMap: Record<string, any> = {
  coffee: Coffee,
  bowl: Bowl,
  pizza: Pizza,
  hamburger: Hamburger,
  dessert: Dessert,
  watermelon: Watermelon,
  wine: WineBottle,
  chicken: Chicken
}

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Bowl
}

const handleSelect = (categoryId: string) => {
  emit('update:modelValue', categoryId)
}
</script>

<style lang="scss" scoped>
.category-filter {
  background: var(--white);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
  position: sticky;
  top: 72px;
  z-index: var(--z-sticky);
}

.category-scroll {
  display: flex;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
  background: var(--light-gray);
  border: 2px solid transparent;

  &:hover {
    background: #fff5f0;
    border-color: var(--primary-orange);
    transform: translateY(-2px);
  }

  &.active {
    background: var(--overlay-gradient);
    border-color: var(--primary-orange);
    color: var(--white);

    .category-icon {
      color: var(--white);
    }

    .category-name {
      color: var(--white);
      font-weight: 600;
    }
  }
}

.category-icon {
  color: var(--primary-orange);
  transition: color var(--transition-fast);
}

.category-name {
  font-size: 0.85rem;
  color: var(--dark-gray);
  transition: color var(--transition-fast);
}
</style>
