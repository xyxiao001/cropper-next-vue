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
      :original="original"
      :max-side-length="maxSideLength"
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
      <el-button @click="reload">{{ labels.reload }}</el-button>
      <el-button @click="rotateLeft">{{ labels.rotateLeft }}</el-button>
      <el-button @click="rotateRight">{{ labels.rotateRight }}</el-button>
      <el-button @click="rotateClear">{{ labels.rotateClear }}</el-button>
    </section>

    <crop-export-panel
      :cropper="cropper"
      :display-width="displayCropLayout.width"
      :display-height="displayCropLayout.height"
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

      <section class="row">
        <el-switch v-model="original" :active-text="labels.original" />
      </section>

      <section class="row">
        <span class="row-label">{{ labels.maxSideLength }}</span>
        <el-input-number v-model="maxSideLength" :min="0" :max="12000" :step="100" controls-position="right" />
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

    <section class="group">
      <p class="group-title">{{ labels.methods }}</p>

      <section class="row">
        <span class="row-label">{{ labels.setRotateAngle }}</span>
        <el-input-number v-model="methodRotate" :min="0" :max="720" :step="1" controls-position="right" />
        <el-button @click="applyRotateAngle">{{ labels.apply }}</el-button>
      </section>

      <section class="row">
        <span class="row-label">{{ labels.setCropLayout }}</span>
        <input v-model="methodCropLayout.width" class="inline-input" :placeholder="labels.widthPlaceholder" />
        <input v-model="methodCropLayout.height" class="inline-input" :placeholder="labels.heightPlaceholder" />
        <el-button @click="applyCropLayout">{{ labels.apply }}</el-button>
      </section>
      <section class="row">
        <span class="hint">{{ labels.cropLayoutHint }}</span>
      </section>

      <section class="row">
        <span class="row-label">{{ labels.setCropAxis }}</span>
        <el-input-number v-model="methodCropAxis.x" :min="-9999" :max="9999" :step="1" controls-position="right" />
        <el-input-number v-model="methodCropAxis.y" :min="-9999" :max="9999" :step="1" controls-position="right" />
        <el-button @click="applyCropAxis">{{ labels.apply }}</el-button>
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
  const currentCropLayoutInput = ref({ width: 220, height: 220 })
  const methodRotate = ref(180)
  const methodCropLayout = ref({ width: '220', height: '220' })
  const methodCropAxis = ref({ x: 100, y: 100 })

  const color = ref('#ffffff')
  const cropColor = ref('#ffffff')

  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const original = ref(false)
  const maxSideLength = ref(3000)

  const mode = ref('cover')
  const defaultRotate = ref(0)
  const centerBox = ref(false)
  const centerWrapper = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapperDelay = ref(100)

  const filter = ref('none')
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
    original: 'Export with original ratio',
    maxSideLength: 'Max side length',
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
    methods: 'Methods',
    reload: 'Reload',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
    setRotateAngle: 'Set rotate angle',
    setCropLayout: 'Set crop layout',
    setCropAxis: 'Set crop axis',
    apply: 'Apply',
    widthPlaceholder: 'width',
    heightPlaceholder: 'height',
    cropLayoutHint: 'Supports 220, 220px, and 60%',
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
    original: '按原图比例导出',
    maxSideLength: '导出最长边',
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
    methods: '方法调用',
    reload: '重新加载',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    setRotateAngle: '设置旋转角度',
    setCropLayout: '设置截图框大小',
    setCropAxis: '设置截图框坐标',
    apply: '应用',
    widthPlaceholder: '宽度',
    heightPlaceholder: '高度',
    cropLayoutHint: '支持 220、220px、60%',
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
    { label: 'original', value: 'original' },
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

  watch(cropLayout, (val) => {
    currentCropLayoutInput.value = { ...val }
    methodCropLayout.value = {
      width: String(val.width),
      height: String(val.height),
    }
  }, { deep: true })

  const parseLength = (value, base = 0) => {
    if (typeof value === 'number') return value
    const normalized = String(value).trim()
    if (normalized.endsWith('%')) {
      const percent = Number.parseFloat(normalized)
      if (!Number.isFinite(percent) || base <= 0) return 0
      return (base * percent) / 100
    }
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const displayCropLayout = computed(() => {
    const width = parseLength(currentCropLayoutInput.value.width, wrapper.value.width)
    const height = parseLength(currentCropLayoutInput.value.height, wrapper.value.height)
    return {
      width: wrapper.value.width > 0 ? Math.min(width, wrapper.value.width) : width,
      height: wrapper.value.height > 0 ? Math.min(height, wrapper.value.height) : height,
    }
  })

  const normalizeRotate = (val) => {
    const r = ((val % 360) + 360) % 360
    return r
  }

  const reload = () => {
    cropper.value?.reload?.()
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

  const applyRotateAngle = () => {
    const angle = normalizeRotate(methodRotate.value)
    cropper.value?.setRotateAngle?.(angle)
    defaultRotate.value = angle
    methodRotate.value = angle
  }

  const applyCropLayout = () => {
    const layout = {
      width: methodCropLayout.value.width,
      height: methodCropLayout.value.height,
    }
    cropper.value?.setCropLayout?.(layout)
    currentCropLayoutInput.value = { ...layout }
  }

  const applyCropAxis = () => {
    cropper.value?.setCropAxis?.({
      x: methodCropAxis.value.x,
      y: methodCropAxis.value.y,
    })
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
  const currentCropLayoutInput = ref({ width: 220, height: 220 })
  const methodRotate = ref(180)
  const methodCropLayout = ref({ width: '220', height: '220' })
  const methodCropAxis = ref({ x: 100, y: 100 })

  const color = ref('#fff')
  const cropColor = ref('#ffffff')

  const outputType = ref('png')
  const outputSize = ref(1)
  const full = ref(true)
  const original = ref(false)
  const maxSideLength = ref(3000)

  const mode = ref('cover')
  const defaultRotate = ref(0)
  const centerBox = ref(false)
  const centerWrapper = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapperDelay = ref(100)

  const filter = ref('none')
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
    original: 'Export with original ratio',
    maxSideLength: 'Max side length',
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
    methods: 'Methods',
    reload: 'Reload',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
    setRotateAngle: 'Set rotate angle',
    setCropLayout: 'Set crop layout',
    setCropAxis: 'Set crop axis',
    apply: 'Apply',
    widthPlaceholder: 'width',
    heightPlaceholder: 'height',
    cropLayoutHint: 'Supports 220, 220px, and 60%',
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
    original: '按原图比例导出',
    maxSideLength: '导出最长边',
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
    methods: '方法调用',
    reload: '重新加载',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    setRotateAngle: '设置旋转角度',
    setCropLayout: '设置截图框大小',
    setCropAxis: '设置截图框坐标',
    apply: '应用',
    widthPlaceholder: '宽度',
    heightPlaceholder: '高度',
    cropLayoutHint: '支持 220、220px、60%',
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
    { label: 'original', value: 'original' },
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

  watch(cropLayout, (val) => {
    currentCropLayoutInput.value = { ...val }
    methodCropLayout.value = {
      width: String(val.width),
      height: String(val.height),
    }
  }, { deep: true })

  const parseLength = (value, base = 0) => {
    if (typeof value === 'number') return value
    const normalized = String(value).trim()
    if (normalized.endsWith('%')) {
      const percent = Number.parseFloat(normalized)
      if (!Number.isFinite(percent) || base <= 0) return 0
      return (base * percent) / 100
    }
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const displayCropLayout = computed(() => {
    const width = parseLength(currentCropLayoutInput.value.width, wrapper.value.width)
    const height = parseLength(currentCropLayoutInput.value.height, wrapper.value.height)
    return {
      width: wrapper.value.width > 0 ? Math.min(width, wrapper.value.width) : width,
      height: wrapper.value.height > 0 ? Math.min(height, wrapper.value.height) : height,
    }
  })

  const normalizeRotate = (val) => {
    const r = ((val % 360) + 360) % 360
    return r
  }

  const reload = () => {
    cropper.value?.reload?.()
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

  const applyRotateAngle = () => {
    const angle = normalizeRotate(methodRotate.value)
    cropper.value?.setRotateAngle?.(angle)
    defaultRotate.value = angle
    methodRotate.value = angle
  }

  const applyCropLayout = () => {
    const layout = {
      width: methodCropLayout.value.width,
      height: methodCropLayout.value.height,
    }
    cropper.value?.setCropLayout?.(layout)
    currentCropLayoutInput.value = { ...layout }
  }

  const applyCropAxis = () => {
    cropper.value?.setCropAxis?.({
      x: methodCropAxis.value.x,
      y: methodCropAxis.value.y,
    })
  }

  const handleImgLoad = (payload) => {
    imgLoadMessage.value = `${payload.type}: ${payload.message}`
  }
</script>

<style lang="scss" scoped>
  .full-demo {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(360px, 560px) minmax(420px, 1fr);
    align-items: start;
  }

  .left {
    position: sticky;
    top: 16px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(2, minmax(280px, 1fr));
    gap: 16px;
    align-items: start;
  }

  .group {
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 12px;
    background: #fafafa;
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
    min-width: 96px;
    color: #1d2129;
  }

  .hint {
    color: #86909c;
    font-size: 12px;
  }

  .select {
    width: 180px;
  }

  .inline-input {
    width: 84px;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #c9cdd4;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .sep {
    color: #86909c;
  }

  .loading {
    margin: 0;
    color: #86909c;
  }

  :deep(.el-input-number) {
    width: 140px;
  }

  :deep(.el-slider) {
    width: min(220px, 100%);
  }

  :deep(.el-switch) {
    max-width: 100%;
  }

  @media (max-width: 1160px) {
    .full-demo {
      grid-template-columns: minmax(300px, 520px) minmax(320px, 1fr);
    }

    .controls {
      grid-template-columns: 1fr;
    }

    .left {
      position: static;
    }
  }

  @media (max-width: 860px) {
    .full-demo {
      grid-template-columns: 1fr;
    }

    .controls {
      grid-template-columns: 1fr;
    }

    .left {
      position: static;
    }
  }
</style>
