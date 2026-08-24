<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  code: string
  copyLabel: string
  copiedLabel: string
}>()

const copied = ref(false)

const copyCode = async () => {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <section class="code-example">
    <details>
      <summary>{{ title }}</summary>
      <div class="code-toolbar">
        <span>Vue SFC</span>
        <el-button size="small" @click="copyCode">
          {{ copied ? copiedLabel : copyLabel }}
        </el-button>
      </div>
      <pre><code>{{ code }}</code></pre>
    </details>
  </section>
</template>

<style scoped lang="scss">
.code-example {
  margin-top: 20px;
  border: 1px solid #e5e6eb;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}

summary {
  padding: 16px 18px;
  color: #1d2129;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid #e5e6eb;
  border-bottom: 1px solid #30343b;
  background: #25282e;
  color: #c9cdd4;
  font-size: 12px;
}

pre {
  max-height: 560px;
  margin: 0;
  padding: 18px;
  overflow: auto;
  background: #1f2329;
  color: #e5e6eb;
  font: 13px/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  tab-size: 2;
}

code {
  white-space: pre;
}
</style>
