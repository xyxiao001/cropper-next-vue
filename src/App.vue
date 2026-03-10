<template>
  <section
    id="app"
    class="wrapper"
    :class="{
      'is-mobile': isMobile,
      'sidebar-open': isMobile && sidebarOpen,
    }"
  >
    <header v-if="isMobile" class="top-bar">
      <button
        class="top-bar__menu"
        type="button"
        aria-label="Open menu"
        @click="sidebarOpen = true"
      >
        ≡
      </button>
      <span class="top-bar__title">cropper-next-vue</span>
    </header>

    <SideBar :mobile="isMobile" :open="sidebarOpen" @close="sidebarOpen = false" />

    <div v-if="isMobile && sidebarOpen" class="backdrop" @click="sidebarOpen = false" />

    <main class="container">
      <router-view></router-view>
    </main>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from './components/SideBar.vue'

const isMobile = ref(false)
const sidebarOpen = ref(false)
const route = useRoute()

let mql: MediaQueryList | null = null
const onMediaChange = () => {
  isMobile.value = !!mql?.matches
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 767px)')
  onMediaChange()

  if (mql.addEventListener) {
    mql.addEventListener('change', onMediaChange)
  } else {
    mql.addListener(onMediaChange)
  }
})

onBeforeUnmount(() => {
  if (!mql) return
  if (mql.removeEventListener) {
    mql.removeEventListener('change', onMediaChange)
  } else {
    mql.removeListener(onMediaChange)
  }
})

watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) sidebarOpen.value = false
  }
)
</script>

<style lang="scss">
  @use "./assets/color.scss" as *;
  @use "./assets/index.scss";
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .wrapper {
    display: flex;
    height: 100vh;
    height: 100dvh;
    background-color: $G30;
    overflow: hidden;
  }

  .page-header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: $G20;
    transition: all .3s;
    z-index: 100;
    margin-bottom: 25px;
  }

  .collapse {
    background-color: #fff;
    box-shadow: 0 10px 60px 0 rgba(29,29,31,0.07);
    opacity: 0.98;
  }

  .container {
    display: flex;
    width: 100%;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 24px;
    background-color: $G20;
    min-height: 100vh;
  }

  a {
    color: $B50;
  }

  .star {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .container {
    flex: 1;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .top-bar {
    display: none;
  }

  .backdrop {
    display: none;
  }

  .wrapper.is-mobile {
    flex-direction: column;
  }

  .wrapper.is-mobile .top-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 52px;
    padding: 0 12px;
    padding-top: env(safe-area-inset-top);
    background-color: $G20;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  .wrapper.is-mobile .top-bar__menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    font-size: 22px;
    color: $G100;
  }

  .wrapper.is-mobile .top-bar__title {
    font-size: 16px;
    font-weight: 600;
    color: $G100;
  }

  .wrapper.is-mobile .container {
    border-radius: 0;
    padding: 12px;
    margin-bottom: 0;
    min-height: 0;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .wrapper.is-mobile.sidebar-open .container {
    overflow: hidden;
  }

  .wrapper.is-mobile .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 90;
  }
</style>
