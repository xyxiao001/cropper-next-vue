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
        <button class="code-copy" type="button" @click="copyCode">
          {{ copied ? copiedLabel : copyLabel }}
        </button>
      </div>
      <pre><code>{{ code }}</code></pre>
    </details>
  </section>
</template>

<style scoped lang="scss">
.code-example {
  margin-top: 20px;
  border: 1px solid var(--doc-line);
  border-radius: 7px;
  background: #fff;
  overflow: hidden;
}

summary {
  padding: 16px 18px;
  color: var(--doc-ink);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid var(--doc-line);
  border-bottom: 1px solid #30343b;
  background: #24382f;
  color: #c9cdd4;
  font-size: 12px;
}

pre {
  max-height: 560px;
  margin: 0;
  padding: 18px;
  overflow: auto;
  background: var(--doc-code);
  color: var(--doc-line);
  font: 13px/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  tab-size: 2;
}

code {
  white-space: pre;
}
.code-copy { background: transparent; color: #e1ebd8; border: 1px solid #53654e; border-radius: 4px; padding: 5px 9px; font-size: 12px; }
</style>
