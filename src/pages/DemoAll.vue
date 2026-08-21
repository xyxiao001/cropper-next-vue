<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { grayscale, blackAndWhite, oldPhoto } from '../../lib/filters/index'
import { useLocale } from '../composables/useLocale'
import { imageList } from '../utils/image'

const { isEn } = useLocale()
const cropper = ref<any>()
const img = ref(imageList[3])
const activePanel = ref('edit')
const imgLoadMessage = ref('-')
const cropState = ref<any>(null)
const cropCoordinates = ref<any>(null)

const cropWidth = ref(66)
const cropHeight = ref(66)
const cropLayout = computed(() => ({
  width: `${cropWidth.value}%`,
  height: `${cropHeight.value}%`,
}))
const wrapper = { width: '100%', height: '100%' }

const mode = ref('cover')
const movable = ref(true)
const zoomable = ref(true)
const zoomAnchor = ref<'center' | 'pointer'>('pointer')
const minScale = ref(0.01)
const maxScale = ref(4)
const centerBox = ref(false)
const centerWrapper = ref(false)
const centerBoxDelay = ref(100)
const centerWrapperDelay = ref(100)

const outputType = ref('webp')
const outputSize = ref(0.9)
const full = ref(true)
const original = ref(false)
const maxSideLength = ref(3000)
const previewMaxSide = ref(2048)

const color = ref('#ffffff')
const cropColor = ref('#ffffff')
const filter = ref('none')
const defaultRotate = ref(0)

const methodRotate = ref(90)
const methodCropLayout = ref({ width: '320', height: '320' })
const methodCropAxis = ref({ x: 50, y: 50 })

const labels = computed(() => isEn.value ? {
  title: 'Full-featured workspace',
  description: 'A focused editor for testing image operations, component props, export, and geometry data.',
  image: 'Image',
  reload: 'Reload',
  reset: 'Reset',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  rotateClear: 'Clear rotation',
  flipHorizontal: 'Flip horizontal',
  flipVertical: 'Flip vertical',
  edit: 'Adjust',
  export: 'Export',
  methods: 'Methods',
  data: 'Data',
  layout: 'Crop layout',
  cropWidth: 'Crop width',
  cropHeight: 'Crop height',
  behavior: 'Interaction',
  mode: 'Layout mode',
  movable: 'Allow dragging',
  zoomable: 'Allow interactive zoom',
  zoomAtPointer: 'Zoom at pointer / touch center',
  minScale: 'Minimum scale',
  maxScale: 'Maximum scale',
  boundary: 'Boundary',
  centerBox: 'Keep crop box covered',
  centerWrapper: 'Keep wrapper covered',
  delay: 'Rebound duration',
  visual: 'Appearance',
  themeColor: 'Theme color',
  filter: 'Filter',
  cropColor: 'Crop color',
  rotation: 'Default rotation',
  outputType: 'Output type',
  outputSize: 'Output quality',
  full: 'High-DPI export',
  original: 'Export with original ratio',
  maxSideLength: 'Export max side',
  previewMaxSide: 'Preview max side',
  setRotateAngle: 'Set rotation angle',
  setCropLayout: 'Set crop size',
  setCropAxis: 'Set crop position',
  apply: 'Apply',
  readCoordinates: 'Refresh source coordinates',
  state: 'Crop state',
  coordinates: 'Source crop coordinates',
  loadStatus: 'Load status',
  scale: 'Scale',
  rotate: 'Rotate',
  crop: 'Crop',
  source: 'Source',
  noFilter: 'No filter',
  grayscale: 'Grayscale',
  blackAndWhite: 'Black & white',
  oldPhoto: 'Old photo',
} : {
  title: '全功能工作台',
  description: '围绕大画布集中验证图片操作、组件参数、导出结果和原图几何数据。',
  image: '图片',
  reload: '重新加载',
  reset: '重置',
  zoomOut: '缩小',
  zoomIn: '放大',
  rotateLeft: '左转',
  rotateRight: '右转',
  rotateClear: '清除旋转',
  flipHorizontal: '水平翻转',
  flipVertical: '垂直翻转',
  edit: '调整',
  export: '导出',
  methods: '方法',
  data: '数据',
  layout: '裁剪布局',
  cropWidth: '裁剪框宽度',
  cropHeight: '裁剪框高度',
  behavior: '交互行为',
  mode: '布局模式',
  movable: '允许拖拽',
  zoomable: '允许交互缩放',
  zoomAtPointer: '以鼠标/双指中心缩放',
  minScale: '最小缩放比例',
  maxScale: '最大缩放比例',
  boundary: '边界限制',
  centerBox: '覆盖裁剪框',
  centerWrapper: '覆盖容器',
  delay: '回弹时长',
  visual: '外观',
  themeColor: '主题色',
  filter: '滤镜',
  cropColor: '裁剪框颜色',
  rotation: '默认旋转角度',
  outputType: '输出格式',
  outputSize: '输出质量',
  full: '高分屏导出',
  original: '按原图比例导出',
  maxSideLength: '导出最长边',
  previewMaxSide: '预览最长边',
  setRotateAngle: '设置旋转角度',
  setCropLayout: '设置裁剪框大小',
  setCropAxis: '设置裁剪框坐标',
  apply: '应用',
  readCoordinates: '刷新原图坐标',
  state: '裁剪状态',
  coordinates: '原图裁剪坐标',
  loadStatus: '加载状态',
  scale: '缩放',
  rotate: '旋转',
  crop: '裁剪框',
  source: '原图',
  noFilter: '无滤镜',
  grayscale: '灰度',
  blackAndWhite: '黑白',
  oldPhoto: '老照片',
})

const modeOptions = [
  { label: 'cover', value: 'cover' },
  { label: 'contain', value: 'contain' },
  { label: 'original', value: 'original' },
  { label: 'default', value: 'default' },
]

const outputTypeOptions = ['png', 'jpeg', 'jpg', 'webp']
const filterOptions = computed(() => [
  { label: labels.value.noFilter, value: 'none' },
  { label: labels.value.grayscale, value: 'grayscale' },
  { label: labels.value.blackAndWhite, value: 'bw' },
  { label: labels.value.oldPhoto, value: 'old' },
])
const boundaryOptions = computed(() => isEn.value ? [
  { label: 'None', value: 'none' },
  { label: 'Crop', value: 'box' },
  { label: 'Wrapper', value: 'wrapper' },
] : [
  { label: '无', value: 'none' },
  { label: '裁剪框', value: 'box' },
  { label: '容器', value: 'wrapper' },
])
const filterFunc = computed(() => {
  if (filter.value === 'grayscale') return grayscale
  if (filter.value === 'bw') return blackAndWhite
  if (filter.value === 'old') return oldPhoto
  return null
})

const displayCropWidth = computed(() => cropState.value?.crop?.width ?? 0)
const displayCropHeight = computed(() => cropState.value?.crop?.height ?? 0)
const stateText = computed(() => cropState.value ? JSON.stringify(cropState.value, null, 2) : '-')
const coordinatesText = computed(() => cropCoordinates.value ? JSON.stringify(cropCoordinates.value, null, 2) : '-')
const statusText = computed(() => {
  const image = cropState.value?.image
  if (!image) return '-'
  return `${labels.value.scale} ${Number(image.scale).toFixed(2)} · ${labels.value.rotate} ${image.rotate}° · flipX ${image.flipX} · flipY ${image.flipY}`
})
const geometryText = computed(() => {
  const crop = cropState.value?.crop
  const source = cropCoordinates.value?.source
  if (!crop) return '-'
  const cropText = `${labels.value.crop} ${Math.round(crop.width)} × ${Math.round(crop.height)}`
  return source ? `${cropText} · ${labels.value.source} ${source.width} × ${source.height}` : cropText
})

const syncCoordinates = () => {
  cropCoordinates.value = cropper.value?.getCropCoordinates?.() ?? null
}

const handleChange = (payload: unknown) => {
  cropState.value = payload
  syncCoordinates()
}

const handleImgLoad = (payload: { type: string, message: string }) => {
  imgLoadMessage.value = `${payload.type}: ${payload.message}`
}

const setBoundary = (value: 'none' | 'box' | 'wrapper') => {
  centerBox.value = value === 'box'
  centerWrapper.value = value === 'wrapper'
}

const boundaryMode = computed({
  get: () => centerBox.value ? 'box' : centerWrapper.value ? 'wrapper' : 'none',
  set: (value: 'none' | 'box' | 'wrapper') => setBoundary(value),
})

const applyCropLayout = () => {
  cropper.value?.setCropLayout?.({ ...methodCropLayout.value })
}

const applyCropAxis = () => {
  cropper.value?.setCropAxis?.({ ...methodCropAxis.value })
}

watch([centerBox, centerWrapper], () => syncCoordinates())
</script>

<template>
  <section class="workspace-page">
    <header class="page-intro">
      <div>
        <h1>{{ labels.title }}</h1>
        <p>{{ labels.description }}</p>
      </div>
      <demo-image-switch v-model="img" />
    </header>

    <section class="editor-shell">
      <header class="editor-toolbar">
        <section class="toolbar-group">
          <el-button size="small" @click="cropper?.zoomOut?.()">{{ labels.zoomOut }}</el-button>
          <el-button size="small" @click="cropper?.zoomIn?.()">{{ labels.zoomIn }}</el-button>
        </section>
        <span class="toolbar-divider" />
        <section class="toolbar-group">
          <el-button size="small" @click="cropper?.rotateLeft?.()">{{ labels.rotateLeft }}</el-button>
          <el-button size="small" @click="cropper?.rotateRight?.()">{{ labels.rotateRight }}</el-button>
          <el-button size="small" @click="cropper?.rotateClear?.()">{{ labels.rotateClear }}</el-button>
        </section>
        <span class="toolbar-divider" />
        <section class="toolbar-group">
          <el-button size="small" @click="cropper?.flipHorizontal?.()">{{ labels.flipHorizontal }}</el-button>
          <el-button size="small" @click="cropper?.flipVertical?.()">{{ labels.flipVertical }}</el-button>
        </section>
        <span class="toolbar-spacer" />
        <section class="toolbar-group">
          <el-button size="small" @click="cropper?.reload?.()">{{ labels.reload }}</el-button>
          <el-button size="small" type="primary" plain @click="cropper?.reset?.()">{{ labels.reset }}</el-button>
        </section>
      </header>

      <section class="editor-body">
        <section class="stage">
          <vue-cropper
            ref="cropper"
            :img="img"
            :wrapper="wrapper"
            :crop-layout="cropLayout"
            :mode="mode"
            :movable="movable"
            :zoomable="zoomable"
            :zoom-anchor="zoomAnchor"
            :min-scale="minScale"
            :max-scale="maxScale"
            :center-box="centerBox"
            :center-wrapper="centerWrapper"
            :center-box-delay="centerBoxDelay"
            :center-wrapper-delay="centerWrapperDelay"
            :output-type="outputType"
            :output-size="outputSize"
            :full="full"
            :original="original"
            :max-side-length="maxSideLength"
            :preview-max-side="previewMaxSide"
            :color="color"
            :crop-color="cropColor"
            :filter="filterFunc"
            :default-rotate="defaultRotate"
            @img-load="handleImgLoad"
            @change="handleChange"
          />
        </section>

        <aside class="inspector">
          <el-tabs v-model="activePanel" stretch>
            <el-tab-pane :label="labels.edit" name="edit">
              <section class="inspector-section">
                <h2>{{ labels.layout }}</h2>
                <label class="slider-field">
                  <span>{{ labels.cropWidth }} <b>{{ cropWidth }}%</b></span>
                  <el-slider v-model="cropWidth" :min="20" :max="100" />
                </label>
                <label class="slider-field">
                  <span>{{ labels.cropHeight }} <b>{{ cropHeight }}%</b></span>
                  <el-slider v-model="cropHeight" :min="20" :max="100" />
                </label>
              </section>

              <section class="inspector-section">
                <h2>{{ labels.behavior }}</h2>
                <label class="field-row">
                  <span>{{ labels.mode }}</span>
                  <el-select v-model="mode" :teleported="false">
                    <el-option v-for="item in modeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </label>
                <label class="switch-row"><span>{{ labels.movable }}</span><el-switch v-model="movable" /></label>
                <label class="switch-row"><span>{{ labels.zoomable }}</span><el-switch v-model="zoomable" /></label>
                <label class="switch-row"><span>{{ labels.zoomAtPointer }}</span><el-switch v-model="zoomAnchor" active-value="pointer" inactive-value="center" /></label>
                <section class="dual-field">
                  <label><span>{{ labels.minScale }}</span><el-input-number v-model="minScale" :min="0.01" :max="10" :step="0.1" /></label>
                  <label><span>{{ labels.maxScale }}</span><el-input-number v-model="maxScale" :min="0.01" :max="10" :step="0.1" /></label>
                </section>
              </section>

              <section class="inspector-section">
                <h2>{{ labels.boundary }}</h2>
                <el-segmented v-model="boundaryMode" :options="boundaryOptions" />
                <label v-if="centerBox" class="field-row"><span>{{ labels.delay }}</span><el-input-number v-model="centerBoxDelay" :min="0" :max="1000" :step="50" /></label>
                <label v-if="centerWrapper" class="field-row"><span>{{ labels.delay }}</span><el-input-number v-model="centerWrapperDelay" :min="0" :max="1000" :step="50" /></label>
              </section>

              <section class="inspector-section">
                <h2>{{ labels.visual }}</h2>
                <label class="field-row"><span>{{ labels.filter }}</span><el-select v-model="filter" :teleported="false"><el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></label>
                <label class="field-row"><span>{{ labels.themeColor }}</span><input v-model="color" type="color" /></label>
                <label class="field-row"><span>{{ labels.cropColor }}</span><input v-model="cropColor" type="color" /></label>
                <label class="slider-field"><span>{{ labels.rotation }} <b>{{ defaultRotate }}°</b></span><el-slider v-model="defaultRotate" :min="0" :max="360" /></label>
              </section>
            </el-tab-pane>

            <el-tab-pane :label="labels.export" name="export">
              <section class="inspector-section">
                <label class="field-row"><span>{{ labels.outputType }}</span><el-select v-model="outputType" :teleported="false"><el-option v-for="item in outputTypeOptions" :key="item" :label="item" :value="item" /></el-select></label>
                <label class="slider-field"><span>{{ labels.outputSize }} <b>{{ outputSize }}</b></span><el-slider v-model="outputSize" :min="0.1" :max="1" :step="0.1" /></label>
                <label class="switch-row"><span>{{ labels.full }}</span><el-switch v-model="full" /></label>
                <label class="switch-row"><span>{{ labels.original }}</span><el-switch v-model="original" /></label>
                <label class="field-row"><span>{{ labels.maxSideLength }}</span><el-input-number v-model="maxSideLength" :min="0" :max="12000" :step="100" /></label>
                <label class="field-row"><span>{{ labels.previewMaxSide }}</span><el-input-number v-model="previewMaxSide" :min="0" :max="12000" :step="100" /></label>
              </section>
              <crop-export-panel :cropper="cropper" :display-width="displayCropWidth" :display-height="displayCropHeight" />
            </el-tab-pane>

            <el-tab-pane :label="labels.methods" name="methods">
              <section class="inspector-section method-list">
                <label class="method-row"><span>{{ labels.setRotateAngle }}</span><el-input-number v-model="methodRotate" :min="0" :max="720" /><el-button @click="cropper?.setRotateAngle?.(methodRotate)">{{ labels.apply }}</el-button></label>
                <label class="method-row method-row--wide"><span>{{ labels.setCropLayout }}</span><input v-model="methodCropLayout.width" /><input v-model="methodCropLayout.height" /><el-button @click="applyCropLayout">{{ labels.apply }}</el-button></label>
                <label class="method-row method-row--wide"><span>{{ labels.setCropAxis }}</span><el-input-number v-model="methodCropAxis.x" /><el-input-number v-model="methodCropAxis.y" /><el-button @click="applyCropAxis">{{ labels.apply }}</el-button></label>
                <el-button @click="syncCoordinates">{{ labels.readCoordinates }}</el-button>
              </section>
            </el-tab-pane>

            <el-tab-pane :label="labels.data" name="data">
              <section class="data-panel">
                <div class="data-heading"><h2>{{ labels.state }}</h2><span>{{ labels.loadStatus }}: {{ imgLoadMessage }}</span></div>
                <pre>{{ stateText }}</pre>
                <div class="data-heading"><h2>{{ labels.coordinates }}</h2><el-button size="small" @click="syncCoordinates">{{ labels.readCoordinates }}</el-button></div>
                <pre>{{ coordinatesText }}</pre>
              </section>
            </el-tab-pane>
          </el-tabs>
        </aside>
      </section>

      <footer class="status-bar">
        <span>{{ statusText }}</span>
        <span>{{ geometryText }}</span>
      </footer>
    </section>
  </section>
</template>

<style scoped lang="scss">
.workspace-page {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 16px 20px 20px;
  color: #24364b;
}

.page-intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.page-intro h1 {
  margin: 0;
  color: #24364b;
  font-size: 26px;
  font-weight: 650;
  line-height: 1.25;
}

.page-intro p {
  margin: 4px 0 0;
  color: #748296;
  font-size: 13px;
}

.editor-shell {
  display: grid;
  grid-template-rows: 46px minmax(0, 1fr) 34px;
  min-height: 560px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(31, 50, 73, 0.08);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-bottom: 1px solid #e8edf2;
  background: #fbfcfd;
}

.toolbar-group {
  display: flex;
  gap: 6px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #dfe5ec;
}

.toolbar-spacer {
  flex: 1;
}

.editor-body {
  display: grid;
  grid-template-columns: minmax(520px, 1fr) 360px;
  min-height: 0;
}

.stage {
  min-width: 0;
  min-height: 0;
  padding: 16px;
  background:
    radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.9), transparent 48%),
    linear-gradient(145deg, #eef2f7, #e6ebf2);
}

.stage :deep(.vue-cropper) {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(32, 48, 68, 0.16);
}

.inspector {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-left: 1px solid #e4e9ef;
  background: #fff;
}

.inspector :deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.inspector :deep(.el-tabs__header) {
  flex: none;
  margin: 0;
  padding: 0 10px;
}

.inspector :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background: #edf0f3;
}

.inspector :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 4px 14px 16px;
}

.inspector-section {
  padding: 12px 0;
  border-bottom: 1px solid #eef1f4;
}

.inspector-section:last-child {
  border-bottom: 0;
}

.inspector-section h2,
.data-heading h2 {
  margin: 0 0 10px;
  color: #26384d;
  font-size: 13px;
  font-weight: 650;
}

.field-row,
.switch-row,
.slider-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 34px;
  color: #536174;
  font-size: 12px;
}

.field-row :deep(.el-select),
.field-row :deep(.el-input-number) {
  width: 168px;
}

.slider-field {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: stretch;
  width: 100%;
}

.slider-field :deep(.el-slider) {
  width: 100%;
}

.slider-field > span {
  display: flex;
  justify-content: space-between;
}

.slider-field b {
  color: #2f78d1;
  font-weight: 600;
}

.dual-field {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.dual-field label {
  display: grid;
  gap: 5px;
  color: #536174;
  font-size: 12px;
}

.dual-field :deep(.el-input-number) {
  width: 100%;
}

.inspector :deep(.el-segmented) {
  width: 100%;
}

.method-list {
  display: grid;
  gap: 12px;
}

.method-row {
  display: grid;
  grid-template-columns: 1fr 110px auto;
  align-items: center;
  gap: 8px;
  color: #536174;
  font-size: 12px;
}

.method-row--wide {
  grid-template-columns: 1fr 72px 72px auto;
}

.method-row input {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.method-row :deep(.el-input-number) {
  width: 100%;
}

.data-panel {
  display: grid;
  gap: 10px;
  padding-top: 12px;
}

.data-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #8a96a6;
  font-size: 11px;
}

.data-heading h2 {
  margin: 0;
}

.data-panel pre {
  max-height: 210px;
  margin: 0;
  padding: 10px;
  overflow: auto;
  border-radius: 7px;
  background: #f5f7f9;
  color: #344054;
  font-size: 11px;
  line-height: 1.45;
}

.inspector :deep(.crop-export-panel) {
  margin-top: 14px;
}

.inspector :deep(.crop-export-panel .actions) {
  gap: 6px;
}

.inspector :deep(.crop-export-panel .result-image) {
  max-width: 100%;
  height: auto !important;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  padding: 0 12px;
  border-top: 1px solid #e8edf2;
  background: #fbfcfd;
  color: #748296;
  font-size: 11px;
  white-space: nowrap;
}

@media (max-width: 1080px) {
  .editor-body {
    grid-template-columns: minmax(440px, 1fr) 320px;
  }
}

@media (max-width: 860px) {
  .workspace-page {
    height: auto;
    padding: 12px;
  }

  .page-intro {
    align-items: start;
    flex-direction: column;
  }

  .editor-shell {
    min-height: 980px;
  }

  .editor-body {
    grid-template-columns: 1fr;
    grid-template-rows: 520px 1fr;
  }

  .inspector {
    border-top: 1px solid #e4e9ef;
    border-left: 0;
  }

  .editor-toolbar {
    overflow-x: auto;
  }
}
</style>
