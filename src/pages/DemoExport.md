<LangBlock lang="zh">

# 导出能力

这个页面专门演示导出相关 API。建议你重点观察：

1. 用 `outputType` 选择 PNG、JPEG 或 WebP。
2. 用 `outputSize` 调整 JPEG / WebP 质量；PNG 不使用这个质量参数。
3. `full` 按设备像素比放大导出，`original` 抵消图片当前缩放，`maxSideLength` 限制最终最长边。
4. `getCropData()` 返回 base64，`getCropBlob()` 返回适合上传的 Blob；两者裁剪内容相同。

<h3 id="section-1">base64 / Blob / 高分屏导出</h3>

</LangBlock>

<LangBlock lang="en">

# Export

This page focuses on the export APIs. Pay attention to:

1. Choose PNG, JPEG or WebP with `outputType`.
2. Adjust JPEG / WebP quality with `outputSize`; PNG does not use this quality parameter.
3. `full` applies the device pixel ratio, `original` undoes the current image scale, and `maxSideLength` caps the final longest edge.
4. `getCropData()` returns base64; `getCropBlob()` returns an upload-ready Blob. Both contain the same crop.

<h3 id="section-1">base64 / Blob / high-DPI export</h3>

</LangBlock>

:::demo
```html
<vue-cropper
  ref="cropper"
  @change="cropSize = $event.crop"
  :img="img"
  :output-type="outputType"
  :output-size="outputSize"
  :full="full"
  :original="original"
  :max-side-length="maxSideLength"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
></vue-cropper>

<demo-image-switch v-model="img" />

<section class="panel">
  <p class="hint">{{ labels.hint }}</p>
  <label>{{ labels.outputType }}</label>
  <el-select v-model="outputType" :aria-label="labels.outputType">
    <el-option
      v-for="item in formatOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <p class="format-tip">{{ labels.formatTip }}</p>

  <label>{{ labels.outputQuality }} {{ outputSize }}</label>
  <el-slider :aria-label="labels.outputQuality" v-model="outputSize" :min="0.1" :max="1" :step="0.1" />

  <el-switch v-model="full" :aria-label="labels.highDpi" :active-text="labels.highDpi" />
  <el-switch v-model="original" :aria-label="labels.original" :active-text="labels.original" />

  <label>{{ labels.maxSideLength }}</label>
  <el-input-number :aria-label="labels.maxSideLength" v-model="maxSideLength" :min="0" :max="12000" :step="100" />
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
  const original = ref(false)
  const maxSideLength = ref(3000)
  const cropSize = ref({ width: 320, height: 320 })
  const { isEn } = useLocale()
  const formatOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'webp', value: 'webp' },
  ])
  const labels = computed(() => isEn.value ? {
    hint: 'Drag or zoom first, then compare the two export buttons below.',
    outputType: 'Output type',
    outputQuality: 'Output quality',
    formatTip: 'Available export formats in this demo: png, jpeg, webp. Actual browser support still depends on Canvas support.',
    highDpi: 'High-DPI export',
    original: 'Undo current zoom for export',
    maxSideLength: 'Max side length',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
    original: '按原图像素导出（抵消当前缩放）',
    maxSideLength: '导出最长边',
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
  const original = ref(false)
  const maxSideLength = ref(3000)
  const cropSize = ref({ width: 320, height: 320 })
  const { isEn } = useLocale()
  const formatOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'webp', value: 'webp' },
  ])
  const labels = computed(() => isEn.value ? {
    hint: 'Drag or zoom first, then compare the two export buttons below.',
    outputType: 'Output type',
    outputQuality: 'Output quality',
    formatTip: 'Available export formats in this demo: png, jpeg, webp. Actual browser support still depends on Canvas support.',
    highDpi: 'High-DPI export',
    original: 'Undo current zoom for export',
    maxSideLength: 'Max side length',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
    original: '按原图像素导出（抵消当前缩放）',
    maxSideLength: '导出最长边',
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
