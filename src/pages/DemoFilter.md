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
  :filter="filterFunc"
  img="https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg"
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
  <el-button :loading="loading" @click="click">{{ labels.exportCrop }}</el-button>
</section>
<section v-if="resultUrl" class="result-panel">
  <p>{{ labels.resultTitle }}</p>
  <img :src="resultUrl" class="result-image" alt="result" />
</section>
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto  } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const filter = ref(1)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
    options: ['No filter', 'Grayscale', 'Black and white', 'Old photo'],
  } : {
    exportCrop: '获取截图',
    resultTitle: '导出结果',
    options: ['无滤镜', '灰度滤镜', '黑白滤镜', '老照片滤镜'],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
  ])
  const filterFunc = computed(() => options.value.find(item => item.value === filter.value)?.filter || null)
  const click = () => {
    loading.value = true
    cropper.value.getCropData().then(res => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { grayscale, blackAndWhite, oldPhoto  } from '../../lib/filter/index.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const filter = ref(1)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
    options: ['No filter', 'Grayscale', 'Black and white', 'Old photo'],
  } : {
    exportCrop: '获取截图',
    resultTitle: '导出结果',
    options: ['无滤镜', '灰度滤镜', '黑白滤镜', '老照片滤镜'],
  })
  const options = computed(() => [
    { label: labels.value.options[0], value: 0, filter: null },
    { label: labels.value.options[1], value: 1, filter: grayscale },
    { label: labels.value.options[2], value: 2, filter: blackAndWhite },
    { label: labels.value.options[3], value: 3, filter: oldPhoto },
  ])
  const filterFunc = computed(() => options.value.find(item => item.value === filter.value)?.filter || null)
  const click = () => {
    loading.value = true
    cropper.value.getCropData().then(res => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }
</script>

<style lang="scss" scoped>
  button {
    margin-left: 20px;
  }

  .control {
    margin-top: 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .result-panel {
    margin-top: 20px;
  }

  .result-image {
    display: block;
    width: 220px;
    height: 220px;
    object-fit: contain;
    border: 1px solid #e5e6eb;
    background: #fff;
    margin-top: 8px;
  }
</style>
