<LangBlock lang="zh">

# 实时预览

这个页面展示当前版本最适合做业务联动的能力：

- `@real-time`
- `@realTime`
- `rotateLeft / rotateRight / rotateClear`

### 旋转方法和实时预览

</LangBlock>

<LangBlock lang="en">

# Realtime Preview

This page demonstrates the APIs that work best for live business integration:

- `@real-time`
- `@realTime`
- `rotateLeft / rotateRight / rotateClear`

### Rotation methods with realtime preview

</LangBlock>

:::demo
```html
<section class="demo-grid">
  <section>
    <vue-cropper
      ref="cropper"
      :img="img"
      :default-rotate="rotate"
      :wrapper="{ width: 480, height: 480 }"
      :crop-layout="{ width: 320, height: 320 }"
      center-box
      @real-time="handlePreview"
    ></vue-cropper>

    <demo-image-switch v-model="img" />

    <section class="actions">
      <el-button @click="rotateLeft">{{ labels.rotateLeft }}</el-button>
      <el-button @click="rotateRight">{{ labels.rotateRight }}</el-button>
      <el-button @click="rotateClear">{{ labels.rotateClear }}</el-button>
    </section>

    <crop-export-panel :cropper="cropper" :display-width="previews.w || 320" :display-height="previews.h || 320" />
  </section>

  <section class="preview">
    <p>{{ labels.currentRotation }}：{{ rotate }}°</p>
    <p>{{ labels.previewSize }}：{{ previews.w }} x {{ previews.h }}</p>
    <p>{{ labels.previewHint }}</p>
    <section class="preview-box">
      <section class="preview-grid">
        <section class="preview-item">
          <p class="preview-item-title">{{ labels.previewStyle1 }}</p>
          <section class="realtime-preview" :style="previewStyle1">
            <img
              v-if="previews.url"
              :src="previews.url"
              class="realtime-image"
              :style="previews.img"
              alt="realtime preview 1"
            />
          </section>
        </section>

        <section class="preview-item">
          <p class="preview-item-title">{{ labels.previewStyle2 }}</p>
          <section class="realtime-preview" :style="previewStyle2">
            <img
              v-if="previews.url"
              :src="previews.url"
              class="realtime-image"
              :style="previews.img"
              alt="realtime preview 2"
            />
          </section>
        </section>

        <section class="preview-item">
          <p class="preview-item-title">{{ labels.previewStyle3 }}</p>
          <section class="realtime-preview" :style="previewStyle3">
            <img
              v-if="previews.url"
              :src="previews.url"
              class="realtime-image"
              :style="previews.img"
              alt="realtime preview 3"
            />
          </section>
        </section>

        <section class="preview-item">
          <p class="preview-item-title">{{ labels.previewStyle4 }}</p>
          <section class="realtime-preview" :style="previewStyle4">
            <img
              v-if="previews.url"
              :src="previews.url"
              class="realtime-image"
              :style="previews.img"
              alt="realtime preview 4"
            />
          </section>
        </section>
      </section>
    </section>
  </section>
</section>
```

```js
<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'


  const cropper = ref()
  const img = ref('')
  const { isEn } = useLocale()
  const rotate = ref(0)
  const previews = reactive({
    w: 0,
    h: 0,
    url: '',
    img: {
      width: '0px',
      height: '0px',
      transform: '',
    },
  })
  const labels = computed(() => isEn.value ? {
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
    currentRotation: 'Current rotation',
    previewSize: 'Preview size',
    previewHint: 'The preview blocks below are rendered from real-time payload (CSS). No getCropData() is used for live preview.',
    previewStyle1: 'Preview style 1: zoom = 0.5 (50%)',
    previewStyle2: 'Preview style 2: zoom = 0.2 (20%)',
    previewStyle3: 'Preview style 3: fixed width = 100px',
    previewStyle4: 'Preview style 4: fixed height = 100px',
  } : {
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    currentRotation: '当前角度',
    previewSize: '预览尺寸',
    previewHint: '下面的预览块完全由 real-time payload 通过 CSS 渲染，不使用 getCropData() 做实时预览。',
    previewStyle1: '预览样式 1：zoom = 0.5（50%）',
    previewStyle2: '预览样式 2：zoom = 0.2（20%）',
    previewStyle3: '预览样式 3：固定宽度 100px',
    previewStyle4: '预览样式 4：固定高度 100px',
  })

  const getBasePreviewStyle = () => ({
    width: `${previews.w}px`,
    height: `${previews.h}px`,
    overflow: 'hidden',
    margin: '0',
  })

  // Keep the legacy `zoom` behavior for demo parity (works well in Chromium-based browsers).
  const previewStyle1 = computed(() => ({ ...getBasePreviewStyle(), zoom: 0.5 }))
  const previewStyle2 = computed(() => ({ ...getBasePreviewStyle(), zoom: 0.2 }))
  const previewStyle3 = computed(() => ({
    ...getBasePreviewStyle(),
    zoom: previews.w ? 100 / previews.w : 1,
  }))
  const previewStyle4 = computed(() => ({
    ...getBasePreviewStyle(),
    zoom: previews.h ? 100 / previews.h : 1,
  }))

  const handlePreview = (payload) => {
    previews.w = payload.w
    previews.h = payload.h
    previews.url = payload.url
    previews.img = payload.img
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }

</script>
```
:::

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const { isEn } = useLocale()
  const rotate = ref(0)
  const previews = reactive({
    w: 0,
    h: 0,
    url: '',
    img: {
      width: '0px',
      height: '0px',
      transform: '',
    },
  })
  const labels = computed(() => isEn.value ? {
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
    currentRotation: 'Current rotation',
    previewSize: 'Preview size',
    previewHint: 'The preview blocks below are rendered from real-time payload (CSS). No getCropData() is used for live preview.',
    previewStyle1: 'Preview style 1: zoom = 0.5 (50%)',
    previewStyle2: 'Preview style 2: zoom = 0.2 (20%)',
    previewStyle3: 'Preview style 3: fixed width = 100px',
    previewStyle4: 'Preview style 4: fixed height = 100px',
  } : {
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
    currentRotation: '当前角度',
    previewSize: '预览尺寸',
    previewHint: '下面的预览块完全由 real-time payload 通过 CSS 渲染，不使用 getCropData() 做实时预览。',
    previewStyle1: '预览样式 1：zoom = 0.5（50%）',
    previewStyle2: '预览样式 2：zoom = 0.2（20%）',
    previewStyle3: '预览样式 3：固定宽度 100px',
    previewStyle4: '预览样式 4：固定高度 100px',
  })

  const getBasePreviewStyle = () => ({
    width: `${previews.w}px`,
    height: `${previews.h}px`,
    overflow: 'hidden',
    margin: '0',
  })

  const previewStyle1 = computed(() => ({ ...getBasePreviewStyle(), zoom: 0.5 }))
  const previewStyle2 = computed(() => ({ ...getBasePreviewStyle(), zoom: 0.2 }))
  const previewStyle3 = computed(() => ({
    ...getBasePreviewStyle(),
    zoom: previews.w ? 100 / previews.w : 1,
  }))
  const previewStyle4 = computed(() => ({
    ...getBasePreviewStyle(),
    zoom: previews.h ? 100 / previews.h : 1,
  }))

  const handlePreview = (payload) => {
    previews.w = payload.w
    previews.h = payload.h
    previews.url = payload.url
    previews.img = payload.img
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }

</script>

<style lang="scss" scoped>
  .demo-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: start;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .preview {
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 12px;
    background: #fafafa;
  }

  .preview-box {
    margin-top: 12px;
  }

  .preview-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .preview-item-title {
    margin: 0 0 8px;
    font-size: 13px;
    color: #4e5969;
  }

  .realtime-preview {
    overflow: hidden;
    border: 1px solid #e5e6eb;
    background: #fff;
  }

  .realtime-image {
    display: block;
  }

  p {
    margin: 0 0 8px;
  }
</style>
