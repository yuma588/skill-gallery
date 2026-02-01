<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 72px; /* Header height */
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>
