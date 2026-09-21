<script setup lang="ts">
import LocaleSwitch from './LocaleSwitch.vue'
import { useLocale } from '../composables/useLocale'
const { isEn } = useLocale()
defineProps<{ hasSidebar: boolean; menuOpen: boolean }>()
defineEmits<{ (event: 'toggle-menu'): void }>()
</script>
<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="brand" to="/" aria-label="cropper-next-vue"><span class="brand-mark" aria-hidden="true"></span><span>cropper-next-vue</span></router-link>
      <nav class="site-nav" :aria-label="isEn ? 'Main navigation' : '主导航'">
        <router-link to="/guide">{{ isEn ? 'Documentation' : '文档' }}</router-link>
        <router-link to="/scenario-avatar">{{ isEn ? 'Use cases' : '场景实践' }}</router-link>
        <router-link to="/demo-all">{{ isEn ? 'Playground' : '在线体验' }} <span aria-hidden="true">↗</span></router-link>
      </nav>
      <div class="site-header__end"><LocaleSwitch /><a class="github-link" href="https://github.com/xyxiao001/cropper-next-vue" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <button v-if="hasSidebar" class="mobile-menu" type="button" :aria-expanded="menuOpen" aria-controls="docs-navigation" @click="$emit('toggle-menu')">{{ menuOpen ? (isEn ? 'Close' : '收起目录') : (isEn ? 'Contents' : '文档目录') }} <span aria-hidden="true">☰</span></button>
    </div>
  </header>
</template>
