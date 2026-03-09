<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  zh: string
  en: string
}>()

const { isEn } = useLocale()

const text = computed(() => (isEn.value ? props.en : props.zh))
</script>

<template>{{ text }}</template>
