<template>
  <div class="skeleton-list">
    <SkeletonCard v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
import SkeletonCard from './SkeletonCard.vue'

defineProps<{
  count?: number
}>()
</script>

<style lang="scss" scoped>
.skeleton-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
</style>
