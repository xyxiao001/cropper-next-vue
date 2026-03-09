<LangBlock lang="zh">

# 实时预览

这个页面展示当前版本最适合做业务联动的能力：

- `@real-time`
- `@realTime`
- `rotateLeft / rotateRight / rotateClear`

### 旋转方法和实时预览

</LangBlock>

<LangBlock lang="en">

# Realtime Preview

This page demonstrates the APIs that work best for live business integration:

- `@real-time`
- `@realTime`
- `rotateLeft / rotateRight / rotateClear`

### Rotation methods with realtime preview

</LangBlock>

:::demo
```html
<section class="demo-grid">
  <section>
    <vue-cropper
      ref="cropper"
      :img="img"
      :default-rotate="rotate"
      :crop-layout="{ width: 220, height: 220 }"
      @real-time="handlePreview"
    ></vue-cropper>

    <section class="actions">
      <el-button @click="rotateLeft">{{ labels.rotateLeft }}</el-button>
      <el-button @click="rotateRight">{{ labels.rotateRight }}</el-button>
      <el-button @click="rotateClear">{{ labels.rotateClear }}</el-button>
      <el-button type="primary" @click="exportCurrent">{{ labels.exportCurrent }}</el-button>
    </section>
  </section>

  <section class="preview">
    <p>{{ labels.currentRotation }}：{{ rotate }}°</p>
    <p>{{ labels.previewSize }}：{{ preview.w }} x {{ preview.h }}</p>
    <p>{{ labels.previewHint }}</p>
    <section class="preview-box" v-html="preview.html"></section>
    <p v-if="previewImage">{{ labels.realtimeImage }}</p>
    <img
      v-if="previewImage"
      class="result-image"
      :src="previewImage"
      :style="{ width: `${preview.w}px`, height: `${preview.h}px` }"
      alt="preview result"
    />
    <section v-if="previewInfo" class="result-meta">
      <p>{{ labels.displaySize }}：{{ preview.w }} x {{ preview.h }}</p>
      <p>{{ labels.exportPixels }}：{{ previewInfo.width }} x {{ previewInfo.height }}</p>
      <p>{{ labels.fileSize }}：{{ previewInfo.sizeText }}</p>
      <p>{{ labels.pixelRatio }}：{{ previewInfo.pixelRatioText }}</p>
    </section>
    <p v-if="resultUrl">{{ labels.manualResult }}</p>
    <img
      v-if="resultUrl"
      class="result-image"
      :src="resultUrl"
      :style="{ width: `${preview.w}px`, height: `${preview.h}px` }"
      alt="result"
    />
    <section v-if="resultInfo" class="result-meta">
      <p>{{ labels.displaySize }}：{{ preview.w }} x {{ preview.h }}</p>
      <p>{{ labels.exportPixels }}：{{ resultInfo.width }} x {{ resultInfo.height }}</p>
      <p>{{ labels.fileSize }}：{{ resultInfo.sizeText }}</p>
      <p>{{ labels.pixelRatio }}：{{ resultInfo.pixelRatioText }}</p>
    </section>
  </section>
</section>
```

```js
<script setup>
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg')
  const { isEn } = useLocale()
  const rotate = ref(0)
  const preview = reactive({
    w: 0,
    h: 0,
    html: ''
  })
  const previewImage = ref('')
  const previewInfo = ref(null)
  const resultUrl = ref('')
  const resultInfo = ref(null)
  let previewTimer = null
  const labels = computed(() => isEn.value ? {
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
    exportCurrent: 'Export current crop',
    currentRotation: 'Current rotation',
    previewSize: 'Preview size',
    previewHint: 'The block above is the lightweight real-time preview. The image below is the throttled real crop result.',
    realtimeImage: 'Realtime crop preview',
    manualResult: 'Manual export result',
    displaySize: 'Display size',
    exportPixels: 'Export pixels',
    fileSize: 'File size',
    pixelRatio: 'Pixel ratio',
  } : {
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    exportCurrent: '导出当前截图',
    currentRotation: '当前角度',
    previewSize: '预览尺寸',
    previewHint: '上面是 real-time 返回的轻量预览，下面是节流后的实际截图结果。',
    realtimeImage: '实时截图预览',
    manualResult: '手动导出结果',
    displaySize: '展示尺寸',
    exportPixels: '导出像素',
    fileSize: '文件大小',
    pixelRatio: '像素倍率',
  })

  const formatBytes = (size) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const readImageInfo = (url, displayWidth, size = 0) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeText: formatBytes(size),
          pixelRatioText: displayWidth ? `${(img.naturalWidth / displayWidth).toFixed(2)}x` : '-',
        })
      }
      img.onerror = () => resolve(null)
      img.src = url
    })
  }

  const handlePreview = (payload) => {
    preview.w = payload.w
    preview.h = payload.h
    preview.html = payload.html
    schedulePreviewImage()
  }

  const schedulePreviewImage = () => {
    if (previewTimer) {
      clearTimeout(previewTimer)
    }
    previewTimer = setTimeout(() => {
      cropper.value.getCropData().then((res) => {
        previewImage.value = res
        readImageInfo(res, preview.w, Math.round((res.length * 3) / 4)).then(info => {
          previewInfo.value = info
        })
      })
    }, 120)
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }

  const exportCurrent = () => {
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
      readImageInfo(res, preview.w, Math.round((res.length * 3) / 4)).then(info => {
        resultInfo.value = info
      })
    })
  }

  onBeforeUnmount(() => {
    if (previewTimer) {
      clearTimeout(previewTimer)
    }
  })
</script>
```
:::

<script setup>
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg')
  const { isEn } = useLocale()
  const rotate = ref(0)
  const preview = reactive({
    w: 0,
    h: 0,
    html: ''
  })
  const previewImage = ref('')
  const previewInfo = ref(null)
  const resultUrl = ref('')
  const resultInfo = ref(null)
  let previewTimer = null
  const labels = computed(() => isEn.value ? {
    rotateLeft: 'Rotate left 90deg',
    rotateRight: 'Rotate right 90deg',
    rotateClear: 'Clear rotation',
    exportCurrent: 'Export current crop',
    currentRotation: 'Current rotation',
    previewSize: 'Preview size',
    previewHint: 'The block above is the lightweight real-time preview. The image below is the throttled real crop result.',
    realtimeImage: 'Realtime crop preview',
    manualResult: 'Manual export result',
    displaySize: 'Display size',
    exportPixels: 'Export pixels',
    fileSize: 'File size',
    pixelRatio: 'Pixel ratio',
  } : {
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    exportCurrent: '导出当前截图',
    currentRotation: '当前角度',
    previewSize: '预览尺寸',
    previewHint: '上面是 real-time 返回的轻量预览，下面是节流后的实际截图结果。',
    realtimeImage: '实时截图预览',
    manualResult: '手动导出结果',
    displaySize: '展示尺寸',
    exportPixels: '导出像素',
    fileSize: '文件大小',
    pixelRatio: '像素倍率',
  })

  const formatBytes = (size) => {
    if (!size) return '0 B'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const readImageInfo = (url, displayWidth, size = 0) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeText: formatBytes(size),
          pixelRatioText: displayWidth ? `${(img.naturalWidth / displayWidth).toFixed(2)}x` : '-',
        })
      }
      img.onerror = () => resolve(null)
      img.src = url
    })
  }

  const handlePreview = (payload) => {
    preview.w = payload.w
    preview.h = payload.h
    preview.html = payload.html
    schedulePreviewImage()
  }

  const schedulePreviewImage = () => {
    if (previewTimer) {
      clearTimeout(previewTimer)
    }
    previewTimer = window.setTimeout(() => {
      cropper.value.getCropData().then((res) => {
        previewImage.value = res
        readImageInfo(res, preview.w, Math.round((res.length * 3) / 4)).then(info => {
          previewInfo.value = info
        })
      })
    }, 120)
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }

  const exportCurrent = () => {
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
      readImageInfo(res, preview.w, Math.round((res.length * 3) / 4)).then(info => {
        resultInfo.value = info
      })
    })
  }

  onBeforeUnmount(() => {
    if (previewTimer) {
      clearTimeout(previewTimer)
      previewTimer = null
    }
  })
</script>

<style lang="scss" scoped>
  .demo-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: start;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .preview {
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 12px;
    background: #fafafa;
  }

  .preview-box {
    margin-top: 12px;
  }

  .result-image {
    display: block;
    margin-top: 16px;
    border: 1px solid #e5e6eb;
    object-fit: contain;
    background: #fff;
  }

  .result-meta {
    margin-top: 10px;
    display: grid;
    gap: 6px;
    color: #4e5969;
    font-size: 13px;
  }

  p {
    margin: 0 0 8px;
  }
</style>
