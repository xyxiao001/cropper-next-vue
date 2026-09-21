<script setup lang="ts">
import codeExample from '../examples/CoverCrop.vue?raw'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { InterfaceRealTimePreview } from '../../lib/interface'
import ScenarioCodeExample from '../components/ScenarioCodeExample.vue'
import { useLocale } from '../composables/useLocale'
import { imageList } from '../utils/image'

type CropperInstance = {
  getCropBlob: () => Promise<Blob>
  rotateLeft: () => void
  rotateRight: () => void
}

const { isEn } = useLocale()
const cropper = ref<CropperInstance | null>(null)
const img = ref(imageList[6])
const resultUrl = ref('')
const desktopPreview = ref<HTMLElement | null>(null)
const desktopPreviewWidth = ref(0)
let previewResizeObserver: ResizeObserver
onMounted(() => {
  previewResizeObserver = new ResizeObserver(([entry]) => {
    desktopPreviewWidth.value = entry.contentRect.width
  })
  previewResizeObserver.observe(desktopPreview.value!)
})
const exporting = ref(false)
const preview = reactive({ w: 0, h: 0, url: '', img: {} as InterfaceRealTimePreview['img'] })
const wrapper = { width: '100%', height: 'min(420px, calc(100vw - 72px))' }
const cropLayout = { width: '82%', height: '46.125%' }

const previewStyle = (width: number) => ({
  width: `${preview.w}px`,
  height: `${preview.h}px`,
  zoom: preview.w ? width / preview.w : 1,
})
const labels = computed(() => isEn.value ? {
  eyebrow: 'REAL-WORLD EXAMPLE', title: 'Create an article cover',
  description: 'Compose a 16:9 cover once and verify how it reads in desktop and mobile content cards.',
  editor: 'Cover editor', rotateLeft: 'Rotate left', rotateRight: 'Rotate right',
  preview: 'Publishing preview', desktop: 'Desktop feed', mobile: 'Mobile feed',
  apply: 'Apply cover', result: 'Exported cover · max 1920px',
  viewCode: 'View article cover code', copyCode: 'Copy code', copied: 'Copied',
} : {
  eyebrow: '真实场景示例', title: '制作文章封面',
  description: '使用 16:9 裁剪框完成一次构图，并同时检查桌面端和移动端内容卡片中的展示效果。',
  editor: '封面编辑器', rotateLeft: '向左旋转', rotateRight: '向右旋转',
  preview: '发布预览', desktop: '桌面端信息流', mobile: '移动端信息流',
  apply: '应用封面', result: '已导出封面 · 最长边 1920px',
  viewCode: '查看文章封面代码', copyCode: '复制代码', copied: '已复制',
})

const handlePreview = (payload: InterfaceRealTimePreview) => {
  preview.w = payload.w
  preview.h = payload.h
  preview.url = payload.url
  preview.img = payload.img
}

const exportCover = async () => {
  if (!cropper.value) return
  exporting.value = true
  const blob = await cropper.value.getCropBlob()
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = URL.createObjectURL(blob)
  exporting.value = false
}

onBeforeUnmount(() => {
  previewResizeObserver.disconnect()
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
    <section class="scenario-card cover-layout">
      <section class="editor-column">
        <div class="section-heading">
          <div><h2 id="editor">{{ labels.editor }}</h2><p>16:9 · WebP · max 1920px</p></div>
          <div class="compact-actions">
            <el-button @click="cropper?.rotateLeft()">{{ labels.rotateLeft }}</el-button>
            <el-button @click="cropper?.rotateRight()">{{ labels.rotateRight }}</el-button>
          </div>
        </div>
        <vue-cropper
          ref="cropper"
          :img="img"
          :wrapper="wrapper"
          :crop-layout="cropLayout"
          :crop-box-resizable="true"
          :crop-box-constraints-enabled="true"
          :crop-aspect-ratio="16 / 9"
          :min-crop-width="240"
          :min-crop-height="135"
          :center-box="true"
          output-type="webp"
          :output-size="0.9"
          :full="true"
          :max-side-length="1920"
          @real-time="handlePreview"
        />
      </section>
      <aside class="preview-column">
        <h2>{{ labels.preview }}</h2>
        <section class="preview-block">
          <span>{{ labels.desktop }}</span>
          <div ref="desktopPreview" class="cover-preview desktop-preview">
            <section v-if="preview.url" :style="previewStyle(desktopPreviewWidth)"><img :src="preview.url" :style="preview.img" alt="desktop cover preview" /></section>
          </div>
          <div class="fake-copy"><b></b><i></i><i></i></div>
        </section>
        <section class="preview-block mobile-card">
          <div>
            <span>{{ labels.mobile }}</span>
            <div class="fake-copy"><b></b><i></i></div>
          </div>
          <div class="cover-preview mobile-preview">
            <section v-if="preview.url" :style="previewStyle(128)"><img :src="preview.url" :style="preview.img" alt="mobile cover preview" /></section>
          </div>
        </section>
        <el-button class="apply-button" type="primary" :loading="exporting" @click="exportCover">{{ labels.apply }}</el-button>
        <section v-if="resultUrl" class="result-card">
          <img :src="resultUrl" alt="exported article cover" />
          <strong>{{ labels.result }}</strong>
        </section>
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
.scenario-intro p, .section-heading p { margin: 0; color: var(--doc-muted); line-height: 1.7; }
.scenario-card { border: 1px solid var(--doc-line); border-radius: 18px; background: #fff; box-shadow: 0 12px 36px rgba(29, 33, 41, .06); overflow: hidden; }
.cover-layout { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(340px, .75fr); }
.editor-column, .preview-column { padding: 22px; }
.preview-column { background: var(--doc-paper); border-left: 1px solid var(--doc-line); }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
h2 { margin: 0 0 4px; font-size: 18px; color: var(--doc-ink); }
.compact-actions { display: flex; gap: 8px; }
.preview-block { margin-top: 18px; padding: 14px; border: 1px solid var(--doc-line); border-radius: 12px; background: #fff; }
.preview-block > span, .mobile-card span { display: block; margin-bottom: 10px; color: var(--doc-muted); font-size: 12px; font-weight: 600; }
.cover-preview { overflow: hidden; background: var(--doc-line); }
.cover-preview section { overflow: hidden; transform-origin: 0 0; }
.cover-preview img { display: block; }
.desktop-preview { width: 100%; max-width: 320px; aspect-ratio: 16 / 9; }
.mobile-preview { width: 128px; aspect-ratio: 16 / 9; flex-shrink: 0; }
.fake-copy { display: grid; gap: 7px; margin-top: 12px; }
.fake-copy b, .fake-copy i { display: block; height: 8px; border-radius: 8px; background: var(--doc-line); }
.fake-copy b { width: 72%; height: 11px; background: #c9cdd4; }
.fake-copy i:last-child { width: 54%; }
.mobile-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.mobile-card > div:first-child { flex: 1; min-width: 0; }
.apply-button { width: 100%; margin-top: 18px; }
.result-card { margin-top: 14px; }
.result-card img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 10px; }
.result-card strong { display: block; margin-top: 8px; color: var(--doc-muted); font-size: 13px; }
@media (max-width: 960px) {
  .cover-layout { grid-template-columns: minmax(0, 1fr); }
  .preview-column { border-top: 1px solid var(--doc-line); border-left: 0; }
}
@media (max-width: 560px) {
  .editor-column, .preview-column { padding: 16px; }
  .section-heading { align-items: flex-start; flex-direction: column; }
  .compact-actions { width: 100%; }
  .compact-actions :deep(.el-button) { flex: 1; margin: 0; }
}
</style>
