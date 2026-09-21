<LangBlock lang="zh">

# 使用本地图片

<h3 id="section-1">功能展示</h3>

#### 选择一张本地图片拖拽到截图区域或者点击按钮进行图片上传

</LangBlock>

<LangBlock lang="en">

# Local images

<h3 id="section-1">Demo</h3>

#### Drag a local image into the crop area or choose a file from the upload button

</LangBlock>

:::demo
```html
<vue-cropper 
  ref="cropper"
  @change="cropSize = $event.crop"
  :img="img"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
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
<crop-export-panel :cropper="cropper" :display-width="cropSize.width" :display-height="cropSize.height" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { loadFile } from '../../lib/common.ts'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const cropSize = ref({ width: 320, height: 320 })
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
  const cropSize = ref({ width: 320, height: 320 })
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
