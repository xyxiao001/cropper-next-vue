<LangBlock lang="zh">

# 图片滤镜

### 图片滤镜控制

</LangBlock>

<LangBlock lang="en">

# Image Filter

### Filter control

</LangBlock>

:::demo
```html
<vue-cropper 
  ref="cropper"
  :img="img"
  :filter="filterFunc"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<section class="control">
  <el-select v-model="filter">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</section>
<crop-export-panel :cropper="cropper" :display-width="320" :display-height="320" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto, invert, brighten, contrast, cool, warm } from '../../lib/filters/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const filter = ref(1)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    options: [
      'No filter',
      'Grayscale',
      'Black and white',
      'Old photo',
      'Invert',
      'Brighten',
      'Contrast',
      'Cool tone',
      'Warm tone',
    ],
  } : {
    options: [
      '无滤镜',
      '灰度滤镜',
      '黑白滤镜',
      '老照片滤镜',
      '反色滤镜',
      '提亮滤镜',
      '对比度增强',
      '冷色调',
      '暖色调',
    ],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
    { label: labels.value.options[4], value: 4, filter: invert },
    { label: labels.value.options[5], value: 5, filter: brighten },
    { label: labels.value.options[6], value: 6, filter: contrast },
    { label: labels.value.options[7], value: 7, filter: cool },
    { label: labels.value.options[8], value: 8, filter: warm },
  ])
  const filterFunc = computed(() => options.value.find(item => item.value === filter.value)?.filter || null)
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto, invert, brighten, contrast, cool, warm } from '../../lib/filters/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const filter = ref(1)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    options: [
      'No filter',
      'Grayscale',
      'Black and white',
      'Old photo',
      'Invert',
      'Brighten',
      'Contrast',
      'Cool tone',
      'Warm tone',
    ],
  } : {
    options: [
      '无滤镜',
      '灰度滤镜',
      '黑白滤镜',
      '老照片滤镜',
      '反色滤镜',
      '提亮滤镜',
      '对比度增强',
      '冷色调',
      '暖色调',
    ],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
    { label: labels.value.options[4], value: 4, filter: invert },
    { label: labels.value.options[5], value: 5, filter: brighten },
    { label: labels.value.options[6], value: 6, filter: contrast },
    { label: labels.value.options[7], value: 7, filter: cool },
    { label: labels.value.options[8], value: 8, filter: warm },
  ])
  const filterFunc = computed(() => options.value.find(item => item.value === filter.value)?.filter || null)
</script>

<style lang="scss" scoped>
  .control {
    margin-top: 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
