<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'
export type OutlineEntry = { id: string; text: string; level: number }
defineProps<{ entries: OutlineEntry[] }>()
const route = useRoute()
const expanded = ref(false)
const { isEn } = useLocale()
</script>
<template>
  <nav v-if="entries.length" class="page-outline" :aria-label="isEn ? 'On this page' : '本页内容'">
    <strong class="outline-title">{{ isEn ? 'ON THIS PAGE' : '本页内容' }}</strong>
    <button class="outline-toggle" type="button" :aria-expanded="expanded" aria-controls="doc-outline-links" @click="expanded = !expanded">{{ isEn ? 'On this page' : '本页内容' }} <span>{{ expanded ? '−' : '＋' }}</span></button>
    <div id="doc-outline-links" class="outline-links" :class="{ 'is-expanded': expanded }">
    <router-link v-for="entry in entries" :key="entry.id" :to="{ path: route.path, hash: `#${entry.id}` }" :class="{ nested: entry.level === 3, current: route.hash === `#${entry.id}` }">{{ entry.text }}</router-link>
    </div>
  </nav>
</template>
