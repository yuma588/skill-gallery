<template>
  <div class="loading-spinner" :class="{ 'overlay': overlay }">
    <div class="spinner-container">
      <div class="food-icon">
        <el-icon :size="48" class="spin">
          <Setting />
        </el-icon>
      </div>
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'

defineProps<{
  overlay?: boolean
  text?: string
}>()
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);

  &.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: var(--z-modal-backdrop);
    backdrop-filter: blur(4px);
  }
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.food-icon {
  color: var(--primary-orange);
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--secondary-yellow);
    border-radius: 50%;
    opacity: 0.3;
  }

  &::before {
    animation: ripple 1.5s ease-out infinite;
  }

  &::after {
    animation: ripple 1.5s ease-out infinite 0.5s;
  }
}

.loading-text {
  color: var(--dark-gray);
  font-weight: 500;
  font-size: 1rem;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
