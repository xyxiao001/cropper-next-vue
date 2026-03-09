<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { locale, setLocale } = useLocale()
</script>

<template>
  <section class="locale-switch">
    <button
      class="locale-button"
      :class="{ active: locale === 'zh' }"
      @click="setLocale('zh')"
      type="button"
    >
      中文
    </button>
    <button
      class="locale-button"
      :class="{ active: locale === 'en' }"
      @click="setLocale('en')"
      type="button"
    >
      EN
    </button>
  </section>
</template>

<style scoped lang="scss">
.locale-switch {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: #f2f3f5;
  gap: 4px;
}

.locale-button {
  border: 0;
  background: transparent;
  border-radius: 999px;
  padding: 6px 12px;
  color: #4e5969;
  cursor: pointer;
}

.locale-button.active {
  background: #1d2129;
  color: white;
}
</style>
