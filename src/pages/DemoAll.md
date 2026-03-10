<LangBlock lang="zh">

# 全功能配置页

这个页面把常用的 props、旋转方法、导出结果统一放在一起，方便做“配置驱动”的验证。

</LangBlock>

<LangBlock lang="en">

# Full Configuration

This page groups commonly used props, rotation methods, and export results into one place for configuration-driven testing.

</LangBlock>

:::demo
```html
<section class="full-demo">
  <section class="left">
    <vue-cropper
      ref="cropper"
      :img="img"
      :wrapper="wrapper"
      :crop-layout="cropLayout"
      :color="color"
      :filter="filterFunc"
      :output-type="outputType"
      :output-size="outputSize"
      :full="full"
      :mode="mode"
      :crop-color="cropColor"
      :default-rotate="defaultRotate"
      :center-box="centerBox"
      :center-wrapper="centerWrapper"
      :center-box-delay="centerBoxDelay"
      :center-wrapper-delay="centerWrapperDelay"
      @img-load="handleImgLoad"
    >
      <template #loading>
        <p class="loading">{{ labels.loading }}</p>
      </template>
    </vue-cropper>
    <demo-image-switch v-model="img" />
    <section class="actions">
      <el-button @click="rotateLeft">{{ labels.rotateLeft }}</el-button>
      <el-button @click="rotateRight">{{ labels.rotateRight }}</el-button>
      <el-button @click="rotateClear">{{ labels.rotateClear }}</el-button>
    </section>

    <crop-export-panel
      :cropper="cropper"
      :display-width="cropLayout.width"
      :display-height="cropLayout.height"
    />
  </section>

  <section class="controls">
    <section class="group">
      <p class="group-title">{{ labels.image }}</p>
      <p class="row">{{ labels.imgLoadStatus }}: {{ imgLoadMessage }}</p>
    </section>

    <section class="group">
      <p class="group-title">{{ labels.layout }}</p>

      <section class="row">
        <span class="row-label">{{ labels.wrapperWidth }}</span>
        <el-input-number v-model="wrapper.width" :min="100" :max="900" :step="10" controls-position="right" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.wrapperHeight }}</span>
        <el-input-number v-model="wrapper.height" :min="100" :max="900" :step="10" controls-position="right" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.cropLayoutWidth }}</span>
        <el-input-number v-model="cropLayout.width" :min="80" :max="600" :step="10" controls-position="right" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.cropLayoutHeight }}</span>
        <el-input-number v-model="cropLayout.height" :min="80" :max="600" :step="10" controls-position="right" />
      </section>
    </section>

    <section class="group">
      <p class="group-title">{{ labels.export }}</p>

      <section class="row">
        <span class="row-label">{{ labels.outputType }}</span>
        <el-select v-model="outputType" :teleported="false" class="select">
          <el-option v-for="item in outputTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </section>

      <section class="row">
        <span class="row-label">{{ labels.outputSize }}: {{ outputSize }}</span>
        <el-slider v-model="outputSize" :min="0.1" :max="1" :step="0.1" />
      </section>

      <section class="row">
        <el-switch v-model="full" :active-text="labels.full" />
      </section>
    </section>

    <section class="group">
      <p class="group-title">{{ labels.behavior }}</p>

      <section class="row">
        <span class="row-label">{{ labels.mode }}</span>
        <el-select v-model="mode" :teleported="false" class="select">
          <el-option v-for="item in modeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </section>

      <section class="row">
        <el-switch v-model="centerBox" :active-text="labels.centerBox" />
        <span class="hint">{{ labels.rebound }} {{ centerBoxDelay }}ms</span>
      </section>
      <section class="row">
        <el-slider v-model="centerBoxDelay" :min="0" :max="1000" :step="50" />
      </section>

      <section class="row">
        <el-switch v-model="centerWrapper" :active-text="labels.centerWrapper" />
        <span class="hint">{{ labels.rebound }} {{ centerWrapperDelay }}ms</span>
      </section>
      <section class="row">
        <el-slider v-model="centerWrapperDelay" :min="0" :max="1000" :step="50" />
      </section>
    </section>

    <section class="group">
      <p class="group-title">{{ labels.visual }}</p>

      <section class="row">
        <span class="row-label">{{ labels.themeColor }}</span>
        <input type="color" v-model="color" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.cropColor }}</span>
        <input type="color" v-model="cropColor" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.filter }}</span>
        <el-select v-model="filter" :teleported="false" class="select">
          <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </section>

      <section class="row">
        <span class="row-label">{{ labels.rotation }}: {{ defaultRotate }}°</span>
        <el-slider v-model="defaultRotate" :min="0" :max="360" :step="1" />
      </section>
    </section>
  </section>
</section>
```

```js
<script setup>
  import { computed, ref, watch } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const imgLoadMessage = ref('-')

  const wrapper = ref({ width: 420, height: 420 })
  const cropLayout = ref({ width: 220, height: 220 })

  const color = ref('#ffffff')
  const cropColor = ref('#ffffff')

  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)

  const mode = ref('cover')
  const defaultRotate = ref(0)
  const centerBox = ref(false)
  const centerWrapper = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapperDelay = ref(100)

  const filter = ref('grayscale')
  const { isEn } = useLocale()

  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    image: 'Image',
    imgLoadStatus: 'Load status',
    layout: 'Layout',
    wrapperWidth: 'Wrapper width',
    wrapperHeight: 'Wrapper height',
    cropLayoutWidth: 'Crop layout width',
    cropLayoutHeight: 'Crop layout height',
    export: 'Export',
    outputType: 'Output type',
    outputSize: 'Output quality',
    full: 'High-DPI export',
    behavior: 'Behavior',
    mode: 'Mode',
    centerBox: 'centerBox',
    centerWrapper: 'centerWrapper',
    rebound: 'Rebound',
    visual: 'Visual',
    themeColor: 'Theme color',
    cropColor: 'Crop-box color',
    filter: 'Filter',
    rotation: 'Rotation',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
  } : {
    loading: '加载中...',
    image: '图片',
    imgLoadStatus: '加载状态',
    layout: '布局',
    wrapperWidth: '容器宽度',
    wrapperHeight: '容器高度',
    cropLayoutWidth: '截图框宽度',
    cropLayoutHeight: '截图框高度',
    export: '导出',
    outputType: '输出格式',
    outputSize: '输出质量',
    full: '高分屏导出',
    behavior: '行为',
    mode: '布局模式',
    centerBox: '图片限制截图框内',
    centerWrapper: '图片限制容器内',
    rebound: '回弹时长',
    visual: '视觉',
    themeColor: '主题色',
    cropColor: '截图框颜色',
    filter: '滤镜',
    rotation: '旋转角度',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
  })

  const outputTypeOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'jpg', value: 'jpg' },
    { label: 'webp', value: 'webp' },
  ])

  const modeOptions = computed(() => [
    { label: 'cover', value: 'cover' },
    { label: 'contain', value: 'contain' },
    { label: 'default', value: 'default' },
  ])

  const filterOptions = computed(() => isEn.value ? [
    { label: 'None', value: 'none' },
    { label: 'Grayscale', value: 'grayscale' },
    { label: 'Black and white', value: 'bw' },
    { label: 'Old photo', value: 'old' },
  ] : [
    { label: '无滤镜', value: 'none' },
    { label: '灰度滤镜', value: 'grayscale' },
    { label: '黑白滤镜', value: 'bw' },
    { label: '老照片滤镜', value: 'old' },
  ])

  const filterFunc = computed(() => {
    if (filter.value === 'none') return null
    if (filter.value === 'grayscale') return grayscale
    if (filter.value === 'bw') return blackAndWhite
    if (filter.value === 'old') return oldPhoto
    return null
  })

  watch(centerBox, (val) => {
    if (val) centerWrapper.value = false
  })
  watch(centerWrapper, (val) => {
    if (val) centerBox.value = false
  })

  const normalizeRotate = (val) => {
    const r = ((val % 360) + 360) % 360
    return r
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    defaultRotate.value = normalizeRotate(defaultRotate.value - 90)
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    defaultRotate.value = normalizeRotate(defaultRotate.value + 90)
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    defaultRotate.value = 0
  }

  const handleImgLoad = (payload) => {
    imgLoadMessage.value = `${payload.type}: ${payload.message}`
  }
</script>
```
:::

<script setup>
  import { computed, ref, watch } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const imgLoadMessage = ref('-')

  const wrapper = ref({ width: 420, height: 420 })
  const cropLayout = ref({ width: 220, height: 220 })

  const color = ref('#fff')
  const cropColor = ref('#ffffff')

  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)

  const mode = ref('cover')
  const defaultRotate = ref(0)
  const centerBox = ref(false)
  const centerWrapper = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapperDelay = ref(100)

  const filter = ref('grayscale')
  const { isEn } = useLocale()

  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    image: 'Image',
    imgLoadStatus: 'Load status',
    layout: 'Layout',
    wrapperWidth: 'Wrapper width',
    wrapperHeight: 'Wrapper height',
    cropLayoutWidth: 'Crop layout width',
    cropLayoutHeight: 'Crop layout height',
    export: 'Export',
    outputType: 'Output type',
    outputSize: 'Output quality',
    full: 'High-DPI export',
    behavior: 'Behavior',
    mode: 'Mode',
    centerBox: 'centerBox',
    centerWrapper: 'centerWrapper',
    rebound: 'Rebound',
    visual: 'Visual',
    themeColor: 'Theme color',
    cropColor: 'Crop-box color',
    filter: 'Filter',
    rotation: 'Rotation',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
  } : {
    loading: '加载中...',
    image: '图片',
    imgLoadStatus: '加载状态',
    layout: '布局',
    wrapperWidth: '容器宽度',
    wrapperHeight: '容器高度',
    cropLayoutWidth: '截图框宽度',
    cropLayoutHeight: '截图框高度',
    export: '导出',
    outputType: '输出格式',
    outputSize: '输出质量',
    full: '高分屏导出',
    behavior: '行为',
    mode: '布局模式',
    centerBox: '图片限制截图框内',
    centerWrapper: '图片限制容器内',
    rebound: '回弹时长',
    visual: '视觉',
    themeColor: '主题色',
    cropColor: '截图框颜色',
    filter: '滤镜',
    rotation: '旋转角度',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
  })

  const outputTypeOptions = computed(() => [
    { label: 'png', value: 'png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'jpg', value: 'jpg' },
    { label: 'webp', value: 'webp' },
  ])

  const modeOptions = computed(() => [
    { label: 'cover', value: 'cover' },
    { label: 'contain', value: 'contain' },
    { label: 'default', value: 'default' },
  ])

  const filterOptions = computed(() => isEn.value ? [
    { label: 'None', value: 'none' },
    { label: 'Grayscale', value: 'grayscale' },
    { label: 'Black and white', value: 'bw' },
    { label: 'Old photo', value: 'old' },
  ] : [
    { label: '无滤镜', value: 'none' },
    { label: '灰度滤镜', value: 'grayscale' },
    { label: '黑白滤镜', value: 'bw' },
    { label: '老照片滤镜', value: 'old' },
  ])

  const filterFunc = computed(() => {
    if (filter.value === 'none') return null
    if (filter.value === 'grayscale') return grayscale
    if (filter.value === 'bw') return blackAndWhite
    if (filter.value === 'old') return oldPhoto
    return null
  })

  watch(centerBox, (val) => {
    if (val) centerWrapper.value = false
  })
  watch(centerWrapper, (val) => {
    if (val) centerBox.value = false
  })

  const normalizeRotate = (val) => {
    const r = ((val % 360) + 360) % 360
    return r
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    defaultRotate.value = normalizeRotate(defaultRotate.value - 90)
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    defaultRotate.value = normalizeRotate(defaultRotate.value + 90)
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    defaultRotate.value = 0
  }

  const handleImgLoad = (payload) => {
    imgLoadMessage.value = `${payload.type}: ${payload.message}`
  }
</script>

<style lang="scss" scoped>
  .full-demo {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(260px, 520px) minmax(260px, 1fr);
    align-items: start;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  .controls {
    border: 1px solid #e5e6eb;
    border-radius: 12px;
    padding: 16px;
    background: #fafafa;
  }

  .group {
    padding: 12px 0;
    border-bottom: 1px solid #e5e6eb;
  }

  .group:last-child {
    border-bottom: 0;
  }

  .group-title {
    margin: 0 0 12px;
    font-weight: 600;
  }

  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 10px 0 0;
    color: #4e5969;
  }

  .row-label {
    min-width: 110px;
    color: #1d2129;
  }

  .hint {
    color: #86909c;
    font-size: 12px;
  }

  .select {
    width: 220px;
  }

  .sep {
    color: #86909c;
  }

  .loading {
    margin: 0;
    color: #86909c;
  }

  @media (max-width: 860px) {
    .full-demo {
      grid-template-columns: 1fr;
    }
  }
</style>
