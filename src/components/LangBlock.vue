<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const { locale } = useLocale()
const visible = computed(() => locale.value === props.lang)
</script>

<template>
  <template v-if="visible">
    <slot />
  </template>
</template>
