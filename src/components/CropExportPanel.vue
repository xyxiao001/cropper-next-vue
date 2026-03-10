<script setup lang="ts">
import { computed, onBeforeUnmount, ref, unref, watch } from 'vue'
import { useLocale } from '../composables/useLocale'

type CropperLike = {
  getCropData?: () => Promise<string>
  getCropBlob?: () => Promise<Blob>
}

const props = defineProps<{
  cropper: unknown
  displayWidth: number
  displayHeight: number
}>()

const { isEn } = useLocale()

const labels = computed(() =>
  isEn.value
    ? {
        exportBase64: 'Export base64',
        exportBlob: 'Export Blob',
        reset: 'Reset result',
        displaySize: 'Display size',
        exportPixels: 'Export pixels',
        fileSize: 'File size',
        pixelRatio: 'Pixel ratio',
        ok: 'OK',
      }
    : {
        exportBase64: '导出 base64',
        exportBlob: '导出 Blob',
        reset: '清空结果',
        displaySize: '展示尺寸',
        exportPixels: '导出像素',
        fileSize: '文件大小',
        pixelRatio: '像素倍率',
        ok: '完成',
      },
)

const loadingBase64 = ref(false)
const loadingBlob = ref(false)
const resultUrl = ref('')
const resultInfo = ref<null | {
  width: number
  height: number
  sizeText: string
  pixelRatioText: string
}>(null)

const getCropper = (): CropperLike | null => {
  const value = unref(props.cropper as any)
  return value && typeof value === 'object' ? (value as CropperLike) : null
}

const formatBytes = (size: number) => {
  if (!size) return '0 B'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

const readImageInfo = (url: string, size: number) => {
  return new Promise<null | { width: number; height: number; sizeText: string; pixelRatioText: string }>((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeText: formatBytes(size),
        pixelRatioText: props.displayWidth ? `${(img.naturalWidth / props.displayWidth).toFixed(2)}x` : '-',
      })
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

const resetResult = () => {
  if (resultUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(resultUrl.value)
  }
  resultUrl.value = ''
  resultInfo.value = null
}

const exportBase64 = () => {
  const cropper = getCropper()
  if (!cropper?.getCropData) return
  loadingBase64.value = true
  cropper
    .getCropData()
    .then((res) => {
      resultUrl.value = res
      const byteSize = Math.round((res.length * 3) / 4)
      return readImageInfo(res, byteSize)
    })
    .then((info) => {
      resultInfo.value = info
    })
    .finally(() => {
      loadingBase64.value = false
    })
}

const exportBlob = () => {
  const cropper = getCropper()
  if (!cropper?.getCropBlob) return
  loadingBlob.value = true
  cropper
    .getCropBlob()
    .then((blob) => {
      if (resultUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrl.value)
      }
      const url = URL.createObjectURL(blob)
      resultUrl.value = url
      return readImageInfo(url, blob.size)
    })
    .then((info) => {
      resultInfo.value = info
    })
    .finally(() => {
      loadingBlob.value = false
    })
}

watch(
  () => [props.displayWidth, props.displayHeight],
  () => {
    if (!resultUrl.value || !resultInfo.value) return
    if (!props.displayWidth) return
    resultInfo.value = {
      ...resultInfo.value,
      pixelRatioText: `${(resultInfo.value.width / props.displayWidth).toFixed(2)}x`,
    }
  },
)

onBeforeUnmount(() => {
  resetResult()
})
</script>

<template>
  <section class="crop-export-panel">
    <section class="actions">
      <el-button type="primary" :loading="loadingBase64" @click="exportBase64">
        {{ labels.exportBase64 }}
      </el-button>
      <el-button :loading="loadingBlob" @click="exportBlob">{{ labels.exportBlob }}</el-button>
      <el-button @click="resetResult">{{ labels.reset }}</el-button>
    </section>

    <section v-if="resultUrl" class="result">
      <img
        class="result-image"
        :src="resultUrl"
        :style="{ width: `${displayWidth}px`, height: `${displayHeight}px` }"
        alt="crop result"
      />
      <section v-if="resultInfo" class="result-meta">
        <p>{{ labels.displaySize }}: {{ displayWidth }} x {{ displayHeight }}</p>
        <p>{{ labels.exportPixels }}: {{ resultInfo.width }} x {{ resultInfo.height }}</p>
        <p>{{ labels.fileSize }}: {{ resultInfo.sizeText }}</p>
        <p>{{ labels.pixelRatio }}: {{ resultInfo.pixelRatioText }}</p>
      </section>
    </section>
  </section>
</template>

<style scoped lang="scss">
.crop-export-panel {
  margin-top: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.result {
  margin-top: 16px;
}

.result-image {
  display: block;
  object-fit: contain;
  border: 1px solid #e5e6eb;
  background: #fff;
}

.result-meta {
  margin-top: 8px;
  color: #666;
  line-height: 1.8;
}

p {
  margin: 0;
}
</style>
