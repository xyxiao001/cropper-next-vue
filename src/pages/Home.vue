<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useLocale } from '../composables/useLocale'
import { imageList } from '../utils/image'
import { ElMessage } from 'element-plus'

const { isEn } = useLocale()

const t = computed(() => {
  if (isEn.value) {
    return {
      title: 'cropper-next-vue',
      subtitle: 'A standalone Vue 3 image cropper focused on rotation, boundary control, high‑DPI export, and realtime preview.',
      primaryCta: 'Get Started',
      docsCta: 'Open Docs',
      githubCta: 'GitHub',
      npmCta: 'npm',
      previewCta: 'Live Preview',
      previewTitle: 'Try it now',
      featuresTitle: 'Highlights',
      features: [
        {
          title: 'Rotation boundary handling',
          desc: 'Stable boundary judgment after rotation.'
        },
        {
          title: 'Keep inside crop box / wrapper',
          desc: 'Constrain the image within the crop box or the wrapper.'
        },
        {
          title: 'High‑DPI export',
          desc: 'Better output quality on retina screens.'
        },
        {
          title: 'Realtime preview',
          desc: 'Preview results instantly via events.'
        },
        {
          title: 'Standalone builds',
          desc: 'Build npm package and docs site independently.'
        }
      ],
      quickStartTitle: 'Quick Start',
      installTitle: 'Install',
      usageTitle: 'Usage',
      notesTitle: 'Notes',
      notes: [
        'Docs site uses hash routing (/#/...).',
        'Recommended: pnpm.',
        'Node requirement: 22.x.'
      ],
      actions: {
        randomImage: 'Random image',
        rotateLeft: 'Rotate left',
        rotateRight: 'Rotate right',
        rotateClear: 'Reset rotation',
        mode: 'Mode',
        modeCover: 'Cover',
        modeContain: 'Contain',
        modeOriginal: 'Original',
        limit: 'Boundary',
        limitNone: 'None',
        limitBox: 'Inside crop box',
        limitWrapper: 'Inside wrapper',
        exportImage: 'Export image',
      },
      export: {
        title: 'Export',
        hint: 'The exported image is shown below.',
        download: 'Download',
        retry: 'Export again',
        fail: 'Export failed',
      },
    }
  }

  return {
    title: 'cropper-next-vue',
    subtitle: '一个独立发布的 Vue 3 图片裁剪库，重点处理旋转边界判断、边界限制、高分屏导出与实时预览。',
    primaryCta: '开始使用',
    docsCta: '查看文档',
    githubCta: 'GitHub',
    npmCta: 'npm',
    previewCta: '在线预览',
    previewTitle: '直接体验',
    featuresTitle: '核心能力',
    features: [
      {
        title: '旋转后的边界判断',
        desc: '图片旋转后仍能稳定判断边界与限制逻辑。'
      },
      {
        title: '限制在截图框/容器内',
        desc: '支持将图片限制在截图框或容器内，避免拖出可视范围。'
      },
      {
        title: '高分屏导出',
        desc: '提升导出质量，适配高 DPI 屏幕。'
      },
      {
        title: '实时预览',
        desc: '通过事件实时拿到预览数据，便于业务联动。'
      },
      {
        title: '独立构建',
        desc: 'npm 包与文档站可分别构建发布。'
      }
    ],
    quickStartTitle: '快速上手',
    installTitle: '安装',
    usageTitle: '使用',
    notesTitle: '提示',
    notes: [
      '文档站使用 hash 路由（/#/...）。',
      '推荐使用 pnpm。',
      'Node 版本要求：22.x。'
    ],
    actions: {
      randomImage: '随机图片',
      rotateLeft: '向左旋转',
      rotateRight: '向右旋转',
      rotateClear: '复位旋转',
      mode: '布局模式',
      modeCover: 'cover',
      modeContain: 'contain',
      modeOriginal: 'original',
      limit: '边界限制',
      limitNone: '不限',
      limitBox: '限制截图框内',
      limitWrapper: '限制容器内',
      exportImage: '导出图片',
    },
    export: {
      title: '导出',
      hint: '导出结果会直接展示在下方。',
      download: '下载',
      retry: '重新导出',
      fail: '导出失败',
    },
  }
})

const links = {
  github: 'https://github.com/xyxiao001/cropper-next-vue',
  npm: 'https://www.npmjs.com/package/cropper-next-vue',
  preview: 'https://cropper-next-vue.vercel.app/'
}

const cropper = ref<any>()
const img = ref(imageList[0] ?? '')
const mode = ref<'cover' | 'contain' | 'original'>('cover')
const centerBox = ref(true)
const centerWrapper = ref(false)
const wrapper = {
  width: '100%',
  height: 'min(520px, 70vh)',
}
const cropLayout = {
  width: 360,
  height: 360,
}

const rotateLeft = () => cropper.value?.rotateLeft?.()
const rotateRight = () => cropper.value?.rotateRight?.()
const rotateClear = () => cropper.value?.rotateClear?.()

const exportOpen = ref(false)
const exporting = ref(false)
const exportUrl = ref('')
const exportBlob = ref<Blob | null>(null)

const cleanupExport = () => {
  if (exportUrl.value) {
    URL.revokeObjectURL(exportUrl.value)
    exportUrl.value = ''
  }
  exportBlob.value = null
}

const doExport = async () => {
  if (exporting.value) return
  exporting.value = true
  try {
    cleanupExport()
    const blob: Blob | undefined = await cropper.value?.getCropBlob?.()
    if (!blob) {
      ElMessage.error(t.value.export.fail)
      return
    }
    exportBlob.value = blob
    exportUrl.value = URL.createObjectURL(blob)
  } catch (_) {
    ElMessage.error(t.value.export.fail)
  } finally {
    exporting.value = false
  }
}

const openExport = async () => {
  exportOpen.value = true
  await doExport()
}

const downloadExport = () => {
  if (!exportUrl.value || !exportBlob.value) return
  const type = exportBlob.value.type || 'image/png'
  const ext = type.includes('jpeg') ? 'jpg' : type.includes('webp') ? 'webp' : 'png'
  const a = document.createElement('a')
  a.href = exportUrl.value
  a.download = `cropper-next-vue.${ext}`
  a.rel = 'noreferrer'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

watch(
  () => exportOpen.value,
  (open) => {
    if (open) return
    cleanupExport()
  },
)

onBeforeUnmount(() => {
  cleanupExport()
})

const pickRandomImage = () => {
  if (!imageList.length) return
  img.value = imageList[Math.floor(Math.random() * imageList.length)]
}

const setLimit = (value: 'none' | 'box' | 'wrapper') => {
  if (value === 'box') {
    centerBox.value = true
    centerWrapper.value = false
    return
  }
  if (value === 'wrapper') {
    centerBox.value = false
    centerWrapper.value = true
    return
  }
  centerBox.value = false
  centerWrapper.value = false
}

const installCommand = computed(() => {
  return `pnpm add cropper-next-vue
npm install cropper-next-vue
yarn add cropper-next-vue`
})

const usageCode = computed(() => {
  return `import 'cropper-next-vue/style.css'
import { VueCropper } from 'cropper-next-vue'`
})
</script>

<template>
  <section class="home">
    <section class="hero">
      <div class="hero__text">
        <h1 class="hero__title">{{ t.title }}</h1>
        <p class="hero__subtitle">{{ t.subtitle }}</p>
        <div class="hero__actions">
          <router-link to="/guide" class="hero__action">
            <el-button type="primary" size="large">{{ t.primaryCta }}</el-button>
          </router-link>
          <router-link to="/guide" class="hero__action">
            <el-button size="large">{{ t.docsCta }}</el-button>
          </router-link>
          <a class="hero__action" :href="links.github" target="_blank" rel="noreferrer">
            <el-button size="large">{{ t.githubCta }}</el-button>
          </a>
          <a class="hero__action" :href="links.npm" target="_blank" rel="noreferrer">
            <el-button size="large">{{ t.npmCta }}</el-button>
          </a>
        </div>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">{{ t.previewTitle }}</h2>
      <section class="preview">
        <section class="preview__toolbar">
          <section class="preview__tools">
            <el-button @click="pickRandomImage">{{ t.actions.randomImage }}</el-button>
            <el-button type="primary" :loading="exporting" @click="openExport">{{ t.actions.exportImage }}</el-button>
            <el-button-group>
              <el-button @click="rotateLeft">{{ t.actions.rotateLeft }}</el-button>
              <el-button @click="rotateRight">{{ t.actions.rotateRight }}</el-button>
              <el-button @click="rotateClear">{{ t.actions.rotateClear }}</el-button>
            </el-button-group>
            <el-select v-model="mode" :teleported="false" class="preview__select">
              <el-option :label="`${t.actions.mode}: ${t.actions.modeCover}`" value="cover" />
              <el-option :label="`${t.actions.mode}: ${t.actions.modeContain}`" value="contain" />
              <el-option :label="`${t.actions.mode}: ${t.actions.modeOriginal}`" value="original" />
            </el-select>
            <el-select :teleported="false" class="preview__select" :model-value="centerBox ? 'box' : centerWrapper ? 'wrapper' : 'none'" @update:model-value="setLimit">
              <el-option :label="`${t.actions.limit}: ${t.actions.limitNone}`" value="none" />
              <el-option :label="`${t.actions.limit}: ${t.actions.limitBox}`" value="box" />
              <el-option :label="`${t.actions.limit}: ${t.actions.limitWrapper}`" value="wrapper" />
            </el-select>
          </section>
          <demo-image-switch v-model="img" />
        </section>

        <section class="preview__stage">
          <vue-cropper
            ref="cropper"
            :img="img"
            :wrapper="wrapper"
            :crop-layout="cropLayout"
            :center-box="centerBox"
            :center-wrapper="centerWrapper"
            :mode="mode"
          />
        </section>
      </section>
    </section>

    <el-dialog v-model="exportOpen" :title="t.export.title" width="min(980px, 96vw)">
      <section class="export-dialog">
        <p class="export-hint">{{ t.export.hint }}</p>
        <section class="export-actions">
          <el-button :loading="exporting" @click="doExport">{{ t.export.retry }}</el-button>
          <el-button type="primary" :disabled="!exportUrl" @click="downloadExport">{{ t.export.download }}</el-button>
        </section>
        <section class="export-result">
          <section v-if="exporting" class="export-loading">
            <el-skeleton :rows="6" animated />
          </section>
          <img
            v-else-if="exportUrl"
            class="export-image"
            :src="exportUrl"
            :style="{ width: `${cropLayout.width}px`, height: `${cropLayout.height}px` }"
            alt="export result"
          />
        </section>
      </section>
    </el-dialog>

    <section class="block">
      <h2 class="block__title">{{ t.featuresTitle }}</h2>
      <el-row :gutter="16">
        <el-col v-for="item in t.features" :key="item.title" :xs="24" :sm="12" :md="8">
          <el-card shadow="never" class="feature-card">
            <div class="feature-card__title">{{ item.title }}</div>
            <div class="feature-card__desc">{{ item.desc }}</div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="block">
      <h2 class="block__title">{{ t.quickStartTitle }}</h2>
      <div class="quick">
        <div class="quick__col">
          <h3 class="quick__title">{{ t.installTitle }}</h3>
          <pre class="code"><code>{{ installCommand }}</code></pre>
        </div>
        <div class="quick__col">
          <h3 class="quick__title">{{ t.usageTitle }}</h3>
          <pre class="code"><code>{{ usageCode }}</code></pre>
        </div>
      </div>
    </section>

    <section class="block">
      <h2 class="block__title">{{ t.notesTitle }}</h2>
      <ul class="notes">
        <li v-for="line in t.notes" :key="line" class="notes__item">{{ line }}</li>
      </ul>
    </section>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/color.scss" as *;

.home {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px 0 48px;
  color: $G100;
}

.hero {
  padding: 24px 0 8px;
}

.hero__title {
  font-size: 40px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero__subtitle {
  margin-top: 12px;
  max-width: 820px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.hero__action {
  display: inline-flex;
}

.block {
  margin-top: 28px;
}

.block__title {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 12px;
}

.preview {
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.preview__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.preview__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.preview__select {
  width: 220px;
}

.preview__stage {
  padding: 12px;
}

.preview__stage :deep(.vue-cropper) {
  border-radius: 12px;
  overflow: hidden;
}

.export-dialog {
  display: grid;
  gap: 14px;
}

.export-hint {
  margin: 0;
  color: #666;
  line-height: 1.7;
}

.export-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.export-result {
  min-height: 200px;
}

.export-loading {
  padding: 8px 0;
}

.export-image {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.feature-card {
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.feature-card__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.feature-card__desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.65);
}

.quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.quick__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.code {
  background: #0f172a;
  color: #e2e8f0;
  padding: 14px 16px;
  border-radius: 10px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
}

.notes {
  padding-left: 18px;
  list-style: disc;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.8;
  font-size: 14px;
}

.notes__item {
  margin: 4px 0;
}

@media screen and (max-width: 767px) {
  .home {
    padding: 6px 0 24px;
  }

  .hero__title {
    font-size: 30px;
  }

  .quick {
    grid-template-columns: 1fr;
  }

  .preview__select {
    width: 100%;
    max-width: 320px;
  }
}
</style>
