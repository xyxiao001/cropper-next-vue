<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { docPages, docGroups } from '../docs/navigation'
import { useLocale } from '../composables/useLocale'
import PageOutline, { type OutlineEntry } from './PageOutline.vue'
const route = useRoute()
const { locale, isEn } = useLocale()
const article = ref<HTMLElement>()
const entries = ref<OutlineEntry[]>([])
const current = computed(() => docPages.find(page => page.path === route.path)!)
const previous = computed(() => docPages[docPages.indexOf(current.value) - 1])
const next = computed(() => docPages[docPages.indexOf(current.value) + 1])
const refreshOutline = async () => {
  await nextTick()
  entries.value = Array.from(article.value!.querySelectorAll<HTMLElement>('h2[id], h3[id]')).map(heading => ({ id: heading.id, text: heading.textContent!, level: Number(heading.tagName.slice(1)) }))
  if (route.hash) document.getElementById(decodeURIComponent(route.hash.slice(1)))?.scrollIntoView({ block: 'start' })
}
onMounted(refreshOutline)
watch(locale, refreshOutline)
watch(() => route.hash, refreshOutline)
</script>
<template>
  <div class="doc-layout" :class="{ 'doc-layout--wide': current.layout === 'workspace' }">
    <div ref="article" class="doc-article">
      <div class="doc-breadcrumb">{{ docGroups[current.group][locale] }} <span>/</span> {{ current.title[locale] }}</div>
      <p class="doc-summary">{{ current.summary[locale] }}</p>
      <slot />
      <section class="related-topics">
        <h2>{{ isEn ? 'Keep exploring' : '继续探索' }}</h2>
        <router-link v-for="path in current.related" :key="path" :to="path">{{ docPages.find(page => page.path === path)!.title[locale] }} <span>↗</span></router-link>
      </section>
      <nav class="doc-pagination" :aria-label="isEn ? 'Reading order' : '阅读顺序'">
        <router-link v-if="previous && previous.path !== '/'" :to="previous.path"><small>{{ isEn ? 'PREVIOUS' : '上一篇' }}</small>← {{ previous.title[locale] }}</router-link><span v-else></span>
        <router-link v-if="next" :to="next.path"><small>{{ isEn ? 'NEXT' : '下一篇' }}</small>{{ next.title[locale] }} →</router-link>
      </nav>
    </div>
    <PageOutline v-if="current.layout !== 'workspace'" :entries="entries" />
  </div>
</template>
