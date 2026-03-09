<LangBlock lang="zh">

# 截图框操作例子

### 修改截图框颜色

</LangBlock>

<LangBlock lang="en">

# Crop Box Demo

### Change crop-box color

</LangBlock>

:::demo
```html
<vue-cropper 
  ref="cropper"
  :crop-color="cropColor"
  :wrapper="wrapper"
  :crop-layout="cropLayout"
  img="https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg">
</vue-cropper>
<section class="control">
  <p>{{ labels.cropColor }}</p>
  <input type="color" v-model="cropColor" />
</section>
<section class="control">
  <p>{{ labels.wrapper }}</p>
  <p>{{ wrapper }}</p>
</section>
<section class="control">
  <p>{{ labels.cropLayout }}</p>
  <p>{{ cropLayout }}</p>
</section>
<el-button :loading="loading" @click="click">{{ labels.exportCrop }}</el-button>
<section v-if="resultUrl" class="result-panel">
  <p>{{ labels.resultTitle }}</p>
  <img :src="resultUrl" class="result-image" alt="result" />
</section>
```

```js
<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const cropColor = ref('#ffffff')
  const resultUrl = ref('')
  const wrapper = reactive({ width: '400px', height: '400px' })
  const cropLayout = reactive({ width: 300, height: 300 })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    wrapper: 'Wrapper style',
    cropLayout: 'Crop-box style',
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
  } : {
    cropColor: '修改截图框颜色',
    wrapper: '容器样式',
    cropLayout: '截图框样式',
    exportCrop: '获取截图',
    resultTitle: '导出结果',
  })

  const click = () => {
    loading.value = true
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }
</script>
```
:::

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const cropColor = ref('#ffffff')
  const resultUrl = ref('')
  const wrapper = reactive({ width: '400px', height: '400px' })
  const cropLayout = reactive({ width: 300, height: 300 })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    wrapper: 'Wrapper style',
    cropLayout: 'Crop-box style',
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
  } : {
    cropColor: '修改截图框颜色',
    wrapper: '容器样式',
    cropLayout: '截图框样式',
    exportCrop: '获取截图',
    resultTitle: '导出结果',
  })

  const click = () => {
    loading.value = true
    cropper.value.getCropData().then((res) => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }
</script>

<style lang="scss" scoped>
  .control {
    display: flex;
    align-items: center;
    margin: 30px 0;
  }

  .result-panel {
    margin-top: 20px;
  }

  .result-image {
    display: block;
    width: 300px;
    height: 300px;
    object-fit: contain;
    border: 1px solid #e5e6eb;
    background: #fff;
    margin-top: 8px;
  }

  p {
    margin: 0;
    margin-right: 10px;
  }
</style>
