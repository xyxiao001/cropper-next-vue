<script setup lang="ts">
import codeExample from '../examples/ProductCrop.vue?raw'
import { computed, onBeforeUnmount, ref } from 'vue'
import { loadFile } from '../../lib/common'
import ScenarioCodeExample from '../components/ScenarioCodeExample.vue'
import { useLocale } from '../composables/useLocale'
import { imageList } from '../utils/image'

type CropperInstance = { getCropBlob: () => Promise<Blob> }

const { isEn } = useLocale()
const cropper = ref<CropperInstance | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const img = ref(imageList[4])
const outputType = ref('webp')
const outputSize = ref(0.9)
const resultUrl = ref('')
const resultSize = ref('')
const exporting = ref(false)
const wrapper = { width: '100%', height: 'min(440px, calc(100vw - 72px))', background: '#f2f3f5' }
const cropLayout = { width: 300, height: 300 }
const labels = computed(() => isEn.value ? {
  eyebrow: 'REAL-WORLD EXAMPLE', title: 'Prepare a product image',
  description: 'Crop a consistent square product image, choose an output format and quality, then inspect list and detail previews.',
  editor: 'Main image editor', replace: 'Choose image', settings: 'Export settings',
  format: 'Format', quality: 'Quality', save: 'Save product image', preview: 'Store preview',
  list: 'Product list', detail: 'Product detail', result: 'Export result', fileSize: 'File size',
  productName: 'Natural landscape print', productMeta: 'Square main image · ready to publish',
  viewCode: 'View product image code', copyCode: 'Copy code', copied: 'Copied',
} : {
  eyebrow: '真实场景示例', title: '制作商品主图',
  description: '将商品图片裁剪为统一的正方形，选择输出格式和质量，并检查列表页与详情页的展示效果。',
  editor: '主图编辑器', replace: '选择图片', settings: '导出设置',
  format: '图片格式', quality: '图片质量', save: '保存商品图', preview: '店铺预览',
  list: '商品列表', detail: '商品详情', result: '导出结果', fileSize: '文件大小',
  productName: '自然风景装饰画', productMeta: '正方形主图 · 可发布',
  viewCode: '查看商品主图代码', copyCode: '复制代码', copied: '已复制',
})

const formatBytes = (size: number) => size < 1024 * 1024
  ? `${(size / 1024).toFixed(1)} KB`
  : `${(size / 1024 / 1024).toFixed(2)} MB`

const chooseFile = () => fileInput.value?.click()
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = await loadFile(file)
  if (url) img.value = url
  input.value = ''
}

const exportProduct = async () => {
  if (!cropper.value) return
  exporting.value = true
  const blob = await cropper.value.getCropBlob()
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = URL.createObjectURL(blob)
  resultSize.value = formatBytes(blob.size)
  exporting.value = false
}

onBeforeUnmount(() => {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
})
</script>

<template>
  <section class="scenario-page">
    <header class="scenario-intro">
      <span>{{ labels.eyebrow }}</span>
      <h1>{{ labels.title }}</h1>
      <p>{{ labels.description }}</p>
    </header>
    <section class="scenario-card product-layout">
      <section class="editor-column">
        <div class="section-heading">
          <div><h2 id="editor">{{ labels.editor }}</h2><p>1:1 · high-DPI · max 2400px</p></div>
          <el-button @click="chooseFile">{{ labels.replace }}</el-button>
        </div>
        <input ref="fileInput" hidden type="file" accept="image/*" @change="handleFileChange" />
        <vue-cropper
          ref="cropper"
          :img="img"
          :wrapper="wrapper"
          :crop-layout="cropLayout"
          :crop-box-resizable="true"
          :crop-box-constraints-enabled="true"
          :crop-aspect-ratio="1"
          :min-crop-width="180"
          :min-crop-height="180"
          :max-crop-width="360"
          :max-crop-height="360"
          :center-box="true"
          :output-type="outputType"
          :output-size="outputSize"
          :full="true"
          :max-side-length="2400"
        />
      </section>
      <aside class="preview-column">
        <h2>{{ labels.settings }}</h2>
        <label class="field-row">
          <span>{{ labels.format }}</span>
          <el-select v-model="outputType" :teleported="false">
            <el-option label="WebP" value="webp" />
            <el-option label="JPEG" value="jpeg" />
          </el-select>
        </label>
        <label class="quality-field">
          <span>{{ labels.quality }} <b>{{ outputSize }}</b></span>
          <el-slider :aria-label="labels.quality" v-model="outputSize" :min="0.5" :max="1" :step="0.1" />
        </label>
        <el-button class="save-button" type="primary" :loading="exporting" @click="exportProduct">{{ labels.save }}</el-button>

        <section class="store-preview">
          <h2>{{ labels.preview }}</h2>
          <div class="list-card">
            <div class="image-placeholder"><img v-if="resultUrl" :src="resultUrl" alt="product list preview" /></div>
            <div><span>{{ labels.list }}</span><strong>{{ labels.productName }}</strong><p>{{ labels.productMeta }}</p></div>
          </div>
          <div class="detail-card">
            <span>{{ labels.detail }}</span>
            <div class="detail-image"><img v-if="resultUrl" :src="resultUrl" alt="product detail preview" /></div>
          </div>
        </section>
        <p v-if="resultUrl" class="result-meta">{{ labels.result }} · {{ labels.fileSize }}: {{ resultSize }}</p>
      </aside>
    </section>
    <p class="integration-note">{{ isEn ? 'The complete example uses only the public package. Add your own photo.jpg or choose a local file; export returns a Blob without calling an upload service.' : '完整示例只依赖公开 npm 包。放入自己的 photo.jpg 或选择本地图片；导出得到 Blob，不会调用上传服务。' }}</p>
    <ScenarioCodeExample
      :title="labels.viewCode"
      :code="codeExample"
      :copy-label="labels.copyCode"
      :copied-label="labels.copied"
    />
  </section>
</template>

<style scoped lang="scss">
.scenario-page { width: 100%; max-width: 1180px; margin: 0 auto; }
.scenario-intro { margin-bottom: 20px; }
.scenario-intro span { color: var(--doc-green); font-size: 12px; font-weight: 700; letter-spacing: .12em; }
.scenario-intro h1 { margin: 8px 0; font-size: clamp(28px, 4vw, 40px); color: var(--doc-ink); }
.scenario-intro p, .section-heading p, .list-card p, .result-meta { margin: 0; color: var(--doc-muted); line-height: 1.7; }
.scenario-card { border: 1px solid var(--doc-line); border-radius: 18px; background: #fff; box-shadow: 0 12px 36px rgba(29, 33, 41, .06); overflow: hidden; }
.product-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(340px, .75fr); }
.editor-column, .preview-column { padding: 22px; }
.preview-column { background: var(--doc-paper); border-left: 1px solid var(--doc-line); }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
h2 { margin: 0 0 4px; font-size: 18px; color: var(--doc-ink); }
.field-row, .quality-field { display: grid; gap: 8px; margin-top: 18px; color: var(--doc-muted); font-size: 13px; }
.quality-field span { display: flex; justify-content: space-between; }
.save-button { width: 100%; margin-top: 14px; }
.store-preview { margin-top: 26px; padding-top: 22px; border-top: 1px solid var(--doc-line); }
.list-card { display: grid; grid-template-columns: 88px 1fr; gap: 14px; align-items: center; margin-top: 14px; padding: 12px; border-radius: 12px; background: #fff; }
.image-placeholder, .detail-image { overflow: hidden; background: var(--doc-line); }
.image-placeholder { width: 88px; height: 88px; border-radius: 10px; }
.image-placeholder img, .detail-image img { width: 100%; height: 100%; object-fit: cover; }
.list-card span, .detail-card > span { color: var(--doc-muted); font-size: 11px; }
.list-card strong { display: block; margin: 6px 0 2px; color: var(--doc-ink); }
.list-card p { font-size: 12px; }
.detail-card { margin-top: 14px; padding: 12px; border-radius: 12px; background: #fff; }
.detail-image { width: 100%; margin-top: 8px; aspect-ratio: 1; border-radius: 10px; }
.result-meta { margin-top: 12px; font-size: 12px; }
@media (max-width: 960px) {
  .product-layout { grid-template-columns: 1fr; }
  .preview-column { border-top: 1px solid var(--doc-line); border-left: 0; }
}
@media (max-width: 560px) {
  .editor-column, .preview-column { padding: 16px; }
  .section-heading { align-items: flex-start; }
}
</style>
