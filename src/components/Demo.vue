<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'
import { exampleSources } from '../docs/examples'
import ScenarioCodeExample from './ScenarioCodeExample.vue'
const isShow = ref(false)
const route = useRoute()
const { isEn } = useLocale()
const source = computed(() => exampleSources[route.path])
</script>
<template>
  <div class="at-component__container">
    <div class="at-component__sample"><slot name="demo" /></div>
    <div v-if="source" class="integration-code">
      <p>{{ isEn ? 'Integration example: provide your own public/photo.jpg or choose a local image. Uses Vue and the public package only.' : '接入示例：准备自己的 public/photo.jpg，或选择本地图片。仅依赖 Vue 和公开组件包。' }}</p>
      <ScenarioCodeExample :title="isEn ? 'Complete integration code' : '完整接入代码'" :code="source" :copy-label="isEn ? 'Copy code' : '复制代码'" :copied-label="isEn ? 'Copied' : '已复制'" />
    </div>
    <button class="code-toggle" type="button" :aria-expanded="isShow" @click="isShow = !isShow">{{ isShow ? (isEn ? 'Hide site demo source' : '收起站内演示源码') : (isEn ? 'View site demo source' : '查看站内演示源码') }}</button>
    <div v-if="isShow" class="at-component__code"><p class="source-note">{{ isEn ? 'This source uses documentation-only helpers. Use the complete integration example above in your project.' : '这部分源码包含文档站专用工具，接入业务请使用上方完整示例。' }}</p><slot name="sourceCode" /></div>
  </div>
</template>
<style scoped>
.integration-code { padding: 0 20px 20px; border-top: 1px solid var(--doc-line); }
.integration-code > p, .source-note { font-size: 12px; line-height: 1.8; color: var(--doc-muted); }
.source-note { padding: 12px 18px; }
</style>
