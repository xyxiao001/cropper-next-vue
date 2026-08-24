<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { loadFile } from '../../lib/common'
import type { InterfaceRealTimePreview } from '../../lib/interface'
import ScenarioCodeExample from '../components/ScenarioCodeExample.vue'
import { useLocale } from '../composables/useLocale'
import { imageList } from '../utils/image'

type CropperInstance = {
  getCropBlob: () => Promise<Blob>
  reset: () => void
}

const { isEn } = useLocale()
const cropper = ref<CropperInstance | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const initialImage = imageList[1]
const img = ref(initialImage)
const savedUrl = ref('')
const savedSize = ref('')
const saving = ref(false)
const preview = reactive({
  w: 0,
  h: 0,
  url: '',
  img: {} as InterfaceRealTimePreview['img'],
})

const wrapper = { width: '100%', height: 'min(440px, calc(100vw - 72px))' }
const cropLayout = { width: 260, height: 260 }
const previewStyle = computed(() => ({
  width: `${preview.w}px`,
  height: `${preview.h}px`,
  zoom: preview.w ? 112 / preview.w : 1,
}))
const codeExample = `<script setup>
import { reactive, ref } from 'vue'

const cropper = ref()
const image = ref('')
const preview = reactive({ w: 0, h: 0, url: '', img: {} })

const selectAvatar = (event) => {
  const file = event.target.files[0]
  image.value = URL.createObjectURL(file)
}

const handlePreview = (payload) => Object.assign(preview, payload)

const saveAvatar = async () => {
  const blob = await cropper.value.getCropBlob()
  const formData = new FormData()
  formData.append('avatar', blob, 'avatar.webp')
  await fetch('/api/avatar', { method: 'POST', body: formData })
}
${'</' + 'script>'}

<template>
  <input type="file" accept="image/*" @change="selectAvatar" />
  <vue-cropper
    ref="cropper"
    :img="image"
    :wrapper="{ width: 480, height: 480 }"
    :crop-layout="{ width: 260, height: 260 }"
    :crop-box-resizable="true"
    :crop-box-constraints-enabled="true"
    :crop-aspect-ratio="1"
    :center-box="true"
    output-type="webp"
    :max-side-length="1024"
    @real-time="handlePreview"
  />
  <button @click="saveAvatar">Save avatar</button>
</template>`
const labels = computed(() => isEn.value ? {
  eyebrow: 'REAL-WORLD EXAMPLE',
  title: 'Update profile photo',
  description: 'Choose a photo, adjust a square crop, preview the circular avatar, then export a Blob for upload.',
  editor: 'Adjust photo',
  preview: 'Profile preview',
  previewHint: 'The circle is a UI preview. The exported image remains square.',
  select: 'Choose photo',
  replace: 'Replace photo',
  cancel: 'Cancel changes',
  save: 'Save avatar',
  saved: 'Saved result',
  fileSize: 'Blob size',
  empty: 'Adjust the image to preview your avatar.',
  viewCode: 'View avatar upload code', copyCode: 'Copy code', copied: 'Copied',
} : {
  eyebrow: '真实场景示例',
  title: '更新个人头像',
  description: '选择图片并调整正方形裁剪区域，通过圆形头像预览确认效果，最后导出 Blob 模拟上传。',
  editor: '调整图片',
  preview: '头像预览',
  previewHint: '圆形仅用于界面预览，实际导出结果仍为正方形图片。',
  select: '选择图片',
  replace: '重新选择',
  cancel: '取消修改',
  save: '保存头像',
  saved: '保存结果',
  fileSize: 'Blob 大小',
  empty: '调整图片后可在这里预览头像效果。',
  viewCode: '查看头像上传代码', copyCode: '复制代码', copied: '已复制',
})

const formatBytes = (size: number) => size < 1024 * 1024
  ? `${(size / 1024).toFixed(1)} KB`
  : `${(size / 1024 / 1024).toFixed(2)} MB`

const clearSaved = () => {
  if (savedUrl.value) URL.revokeObjectURL(savedUrl.value)
  savedUrl.value = ''
  savedSize.value = ''
}

const handlePreview = (payload: InterfaceRealTimePreview) => {
  preview.w = payload.w
  preview.h = payload.h
  preview.url = payload.url
  preview.img = payload.img
}

const chooseFile = () => fileInput.value?.click()

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = await loadFile(file)
  if (url) img.value = url
  input.value = ''
  clearSaved()
}

const cancelChanges = () => {
  img.value = initialImage
  cropper.value?.reset()
  clearSaved()
}

const saveAvatar = async () => {
  if (!cropper.value) return
  saving.value = true
  const blob = await cropper.value.getCropBlob()
  clearSaved()
  savedUrl.value = URL.createObjectURL(blob)
  savedSize.value = formatBytes(blob.size)
  saving.value = false
}

onBeforeUnmount(clearSaved)
</script>

<template>
  <section class="scenario-page">
    <header class="scenario-intro">
      <span>{{ labels.eyebrow }}</span>
      <h1>{{ labels.title }}</h1>
      <p>{{ labels.description }}</p>
    </header>

    <section class="scenario-card avatar-layout">
      <section class="editor-column">
        <div class="section-heading">
          <div>
            <h2>{{ labels.editor }}</h2>
            <p>1:1 · WebP · max 1024px</p>
          </div>
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
          :min-crop-width="160"
          :min-crop-height="160"
          :max-crop-width="320"
          :max-crop-height="320"
          :center-box="true"
          output-type="webp"
          :output-size="0.9"
          :full="true"
          :max-side-length="1024"
          @real-time="handlePreview"
        />
      </section>

      <aside class="preview-column">
        <h2>{{ labels.preview }}</h2>
        <div class="avatar-preview">
          <section v-if="preview.url" class="realtime-preview" :style="previewStyle">
            <img :src="preview.url" :style="preview.img" alt="avatar preview" />
          </section>
          <span v-else>{{ labels.empty }}</span>
        </div>
        <p class="preview-hint">{{ labels.previewHint }}</p>
        <div class="scenario-actions">
          <el-button @click="cancelChanges">{{ labels.cancel }}</el-button>
          <el-button type="primary" :loading="saving" @click="saveAvatar">{{ labels.save }}</el-button>
        </div>
        <section v-if="savedUrl" class="saved-result">
          <img :src="savedUrl" alt="saved avatar" />
          <div>
            <strong>{{ labels.saved }}</strong>
            <p>{{ labels.fileSize }}: {{ savedSize }}</p>
          </div>
        </section>
      </aside>
    </section>
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
.scenario-intro span { color: #3370ff; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
.scenario-intro h1 { margin: 8px 0; font-size: clamp(28px, 4vw, 40px); color: #1d2129; }
.scenario-intro p, .section-heading p, .preview-hint, .saved-result p { margin: 0; color: #86909c; line-height: 1.7; }
.scenario-card { border: 1px solid #e5e6eb; border-radius: 18px; background: #fff; box-shadow: 0 12px 36px rgba(29, 33, 41, .06); overflow: hidden; }
.avatar-layout { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(280px, .7fr); }
.editor-column, .preview-column { padding: 22px; }
.preview-column { background: #f7f8fa; border-left: 1px solid #e5e6eb; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
h2 { margin: 0 0 4px; font-size: 18px; color: #1d2129; }
.avatar-preview { display: flex; align-items: center; justify-content: center; width: 112px; height: 112px; margin: 28px auto 16px; border-radius: 50%; overflow: hidden; background: #e5e6eb; color: #86909c; font-size: 12px; text-align: center; }
.realtime-preview { margin: 0; overflow: hidden; transform-origin: 0 0; }
.realtime-preview img { display: block; }
.scenario-actions { display: flex; gap: 10px; margin-top: 24px; }
.saved-result { display: flex; align-items: center; gap: 12px; margin-top: 22px; padding-top: 18px; border-top: 1px solid #e5e6eb; }
.saved-result img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
.saved-result strong { color: #1d2129; }
@media (max-width: 900px) {
  .avatar-layout { grid-template-columns: 1fr; }
  .preview-column { border-top: 1px solid #e5e6eb; border-left: 0; }
}
@media (max-width: 560px) {
  .editor-column, .preview-column { padding: 16px; }
  .section-heading { align-items: flex-start; }
  .scenario-actions { flex-direction: column-reverse; }
  .scenario-actions :deep(.el-button) { width: 100%; margin: 0; }
}
</style>
