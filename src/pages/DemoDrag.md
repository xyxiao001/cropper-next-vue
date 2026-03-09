<LangBlock lang="zh">

# 拖拽和本地上传图片渲染例子

### 功能展示

#### 选择一张本地图片拖拽到截图区域或者点击按钮进行图片上传

</LangBlock>

<LangBlock lang="en">

# Drag And Upload Demo

### Demo

#### Drag a local image into the crop area or choose a file from the upload button

</LangBlock>

:::demo
```html
<vue-cropper 
  ref="cropper"
  :img="currentImg"
  @img-upload="handleUpload"
>
</vue-cropper>
<section class="control">
  <el-upload
    class="upload-demo"
    :auto-upload="false"
    action=""
    @change="handleChange"
    :show-file-list="false"
  >
    <template #trigger>
      <el-button type="primary">{{ labels.selectImage }}</el-button>
    </template>
  </el-upload>
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
  import { ElMessage } from 'element-plus'
  import { loadFile } from '../../lib/common.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const currentImg = ref('https://p6-addone.byteimg.com/tos-cn-i-hhc0kcolqq/e140e367ab964968a3e1a3ab73a469e9.jpeg~tplv-hhc0kcolqq-image-v7:1920:q50.image')
  const loading = ref(false)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    selectImage: 'Select image',
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
    uploadError: 'Upload failed',
  } : {
    selectImage: '选择图片',
    exportCrop: '获取截图',
    resultTitle: '导出结果',
    uploadError: '上传失败',
  })

  const click = () => {
    loading.value = true
    cropper.value.getCropData().then(res => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }

  const handleUpload = img => {
    currentImg.value = img
  }

  const handleChange = data => {
    loadFile(data.raw).then(res => {
      if (res) currentImg.value = res
    }).catch(() => {
      ElMessage.error(labels.value.uploadError)
    })
  }
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { loadFile } from '../../lib/common.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const currentImg = ref('https://p6-addone.byteimg.com/tos-cn-i-hhc0kcolqq/e140e367ab964968a3e1a3ab73a469e9.jpeg~tplv-hhc0kcolqq-image-v7:1920:q50.image')
  const loading = ref(false)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    selectImage: 'Select image',
    exportCrop: 'Export crop',
    resultTitle: 'Export result',
    uploadError: 'Upload failed',
  } : {
    selectImage: '选择图片',
    exportCrop: '获取截图',
    resultTitle: '导出结果',
    uploadError: '上传失败',
  })

  const click = () => {
    loading.value = true
    cropper.value.getCropData().then(res => {
      resultUrl.value = res
    }).finally(() => {
      loading.value = false
    })
  }

  const handleUpload = img => {
    currentImg.value = img
  }

  const handleChange = data => {
    loadFile(data.raw).then(res => {
      if (res) currentImg.value = res
    }).catch(() => {
      ElMessage.error(labels.value.uploadError)
    })
  }
</script>

<style lang="scss" scoped>
  button {
    margin-top: 30px;
  }

  .control {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
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
