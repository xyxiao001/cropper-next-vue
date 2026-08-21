<LangBlock lang="zh">

# 截图框操作例子

这页用于单独验证裁剪框的外观、八方向缩放、固定比例和尺寸限制。拖动控制点时会显示九宫格，松手后自动渐隐。

### 裁剪框缩放与限制

</LangBlock>

<LangBlock lang="en">

# Crop Box Demo

This page focuses on crop-box appearance, eight-direction resizing, fixed ratios, and size constraints. The rule-of-thirds grid appears while dragging a handle and fades after release.

### Crop-box resizing and constraints

</LangBlock>

:::demo
```html
<vue-cropper 
  ref="cropper"
  :img="img"
  :crop-color="cropColor"
  :wrapper="wrapper"
  :crop-layout="cropLayout"
  :crop-box-resizable="cropBoxResizable"
  :crop-box-constraints-enabled="cropBoxConstraintsEnabled"
  :crop-aspect-ratio="cropAspectRatio"
  :min-crop-width="minCropWidth"
  :min-crop-height="minCropHeight"
  :max-crop-width="maxCropWidth"
  :max-crop-height="maxCropHeight"
  @change="handleChange"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<section class="control-panel">
  <label class="switch-row">
    <span>{{ labels.cropBoxResizable }}</span>
    <el-switch v-model="cropBoxResizable" />
  </label>
  <label class="switch-row">
    <span>{{ labels.cropBoxConstraintsEnabled }}</span>
    <el-switch v-model="cropBoxConstraintsEnabled" />
  </label>
  <label class="field-row">
    <span>{{ labels.cropAspectRatio }}</span>
    <el-select v-model="cropRatio" :teleported="false">
      <el-option v-for="item in ratioOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </label>
  <section class="size-grid">
    <label><span>{{ labels.minCropWidth }}</span><el-input-number v-model="minCropWidth" :controls="false" /></label>
    <label><span>{{ labels.maxCropWidth }}</span><el-input-number v-model="maxCropWidth" :controls="false" /></label>
    <label><span>{{ labels.minCropHeight }}</span><el-input-number v-model="minCropHeight" :controls="false" /></label>
    <label><span>{{ labels.maxCropHeight }}</span><el-input-number v-model="maxCropHeight" :controls="false" /></label>
  </section>
  <label class="field-row">
    <span>{{ labels.cropColor }}</span>
    <input type="color" v-model="cropColor" />
  </label>
  <p class="hint">{{ labels.hint }}</p>
  <p class="crop-state">{{ labels.currentCrop }}：{{ cropStateText }}</p>
</section>
<crop-export-panel :cropper="cropper" :display-width="displayCropWidth" :display-height="displayCropHeight" />
```

```js
<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const cropColor = ref('#ffffff')
  const wrapper = reactive({ width: '480px', height: '480px' })
  const cropLayout = reactive({ width: 320, height: 320 })
  const cropBoxResizable = ref(true)
  const cropBoxConstraintsEnabled = ref(false)
  const cropRatio = ref('free')
  const minCropWidth = ref(120)
  const minCropHeight = ref(90)
  const maxCropWidth = ref(320)
  const maxCropHeight = ref(240)
  const cropState = ref(null)
  const { isEn } = useLocale()
  const cropAspectRatio = computed(() => {
    if (cropRatio.value === '1:1') return 1
    if (cropRatio.value === '4:3') return 4 / 3
    if (cropRatio.value === '16:9') return 16 / 9
    return undefined
  })
  const ratioOptions = computed(() => [
    { label: labels.value.freeRatio, value: 'free' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '16:9', value: '16:9' },
  ])
  const cropStateText = computed(() => {
    const crop = cropState.value?.crop
    return crop ? `x ${crop.x.toFixed(1)} · y ${crop.y.toFixed(1)} · ${crop.width.toFixed(1)} × ${crop.height.toFixed(1)}` : '-'
  })
  const displayCropWidth = computed(() => cropState.value?.crop?.width ?? cropLayout.width)
  const displayCropHeight = computed(() => cropState.value?.crop?.height ?? cropLayout.height)
  const handleChange = (payload) => {
    cropState.value = payload
  }
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    cropBoxResizable: 'Allow crop-box resizing',
    cropBoxConstraintsEnabled: 'Enable ratio and size constraints',
    cropAspectRatio: 'Aspect ratio',
    freeRatio: 'Free',
    minCropWidth: 'Minimum width',
    minCropHeight: 'Minimum height',
    maxCropWidth: 'Maximum width',
    maxCropHeight: 'Maximum height',
    currentCrop: 'Current crop',
    hint: 'Enabling constraints at runtime applies the current limits and recenters the resulting crop box. Later limit changes preserve its position.',
  } : {
    cropColor: '修改截图框颜色',
    cropBoxResizable: '允许缩放裁剪框',
    cropBoxConstraintsEnabled: '启用比例和尺寸限制',
    cropAspectRatio: '裁剪框比例',
    freeRatio: '自由比例',
    minCropWidth: '最小宽度',
    minCropHeight: '最小高度',
    maxCropWidth: '最大宽度',
    maxCropHeight: '最大高度',
    currentCrop: '当前裁剪框',
    hint: '运行时开启限制会应用当前比例和尺寸范围，并将结果重新居中；限制开启后的参数变化会保留当前位置。',
  })
</script>
```
:::

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const cropColor = ref('#ffffff')
  const wrapper = reactive({ width: '480px', height: '480px' })
  const cropLayout = reactive({ width: 320, height: 320 })
  const cropBoxResizable = ref(true)
  const cropBoxConstraintsEnabled = ref(false)
  const cropRatio = ref('free')
  const minCropWidth = ref(120)
  const minCropHeight = ref(90)
  const maxCropWidth = ref(320)
  const maxCropHeight = ref(240)
  const cropState = ref(null)
  const { isEn } = useLocale()
  const cropAspectRatio = computed(() => {
    if (cropRatio.value === '1:1') return 1
    if (cropRatio.value === '4:3') return 4 / 3
    if (cropRatio.value === '16:9') return 16 / 9
    return undefined
  })
  const ratioOptions = computed(() => [
    { label: labels.value.freeRatio, value: 'free' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '16:9', value: '16:9' },
  ])
  const cropStateText = computed(() => {
    const crop = cropState.value?.crop
    return crop ? `x ${crop.x.toFixed(1)} · y ${crop.y.toFixed(1)} · ${crop.width.toFixed(1)} × ${crop.height.toFixed(1)}` : '-'
  })
  const displayCropWidth = computed(() => cropState.value?.crop?.width ?? cropLayout.width)
  const displayCropHeight = computed(() => cropState.value?.crop?.height ?? cropLayout.height)
  const handleChange = (payload) => {
    cropState.value = payload
  }
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    cropBoxResizable: 'Allow crop-box resizing',
    cropBoxConstraintsEnabled: 'Enable ratio and size constraints',
    cropAspectRatio: 'Aspect ratio',
    freeRatio: 'Free',
    minCropWidth: 'Minimum width',
    minCropHeight: 'Minimum height',
    maxCropWidth: 'Maximum width',
    maxCropHeight: 'Maximum height',
    currentCrop: 'Current crop',
    hint: 'Enabling constraints at runtime applies the current limits and recenters the resulting crop box. Later limit changes preserve its position.',
  } : {
    cropColor: '修改截图框颜色',
    cropBoxResizable: '允许缩放裁剪框',
    cropBoxConstraintsEnabled: '启用比例和尺寸限制',
    cropAspectRatio: '裁剪框比例',
    freeRatio: '自由比例',
    minCropWidth: '最小宽度',
    minCropHeight: '最小高度',
    maxCropWidth: '最大宽度',
    maxCropHeight: '最大高度',
    currentCrop: '当前裁剪框',
    hint: '运行时开启限制会应用当前比例和尺寸范围，并将结果重新居中；限制开启后的参数变化会保留当前位置。',
  })
</script>

<style lang="scss" scoped>
  .control-panel {
    display: grid;
    gap: 12px;
    margin: 20px 0;
    padding: 16px;
    border: 1px solid #e5e6eb;
    border-radius: 10px;
    background: #fafafa;
  }

  .switch-row,
  .field-row,
  .size-grid label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .size-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .size-grid :deep(.el-input-number),
  .field-row :deep(.el-select) {
    width: 180px;
  }

  .hint,
  .crop-state {
    margin: 0;
    color: #606266;
    font-size: 13px;
    line-height: 1.6;
  }

  .crop-state {
    color: #337ecc;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 720px) {
    .size-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
