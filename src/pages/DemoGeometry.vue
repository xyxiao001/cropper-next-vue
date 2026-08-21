<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'

const { isEn } = useLocale()
const cropper = ref<any>()
const img = ref('')
const minScale = ref(0.4)
const maxScale = ref(2)
const zoomAnchor = ref<'center' | 'pointer'>('pointer')
const state = ref<unknown>(null)
const coordinates = ref<unknown>(null)

const wrapper = { width: '100%', height: 'min(420px, calc(100vw - 68px))' }
const cropLayout = { width: 260, height: 260 }

const labels = computed(() => isEn.value ? {
  title: 'Geometry Editing',
  description: 'Focused verification for zoom anchors, scale limits, flips, and source crop coordinates.',
  interaction: 'Interaction',
  minScale: 'Minimum scale',
  maxScale: 'Maximum scale',
  zoomAtPointer: 'Zoom at pointer / touch center',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  flipHorizontal: 'Flip horizontal',
  flipVertical: 'Flip vertical',
  reset: 'Reset',
  state: 'Crop state',
  coordinates: 'Source coordinates',
  boundaryHint: 'Boundary coverage takes priority when it requires a larger scale.',
} : {
  title: '几何编辑',
  description: '集中验证缩放锚点、缩放上下限、图片翻转和原图裁剪坐标。',
  interaction: '交互控制',
  minScale: '最小缩放比例',
  maxScale: '最大缩放比例',
  zoomAtPointer: '以鼠标/双指中心缩放',
  zoomIn: '放大',
  zoomOut: '缩小',
  flipHorizontal: '水平翻转',
  flipVertical: '垂直翻转',
  reset: '重置',
  state: '裁剪状态',
  coordinates: '原图裁剪坐标',
  boundaryHint: '边界覆盖需要更大比例时，边界规则优先。',
})

const stateText = computed(() => state.value ? JSON.stringify(state.value, null, 2) : '-')
const coordinatesText = computed(() => coordinates.value ? JSON.stringify(coordinates.value, null, 2) : '-')

const syncCoordinates = () => {
  coordinates.value = cropper.value?.getCropCoordinates?.() ?? null
}

const handleChange = (payload: unknown) => {
  state.value = payload
  syncCoordinates()
}
</script>

<template>
  <section class="geometry-page">
    <header class="page-intro">
      <h1>{{ labels.title }}</h1>
      <p>{{ labels.description }}</p>
    </header>

    <section class="geometry-demo">
      <section class="stage-column">
        <demo-image-switch v-model="img" />
        <vue-cropper
          ref="cropper"
          :img="img"
          :wrapper="wrapper"
          :crop-layout="cropLayout"
          :min-scale="minScale"
          :max-scale="maxScale"
          :zoom-anchor="zoomAnchor"
          @change="handleChange"
        />
      </section>

      <section class="control-column">
        <section class="panel">
          <h2>{{ labels.interaction }}</h2>
          <section class="field">
            <span>{{ labels.minScale }}</span>
            <el-input-number v-model="minScale" :min="0.01" :max="10" :step="0.1" />
          </section>
          <section class="field">
            <span>{{ labels.maxScale }}</span>
            <el-input-number v-model="maxScale" :min="0.01" :max="10" :step="0.1" />
          </section>
          <section class="field">
            <el-switch
              v-model="zoomAnchor"
              active-value="pointer"
              inactive-value="center"
              :active-text="labels.zoomAtPointer"
            />
          </section>
          <p class="hint">{{ labels.boundaryHint }}</p>
          <section class="actions">
            <el-button @click="cropper?.zoomIn?.()">{{ labels.zoomIn }}</el-button>
            <el-button @click="cropper?.zoomOut?.()">{{ labels.zoomOut }}</el-button>
            <el-button @click="cropper?.flipHorizontal?.()">{{ labels.flipHorizontal }}</el-button>
            <el-button @click="cropper?.flipVertical?.()">{{ labels.flipVertical }}</el-button>
            <el-button @click="cropper?.reset?.()">{{ labels.reset }}</el-button>
          </section>
        </section>

        <section class="result-grid">
          <section class="panel result-panel">
            <h2>{{ labels.state }}</h2>
            <pre>{{ stateText }}</pre>
          </section>
          <section class="panel result-panel">
            <h2>{{ labels.coordinates }}</h2>
            <pre>{{ coordinatesText }}</pre>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<style scoped lang="scss">
.geometry-page {
  width: 100%;
  padding: 24px 28px 32px;
  color: #34495e;
}

.page-intro h1 {
  margin: 0;
  color: #383838;
  font-size: 28px;
  line-height: 1.4;
}

.page-intro p {
  margin: 4px 0 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
}

.geometry-demo {
  display: grid;
  grid-template-columns: 420px minmax(480px, 1fr);
  gap: 16px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #e2ecf4;
  border-radius: 8px;
  background: #fff;
}

.stage-column,
.control-column {
  display: grid;
  gap: 10px;
  align-content: start;
  min-width: 0;
}

.panel {
  padding: 12px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  background: #fafafa;
}

.panel h2 {
  margin: 0 0 8px;
  color: #1d2129;
  font-size: 14px;
  font-weight: 600;
}

.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  color: #4e5969;
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.result-panel pre {
  max-height: 286px;
  margin: 0;
  padding: 8px;
  overflow: auto;
  border-radius: 6px;
  background: #f2f3f5;
  color: #1d2129;
  font-size: 11px;
  line-height: 1.45;
}

.hint {
  margin: 8px 0 0;
  color: #86909c;
  font-size: 12px;
}

@media (max-width: 1040px) {
  .geometry-demo {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .geometry-page {
    padding: 16px;
  }

  .geometry-demo {
    padding: 10px;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
