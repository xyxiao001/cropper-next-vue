<LangBlock lang="zh">

# 导出能力

这个页面专门演示导出相关 API。建议你重点观察：

1. `outputType`
2. `outputSize`
3. `full`
4. `getCropData()` 和 `getCropBlob()`

### base64 / Blob / 高分屏导出

</LangBlock>

<LangBlock lang="en">

# Export

This page focuses on the export APIs. Pay attention to:

1. `outputType`
2. `outputSize`
3. `full`
4. `getCropData()` and `getCropBlob()`

### base64 / Blob / high-DPI export

</LangBlock>

:::demo
```html
<vue-cropper
  ref="cropper"
  :img="img"
  :output-type="outputType"
  :output-size="outputSize"
  :full="full"
  :crop-layout="{ width: 220, height: 220 }"
></vue-cropper>

<demo-image-switch v-model="img" />

<section class="panel">
  <p class="hint">{{ labels.hint }}</p>
  <label>{{ labels.outputType }}</label>
  <el-select v-model="outputType">
    <el-option
      v-for="item in formatOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <p class="format-tip">{{ labels.formatTip }}</p>

  <label>{{ labels.outputQuality }} {{ outputSize }}</label>
  <el-slider v-model="outputSize" :min="0.1" :max="1" :step="0.1" />

  <el-switch v-model="full" :active-text="labels.highDpi" />
</section>

<crop-export-panel :cropper="cropper" :display-width="cropSize.width" :display-height="cropSize.height" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const cropSize = { width: 220, height: 220 }
  const { isEn } = useLocale()
  const formatOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'jpg', value: 'jpg' },
    { label: 'webp', value: 'webp' },
  ])
  const labels = computed(() => isEn.value ? {
    hint: 'Drag or zoom first, then compare the two export buttons below.',
    outputType: 'Output type',
    outputQuality: 'Output quality',
    formatTip: 'Available export formats in this demo: png, jpeg, jpg, webp. Actual browser support still depends on Canvas support.',
    highDpi: 'High-DPI export',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、jpg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
  })
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const cropSize = { width: 220, height: 220 }
  const { isEn } = useLocale()
  const formatOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'jpg', value: 'jpg' },
    { label: 'webp', value: 'webp' },
  ])
  const labels = computed(() => isEn.value ? {
    hint: 'Drag or zoom first, then compare the two export buttons below.',
    outputType: 'Output type',
    outputQuality: 'Output quality',
    formatTip: 'Available export formats in this demo: png, jpeg, jpg, webp. Actual browser support still depends on Canvas support.',
    highDpi: 'High-DPI export',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、jpg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
  })
</script>

<style lang="scss" scoped>
  .panel {
    margin-top: 20px;
    display: grid;
    gap: 12px;
  }

  .format-tip {
    color: #86909c;
    font-size: 13px;
    line-height: 1.6;
  }

  .hint {
    color: #666;
    line-height: 1.7;
  }

  p {
    margin: 0;
  }
</style>
