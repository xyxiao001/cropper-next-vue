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
  :img="img"
  :crop-layout="{ width: 220, height: 220 }"
  @img-upload="handleUpload"
>
</vue-cropper>
<demo-image-switch v-model="img" />
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
</section>
<crop-export-panel :cropper="cropper" :display-width="220" :display-height="220" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { loadFile } from '../../lib/common.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    selectImage: 'Select image',
    uploadError: 'Upload failed',
  } : {
    selectImage: '选择图片',
    uploadError: '上传失败',
  })

  const handleUpload = (url) => {
    img.value = url
  }

  const handleChange = data => {
    loadFile(data.raw).then(res => {
      if (res) img.value = res
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
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    selectImage: 'Select image',
    uploadError: 'Upload failed',
  } : {
    selectImage: '选择图片',
    uploadError: '上传失败',
  })

  const handleUpload = (url) => {
    img.value = url
  }

  const handleChange = data => {
    loadFile(data.raw).then(res => {
      if (res) img.value = res
    }).catch(() => {
      ElMessage.error(labels.value.uploadError)
    })
  }
</script>

<style lang="scss" scoped>
  .control {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
</style>
