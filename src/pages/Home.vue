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
          title: 'Crop box and wrapper coverage',
          desc: 'Keep the crop box or the entire workspace covered, with rebound after dragging.'
        },
        {
          title: 'Resizable crop box',
          desc: 'Optional eight-direction resizing with a grid shown while adjusting.'
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
        reset: 'Reset crop',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        movable: 'Allow dragging',
        zoomable: 'Allow interactive zoom',
        cropBoxResizable: 'Resize crop box',
        zoomAtPointer: 'Zoom at pointer / touch center',
        mode: 'Mode',
        modeCover: 'Cover',
        modeContain: 'Contain',
        modeOriginal: 'Original',
        limit: 'Boundary',
        limitNone: 'None',
        limitBox: 'Cover crop box',
        limitWrapper: 'Cover wrapper',
        exportImage: 'Export image',
        exportOriginal: 'Undo zoom for export',
        maxSideLength: 'Max side',
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
        title: '选区与容器覆盖',
        desc: '让图片覆盖裁剪框或整个容器，越界拖动后回弹。'
      },
      {
        title: '可缩放裁剪框',
        desc: '按需开启八方向缩放，调整时显示九宫格构图参考。'
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
      reset: '重置裁剪',
      zoomIn: '放大',
      zoomOut: '缩小',
      movable: '允许拖拽',
      zoomable: '允许交互缩放',
      cropBoxResizable: '允许缩放裁剪框',
      zoomAtPointer: '以鼠标/双指中心缩放',
      mode: '布局模式',
      modeCover: 'cover',
      modeContain: 'contain',
      modeOriginal: 'original',
      limit: '边界限制',
      limitNone: '不限',
      limitBox: '覆盖裁剪框',
      limitWrapper: '覆盖整个容器',
      exportImage: '导出图片',
      exportOriginal: '按原图像素导出',
      maxSideLength: '最长边',
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
const img = ref('')
const mode = ref<'cover' | 'contain' | 'original'>('cover')
const zoomAnchor = ref<'center' | 'pointer'>('pointer')
const movable = ref(true)
const zoomable = ref(true)
const cropBoxResizable = ref(true)
const centerBox = ref(true)
const centerWrapper = ref(false)
const wrapper = {
  width: '100%',
  height: 'min(420px, 65vh)',
}
const cropLayout = {
  width: '70%',
  height: '70%',
}

const rotateLeft = () => cropper.value?.rotateLeft?.()
const rotateRight = () => cropper.value?.rotateRight?.()
const rotateClear = () => cropper.value?.rotateClear?.()
const reset = () => cropper.value?.reset?.()
const zoomIn = () => cropper.value?.zoomIn?.()
const zoomOut = () => cropper.value?.zoomOut?.()

const exportOriginal = ref(false)
const maxSideLength = ref(3000)

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
  <section class="home-page">
    <div class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> A LITTLE CROP. A BETTER PICTURE.</p>
        <h1 v-if="!isEn">每一张图片，<br><em>刚刚好的构图。</em></h1>
        <h1 v-else>A little crop.<br><em>A better picture.</em></h1>
        <p class="hero-description">{{ isEn ? 'From profile photos to editorial covers. Crop, rotate and export in Vue 3, with every detail in your hands.' : '从一张头像，到一幅封面。在 Vue 3 中轻松完成图片裁剪、旋转与导出，让每个细节，都在你的掌控之中。' }}</p>
        <div class="hero-actions"><router-link to="/guide" class="doc-button primary">{{ isEn ? 'Start building' : '开始接入' }} <span>→</span></router-link><router-link to="/demo-all" class="doc-button">{{ isEn ? 'Open playground' : '在线体验' }} <span>↗</span></router-link></div>
        <div class="install-line"><span>$</span><code>pnpm add cropper-next-vue</code></div>
      </div>
      <div class="hero-editor">
        <div class="editor-caption"><span class="editor-dots">● ● ●</span><span>{{ isEn ? 'Your image workspace' : '你的图片工作区' }}</span><span class="live-badge">● LIVE</span></div>
        <div class="hero-canvas">
          <vue-cropper
            ref="cropper"
            :img="img"
            :wrapper="wrapper"
            :crop-layout="cropLayout"
            :center-box="centerBox"
            :center-wrapper="centerWrapper"
            :zoom-anchor="zoomAnchor"
            :movable="movable"
            :zoomable="zoomable"
            :crop-box-resizable="cropBoxResizable"
            :mode="mode"
            :original="exportOriginal"
            :max-side-length="maxSideLength"
          />
        </div>
        <div class="hero-tools">
          <div class="primary-tools"><button type="button" :aria-label="t.actions.rotateLeft" :title="t.actions.rotateLeft" @click="rotateLeft">↶</button><button type="button" :aria-label="t.actions.rotateRight" :title="t.actions.rotateRight" @click="rotateRight">↷</button><span class="tool-divider"></span><button type="button" :aria-label="t.actions.zoomOut" :title="t.actions.zoomOut" @click="zoomOut">−</button><button type="button" :aria-label="t.actions.zoomIn" :title="t.actions.zoomIn" @click="zoomIn">＋</button><button type="button" :aria-label="t.actions.reset" :title="t.actions.reset" @click="reset">↺</button></div>
          <el-button type="primary" :loading="exporting" @click="openExport">{{ t.actions.exportImage }} ↗</el-button>
        </div>
        <div class="hero-image"><demo-image-switch v-model="img" /></div>
        <details class="hero-settings"><summary>{{ isEn ? 'More settings' : '更多设置' }} <span>＋</span></summary><div class="advanced-tools">
            <el-switch
              v-model="zoomAnchor"
              active-value="pointer"
              inactive-value="center"
              :aria-label="t.actions.zoomAtPointer" :active-text="t.actions.zoomAtPointer"
            />
            <el-switch v-model="movable" :aria-label="t.actions.movable" :active-text="t.actions.movable" />
            <el-switch v-model="zoomable" :aria-label="t.actions.zoomable" :active-text="t.actions.zoomable" />
            <el-switch v-model="cropBoxResizable" :aria-label="t.actions.cropBoxResizable" :active-text="t.actions.cropBoxResizable" />
            <el-select :aria-label="t.actions.mode" v-model="mode" :teleported="false" class="preview__select">
              <el-option :label="`${t.actions.mode}: ${t.actions.modeCover}`" value="cover" />
              <el-option :label="`${t.actions.mode}: ${t.actions.modeContain}`" value="contain" />
              <el-option :label="`${t.actions.mode}: ${t.actions.modeOriginal}`" value="original" />
            </el-select>
            <el-select :aria-label="t.actions.limit" :teleported="false" class="preview__select" :model-value="centerBox ? 'box' : centerWrapper ? 'wrapper' : 'none'" @update:model-value="setLimit">
              <el-option :label="`${t.actions.limit}: ${t.actions.limitNone}`" value="none" />
              <el-option :label="`${t.actions.limit}: ${t.actions.limitBox}`" value="box" />
              <el-option :label="`${t.actions.limit}: ${t.actions.limitWrapper}`" value="wrapper" />
            </el-select>
            <el-switch v-model="exportOriginal" :aria-label="t.actions.exportOriginal" :active-text="t.actions.exportOriginal" />
            <section class="preview__max-side">
              <span class="preview__max-side-label">{{ t.actions.maxSideLength }}</span>
              <el-input-number :aria-label="t.actions.maxSideLength" v-model="maxSideLength" :min="0" :max="12000" :step="100" controls-position="right" />
            </section>

          <el-button @click="rotateClear">{{ t.actions.rotateClear }}</el-button><el-button @click="pickRandomImage">{{ t.actions.randomImage }}</el-button>
        </div></details>
        <p class="demo-settings-note">{{ isEn ? 'This demo enables crop-box resizing and crop-box coverage; both are off by default in the component.' : '此演示开启裁剪框缩放和覆盖选区；组件中这两项默认关闭。' }}</p>
      </div>
    </div>
    <div class="capability-strip"><span>{{ isEn ? 'From interaction to output.' : '从交互到输出，照顾每一个细节。' }}</span><b>✓ {{ isEn ? 'Mouse & touch' : '鼠标与触摸' }}</b><b>✓ {{ isEn ? 'Boundary control' : '旋转与边界' }}</b><b>✓ {{ isEn ? 'Live preview' : '实时预览' }}</b><b>✓ {{ isEn ? 'High-DPI output' : '高分屏导出' }}</b></div>
    <div class="home-section-heading"><div><p class="eyebrow">MADE FOR YOUR NEXT IDEA</p><h2>{{ isEn ? 'Start with your use case.' : '从你的场景开始。' }}</h2></div><router-link to="/concepts">{{ isEn ? 'Understand the possibilities' : '了解组件能力' }} →</router-link></div>
    <div class="home-scenarios">
      <router-link to="/scenario-avatar" class="scenario-tile"><div class="scenario-art avatar-art"><div class="profile-mock"><img :src="imageList[1]" alt=""><div><i></i><i></i></div></div></div><div class="scenario-tile-body"><small>01 / AVATAR</small><h3>{{ isEn ? 'A fresh profile photo' : '一张新头像' }} <span>↗</span></h3><p>{{ isEn ? 'Compose a square crop and preview your profile.' : '调整正方形选区，在圆形头像中预览效果。' }}</p></div></router-link>
      <router-link to="/scenario-cover" class="scenario-tile"><div class="scenario-art cover-art"><div class="cover-mock"><img :src="imageList[4]" alt=""><i></i><i></i></div></div><div class="scenario-tile-body"><small>02 / COVER</small><h3>{{ isEn ? 'The beginning of a story' : '一个好故事的封面' }} <span>↗</span></h3><p>{{ isEn ? 'Find your composition in a 16:9 frame.' : '用 16:9 构图，让重要的内容落在画面里。' }}</p></div></router-link>
      <router-link to="/scenario-product" class="scenario-tile"><div class="scenario-art product-art"><div class="product-mock"><img :src="imageList[7]" alt=""></div></div><div class="scenario-tile-body"><small>03 / PRODUCT</small><h3>{{ isEn ? 'Details worth seeing' : '值得被看见的细节' }} <span>↗</span></h3><p>{{ isEn ? 'Consistent ratios, with control over output quality.' : '统一主图比例，按需选择导出格式与质量。' }}</p></div></router-link>
    </div>
    <section class="home-learning"><div><p class="eyebrow">SMALL STEPS. CLEAR RESULTS.</p><h2>{{ isEn ? 'Your first crop starts here.' : '让第一张裁剪图，先跑起来。' }}</h2><p>{{ isEn ? 'Install the component, add an image, then get the result. Follow a complete example you can use in your own project.' : '安装、放入组件、拿到结果。跟着完整示例，在自己的项目中完成第一次接入。' }}</p><router-link to="/guide" class="doc-button primary">{{ isEn ? 'Read the quick start' : '阅读快速开始' }} →</router-link></div><div class="learning-code"><div>01 / INSTALL & IMPORT</div><pre>{{ installCommand }}</pre><pre>{{ usageCode }}</pre></div></section>
    <section class="home-features"><div v-for="feature in t.features" :key="feature.title"><span class="feature-mark">↗</span><h3>{{ feature.title }}</h3><p>{{ feature.desc }}</p></div></section>
    <footer class="home-footer"><span>cropper-next-vue · {{ isEn ? 'Made for Vue 3.' : '专注于图片裁剪。' }}</span><div><a :href="links.github">GitHub ↗</a><a :href="links.npm">npm ↗</a><router-link to="/changelog">{{ isEn ? 'Changelog' : '版本记录' }}</router-link></div></footer>
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
            alt="export result"
          />
        </section>
      </section>
    </el-dialog>
  </section>
</template>
<style scoped lang="scss">
.home-page { max-width: 1320px; padding: 0 44px; margin: auto; }
.home-hero { display: grid; grid-template-columns: .9fr 1.1fr; gap: 60px; align-items: center; padding: 72px 0 64px; }
.eyebrow { font: 12px/1.6 var(--doc-mono); letter-spacing: 1.8px; color: var(--doc-green); margin: 0; display: flex; align-items: center; gap: 10px; }
.eyebrow span { width: 6px; height: 6px; border-radius: 50%; background: var(--doc-green); }
h1 { font-size: clamp(38px, 4.4vw, 62px); font-weight: 650; line-height: 1.27; letter-spacing: -2.5px; margin: 27px 0 24px; }
h1 em { font-style: normal; color: var(--doc-green); }
.hero-description { color: var(--doc-muted); font-size: 15px; max-width: 360px; line-height: 1.95; }
.hero-actions { display: flex; gap: 12px; margin: 30px 0 26px; flex-wrap: wrap; }
.doc-button { display: inline-flex; align-items: center; justify-content: space-between; gap: 22px; padding: 13px 19px; border: 1px solid var(--doc-line); border-radius: 6px; font-size: 13px; color: var(--doc-ink); }
.doc-button.primary { color: white; background: var(--doc-green); border-color: var(--doc-green); }
.install-line { display: flex; gap: 16px; font: 12px var(--doc-mono); color: var(--doc-ink); }
.install-line span { color: var(--doc-muted); }
.hero-editor { background: #e9eee5; border: 1px solid #d5dfd0; border-radius: 11px; overflow: hidden; box-shadow: 0 22px 48px #2942230e; min-width: 0; }
.editor-caption { display: flex; gap: 12px; align-items: center; padding: 16px; font: 12px var(--doc-mono); color: var(--doc-muted); }
.editor-dots { color: #a3b09b; font-size: 8px; letter-spacing: 2px; }
.live-badge { margin-left: auto; color: var(--doc-green); font-size: 9px; }
.hero-canvas { margin: 0 13px; border-radius: 6px; overflow: hidden; }
.hero-tools { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px; }
.primary-tools { display: flex; align-items: center; gap: 4px; }
.primary-tools button { border: 0; background: transparent; border-radius: 4px; width: 31px; height: 30px; color: var(--doc-ink); font-size: 20px; }
.primary-tools button:hover { background: #d8e2d1; }
.tool-divider { height: 15px; border-left: 1px solid #becdb5; margin: 0 5px; }
.hero-image { padding: 0 16px 12px; }
.hero-image :deep(.demo-image-switch) { margin: 0; }
.hero-settings { border-top: 1px solid #d5dfd0; }
.hero-settings summary { padding: 12px 17px; font-size: 12px; cursor: pointer; color: var(--doc-green); }
.hero-settings summary span { float: right; }
.advanced-tools { padding: 12px 17px; display: flex; gap: 12px; flex-wrap: wrap; }
.advanced-tools :deep(.el-select) { width: 100%; }
.preview__max-side { display: flex; gap: 10px; align-items: center; font-size: 12px; }
.demo-settings-note { margin: 0; padding: 0 17px 13px; font-size: 12px; line-height: 1.7; color: var(--doc-muted); }
.capability-strip { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; border-block: 1px solid var(--doc-line); padding: 24px 0; font-size: 12px; }
.capability-strip span { color: var(--doc-muted); }
.capability-strip b { font-weight: 500; }
.home-section-heading { display: flex; justify-content: space-between; align-items: end; margin: 54px 0 25px; }
.home-section-heading h2, .home-learning h2 { font-size: 29px; font-weight: 550; letter-spacing: -.8px; margin: 13px 0 0; }
.home-section-heading > a { font-size: 12px; }
.home-scenarios { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.scenario-tile { border: 1px solid var(--doc-line); border-radius: 8px; overflow: hidden; background: white; transition: transform .18s; }
.scenario-tile:hover { transform: translateY(-3px); }
.scenario-art { height: 185px; display: flex; align-items: center; justify-content: center; background: #e7eddf; }
.cover-art { background: #e4ebe5; }.product-art { background: #eeece1; }
.profile-mock { display: flex; gap: 17px; align-items: center; padding: 20px; background: #ffffffd9; border-radius: 8px; }
.profile-mock img { width: 64px; height: 64px; object-fit: cover; border-radius: 50%; }
.profile-mock i, .cover-mock i { display: block; height: 6px; width: 80px; background: #bac9b3; border-radius: 4px; margin: 11px 0; }
.profile-mock i:last-child { width: 50px; background: #d6dfce; }
.cover-mock { padding: 6px; background: white; width: 190px; transform: rotate(-4deg); border-radius: 5px; box-shadow: 0 10px 20px #2844200d; }
.cover-mock img { width: 100%; height: 85px; object-fit: cover; border-radius: 3px; }.cover-mock i { height: 4px; margin: 8px; }.cover-mock i:last-child { width: 120px; background: #d6dfce; }
.product-mock { width: 110px; height: 140px; background: white; padding: 6px 6px 25px; transform: rotate(6deg); border-radius: 4px; box-shadow: 0 10px 22px #28442016; }.product-mock img { width: 100%; height: 100%; object-fit: cover; }
.scenario-tile-body { padding: 23px; }.scenario-tile-body small { font: 12px var(--doc-mono); color: var(--doc-muted); letter-spacing: 1px; }.scenario-tile-body h3 { font-size: 17px; font-weight: 550; margin: 13px 0; }.scenario-tile-body h3 span { float: right; color: var(--doc-green); }.scenario-tile-body p { font-size: 13px; color: var(--doc-muted); line-height: 1.8; margin: 0; }
.home-learning { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; padding: 60px 0; margin-top: 60px; border-top: 1px solid var(--doc-line); }.home-learning p:not(.eyebrow) { font-size: 14px; line-height: 1.9; color: var(--doc-muted); margin: 20px 0 25px; }.learning-code { background: var(--doc-code); color: #d7e6c9; border-radius: 8px; overflow: hidden; min-width: 0; }.learning-code > div { padding: 16px 23px; border-bottom: 1px solid #344b3b; color: #b5c7aa; font: 12px var(--doc-mono); letter-spacing: 1px; }.learning-code pre { padding: 0 23px; font: 12px/2 var(--doc-mono); overflow: auto; margin: 20px 0; }
.home-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; border-top: 1px solid var(--doc-line); padding: 42px 0; }.home-features h3 { font-size: 15px; font-weight: 600; }.home-features p { color: var(--doc-muted); font-size: 13px; line-height: 1.8; }.feature-mark { color: var(--doc-green); }
.home-footer { border-top: 1px solid var(--doc-line); padding: 25px 0; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; font-size: 12px; color: var(--doc-muted); }.home-footer div { display: flex; gap: 20px; }
.export-dialog { display: grid; gap: 16px; }.export-actions { display: flex; gap: 10px; }.export-image { max-width: 100%; max-height: 70vh; object-fit: contain; }.export-result { text-align: center; }.export-hint { color: var(--doc-muted); }
@media(max-width:1050px) { .home-hero { gap: 30px; grid-template-columns: .9fr 1.1fr; }.home-page { padding: 0 28px; }h1 { font-size: 42px; }.home-learning { gap: 30px; }.scenario-tile-body { padding: 18px; } }
@media(max-width:800px) { .home-hero { grid-template-columns: 1fr; padding: 45px 0; gap: 35px; }.hero-description { max-width: 500px; }.home-scenarios { grid-template-columns: 1fr; }.scenario-art { height: 200px; }.home-learning { grid-template-columns: 1fr; gap: 30px; margin-top: 40px; padding: 40px 0; }.home-features { grid-template-columns: 1fr 1fr; gap: 25px; }.home-section-heading > a { display: none; }.capability-strip { justify-content: start; gap: 17px; }.capability-strip > span { width: 100%; } }
@media(max-width:480px) { .home-page { padding: 0 20px; }h1 { font-size: 39px; letter-spacing: -1.8px; }.hero-description { font-size: 14px; }.eyebrow { font-size: 9px; letter-spacing: 1.3px; }.home-features { grid-template-columns: 1fr; gap: 16px; }.hero-tools { padding: 12px 9px; }.primary-tools { gap: 0; }.primary-tools button { width: 27px; }.editor-caption { gap: 8px; font-size: 9px; }.live-badge { font-size: 8px; }.home-section-heading h2, .home-learning h2 { font-size: 25px; }.hero-actions { gap: 9px; }.doc-button { padding: 12px 15px; font-size: 12px; gap: 18px; } }
</style>
