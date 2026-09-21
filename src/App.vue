<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from './composables/useLocale'
import SiteHeader from './components/SiteHeader.vue'
import SideBar from './components/SideBar.vue'
import DocLayout from './components/DocLayout.vue'
const route = useRoute()
const { isEn } = useLocale()
const menuOpen = ref(false)
const home = computed(() => route.path === '/')
const workspace = computed(() => route.path === '/demo-all')
watch(() => route.path, () => { menuOpen.value = false; document.querySelector('.site-main')?.scrollTo(0, 0) })
</script>
<template>
  <div class="docs-site">
    <SiteHeader :has-sidebar="!home" :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" />
    <div class="site-body" :class="{ 'site-body--home': home, 'site-body--workspace': workspace }">
      <SideBar v-if="!home" :open="menuOpen" @close="menuOpen = false" />
      <button v-if="menuOpen" class="menu-backdrop" :aria-label="isEn ? 'Close navigation' : '关闭导航'" @click="menuOpen = false"></button>
      <main class="site-main">
        <router-view v-slot="{ Component }">
          <component :is="Component" v-if="home" />
          <DocLayout v-else :key="route.path"><component :is="Component" /></DocLayout>
        </router-view>
      </main>
    </div>
  </div>
</template>
<style lang="scss">
@use './assets/tokens.scss';
@use './assets/index.scss';
</style>
