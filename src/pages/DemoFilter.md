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
<demo-image-switch v-model="img" />
<vue-cropper 
  ref="cropper"
  :img="img"
  :filter="filterFunc"
  :crop-layout="{ width: 220, height: 220 }"
>
</vue-cropper>
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
<crop-export-panel :cropper="cropper" :display-width="220" :display-height="220" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto  } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const filter = ref(1)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    options: ['No filter', 'Grayscale', 'Black and white', 'Old photo'],
  } : {
    options: ['无滤镜', '灰度滤镜', '黑白滤镜', '老照片滤镜'],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
  ])
  const filterFunc = computed(() => options.value.find(item => item.value === filter.value)?.filter || null)
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto  } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const filter = ref(1)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    options: ['No filter', 'Grayscale', 'Black and white', 'Old photo'],
  } : {
    options: ['无滤镜', '灰度滤镜', '黑白滤镜', '老照片滤镜'],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
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
