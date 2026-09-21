<script setup lang="ts">
import { docGroups, docPages } from '../docs/navigation'
import { useLocale } from '../composables/useLocale'
const { locale, isEn } = useLocale()
defineProps<{ open: boolean }>()
defineEmits<{ (event: 'close'): void }>()
</script>
<template>
  <nav id="docs-navigation" class="docs-sidebar" :class="{ 'is-open': open }" :aria-label="isEn ? 'Documentation navigation' : '文档导航'">
    <section v-for="(group, key) in docGroups" :key="key" class="docs-nav-group">
      <h2>{{ group[locale] }}</h2>
      <router-link v-for="page in docPages.filter(item => item.group === key && item.layout !== 'home')" :key="page.path" :to="page.path" @click="$emit('close')">{{ page.title[locale] }}</router-link>
    </section>
    <div class="sidebar-note">{{ isEn ? 'A little crop. A better picture.' : '从一张图片，到刚好的构图。' }}</div>
  </nav>
</template>
