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

<section class="actions">
  <el-button type="primary" :loading="loadingBase64" @click="exportBase64">{{ labels.exportBase64 }}</el-button>
  <el-button :loading="loadingBlob" @click="exportBlob">{{ labels.exportBlob }}</el-button>
  <el-button @click="toggleFull">{{ labels.toggleFull }}</el-button>
  <el-button @click="resetResult">{{ labels.resetResult }}</el-button>
</section>

<section class="result" v-if="resultUrl || blobInfo">
  <p v-if="blobInfo">{{ blobInfo }}</p>
  <p>{{ labels.currentType }}: {{ outputType }} / {{ labels.quality }}: {{ outputSize }} / {{ labels.highDpi }}: {{ full ? labels.on : labels.off }}</p>
  <img
    v-if="resultUrl"
    :src="resultUrl"
    :style="{ width: `${cropSize.width}px`, height: `${cropSize.height}px` }"
    class="result-image"
    alt="crop result"
  />
  <section v-if="resultInfo" class="result-meta">
    <p>{{ labels.displaySize }}: {{ cropSize.width }} x {{ cropSize.height }}</p>
    <p>{{ labels.exportPixels }}: {{ resultInfo.width }} x {{ resultInfo.height }}</p>
    <p>{{ labels.fileSize }}: {{ resultInfo.sizeText }}</p>
    <p>{{ labels.pixelRatio }}: {{ resultInfo.pixelRatioText }}</p>
  </section>
</section>
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('https://p6-addone.byteimg.com/tos-cn-i-hhc0kcolqq/e140e367ab964968a3e1a3ab73a469e9.jpeg~tplv-hhc0kcolqq-image-v7:1920:q50.image')
  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const cropSize = { width: 220, height: 220 }
  const loadingBase64 = ref(false)
  const loadingBlob = ref(false)
  const resultUrl = ref('')
  const blobInfo = ref('')
  const resultInfo = ref(null)
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
    exportBase64: 'Export base64',
    exportBlob: 'Export Blob',
    toggleFull: 'Toggle full',
    resetResult: 'Reset result',
    currentType: 'Current type',
    quality: 'quality',
    displaySize: 'Display size',
    exportPixels: 'Export pixels',
    fileSize: 'File size',
    pixelRatio: 'Pixel ratio',
    on: 'on',
    off: 'off',
    base64Done: 'Base64 export complete',
    blobSize: 'Blob size',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、jpg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
    exportBase64: '导出 base64',
    exportBlob: '导出 Blob',
    toggleFull: '切换 full',
    resetResult: '清空结果',
    currentType: '当前格式',
    quality: '质量',
    displaySize: '展示尺寸',
    exportPixels: '导出像素',
    fileSize: '文件大小',
    pixelRatio: '像素倍率',
    on: '开',
    off: '关',
    base64Done: 'base64 导出完成',
    blobSize: 'Blob 大小',
  })

  const formatBytes = (size) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const readImageInfo = (url, size = 0) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeText: formatBytes(size),
          pixelRatioText: `${(img.naturalWidth / cropSize.width).toFixed(2)}x`,
        })
      }
      img.onerror = () => {
        resolve(null)
      }
      img.src = url
    })
  }

  const exportBase64 = () => {
    loadingBase64.value = true
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
      blobInfo.value = labels.value.base64Done
      readImageInfo(res, Math.round((res.length * 3) / 4)).then(info => {
        resultInfo.value = info
      })
    }).finally(() => {
      loadingBase64.value = false
    })
  }

  const exportBlob = () => {
    loadingBlob.value = true
    cropper.value.getCropBlob().then((blob) => {
      if (resultUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl.value)
      }
      resultUrl.value = URL.createObjectURL(blob)
      blobInfo.value = `${labels.value.blobSize}: ${Math.round(blob.size / 1024)} KB`
      readImageInfo(resultUrl.value, blob.size).then(info => {
        resultInfo.value = info
      })
    }).finally(() => {
      loadingBlob.value = false
    })
  }

  const toggleFull = () => {
    full.value = !full.value
  }

  const resetResult = () => {
    if (resultUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(resultUrl.value)
    }
    resultUrl.value = ''
    blobInfo.value = ''
    resultInfo.value = null
  }
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('https://p6-addone.byteimg.com/tos-cn-i-hhc0kcolqq/e140e367ab964968a3e1a3ab73a469e9.jpeg~tplv-hhc0kcolqq-image-v7:1920:q50.image')
  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const cropSize = { width: 220, height: 220 }
  const loadingBase64 = ref(false)
  const loadingBlob = ref(false)
  const resultUrl = ref('')
  const blobInfo = ref('')
  const resultInfo = ref(null)
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
    exportBase64: 'Export base64',
    exportBlob: 'Export Blob',
    toggleFull: 'Toggle full',
    resetResult: 'Reset result',
    currentType: 'Current type',
    quality: 'quality',
    displaySize: 'Display size',
    exportPixels: 'Export pixels',
    fileSize: 'File size',
    pixelRatio: 'Pixel ratio',
    on: 'on',
    off: 'off',
    base64Done: 'Base64 export complete',
    blobSize: 'Blob size',
  } : {
    hint: '先拖拽或缩放图片，再分别点击下面两个导出按钮观察差异。',
    outputType: '输出格式',
    outputQuality: '输出质量',
    formatTip: '当前 demo 可选导出格式：png、jpeg、jpg、webp。实际可用格式仍取决于浏览器对 Canvas 的支持。',
    highDpi: '高分屏导出',
    exportBase64: '导出 base64',
    exportBlob: '导出 Blob',
    toggleFull: '切换 full',
    resetResult: '清空结果',
    currentType: '当前格式',
    quality: '质量',
    displaySize: '展示尺寸',
    exportPixels: '导出像素',
    fileSize: '文件大小',
    pixelRatio: '像素倍率',
    on: '开',
    off: '关',
    base64Done: 'base64 导出完成',
    blobSize: 'Blob 大小',
  })

  const formatBytes = (size) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const readImageInfo = (url, size = 0) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeText: formatBytes(size),
          pixelRatioText: `${(img.naturalWidth / cropSize.width).toFixed(2)}x`,
        })
      }
      img.onerror = () => {
        resolve(null)
      }
      img.src = url
    })
  }

  const exportBase64 = () => {
    loadingBase64.value = true
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
      blobInfo.value = labels.value.base64Done
      readImageInfo(res, Math.round((res.length * 3) / 4)).then(info => {
        resultInfo.value = info
      })
    }).finally(() => {
      loadingBase64.value = false
    })
  }

  const exportBlob = () => {
    loadingBlob.value = true
    cropper.value.getCropBlob().then((blob) => {
      if (resultUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl.value)
      }
      resultUrl.value = URL.createObjectURL(blob)
      blobInfo.value = `${labels.value.blobSize}: ${Math.round(blob.size / 1024)} KB`
      readImageInfo(resultUrl.value, blob.size).then(info => {
        resultInfo.value = info
      })
    }).finally(() => {
      loadingBlob.value = false
    })
  }

  const toggleFull = () => {
    full.value = !full.value
  }

  const resetResult = () => {
    if (resultUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(resultUrl.value)
    }
    resultUrl.value = ''
    blobInfo.value = ''
    resultInfo.value = null
  }
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

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .result {
    margin-top: 20px;
  }

  .result-image {
    border: 1px solid #e5e6eb;
    object-fit: contain;
    background: #fff;
    margin-top: 12px;
  }

  .hint {
    color: #666;
    line-height: 1.7;
  }

  .result-meta {
    margin-top: 12px;
    display: grid;
    gap: 6px;
    color: #4e5969;
    font-size: 13px;
  }

  p {
    margin: 0;
  }
</style>
