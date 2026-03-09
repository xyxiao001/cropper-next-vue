<LangBlock lang="zh">

# 边界控制

这页用来理解两种最核心的限制策略：

- `centerBox`：图片必须完整包住截图框
- `centerWrapper`：图片必须留在外层容器内

建议你分别拖动、缩放，再对比两组行为差异。

### 图片限制示例

</LangBlock>

<LangBlock lang="en">

# Boundary Control

This page explains the two core boundary strategies:

- `centerBox`: the image must fully cover the crop box
- `centerWrapper`: the image must stay inside the wrapper

Try dragging and zooming both demos to compare the behavior.

### Boundary examples

</LangBlock>

:::demo
```html
<p class="title">{{ labels.centerBoxTitle }}</p>
<vue-cropper 
  center-box
  :center-box-delay="150"
  ref="cropper1"
  img="https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg"
>
</vue-cropper>
<p class="desc">{{ labels.centerBoxDesc }}</p>
<el-button :loading="loading" @click="click1">{{ labels.centerBoxButton }}</el-button>

<p class="title">{{ labels.centerWrapperTitle }}</p>
<vue-cropper 
  center-wrapper
  :center-wrapper-delay="150"
  ref="cropper2"
  img="https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg"
>
</vue-cropper>
<p class="desc">{{ labels.centerWrapperDesc }}</p>
<el-button :loading="loading" @click="click2">{{ labels.centerWrapperButton }}</el-button>
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropper2 = ref()
  const loading = ref(false)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerBoxButton: 'Export centerBox result',
    centerWrapperTitle: 'Keep image inside wrapper',
    centerWrapperDesc: 'Useful for editing flows where the image must always remain inside the workspace.',
    centerWrapperButton: 'Export centerWrapper result',
    successTitle: 'Export success',
    confirm: 'OK',
  } : {
    centerBoxTitle: '图片限制截图框内',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerBoxButton: '导出截图框结果',
    centerWrapperTitle: '图片限制容器内',
    centerWrapperDesc: '适合希望图片始终留在工作区内的编辑场景。',
    centerWrapperButton: '导出容器限制结果',
    successTitle: '截图成功',
    confirm: '确定',
  })

  const open = (img) => {
    ElMessageBox.alert(`<img src="${img}">`, labels.value.successTitle, {
      dangerouslyUseHTMLString: true,
      confirmButtonText: labels.value.confirm,
    })
  }

  const click1 = () => {
    loading.value = true
    cropper1.value.getCropData().then(open).finally(() => {
      loading.value = false
    })
  }

  const click2 = () => {
    loading.value = true
    cropper2.value.getCropData().then(open).finally(() => {
      loading.value = false
    })
  }
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropper2 = ref()
  const loading = ref(false)
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerBoxButton: 'Export centerBox result',
    centerWrapperTitle: 'Keep image inside wrapper',
    centerWrapperDesc: 'Useful for editing flows where the image must always remain inside the workspace.',
    centerWrapperButton: 'Export centerWrapper result',
    successTitle: 'Export success',
    confirm: 'OK',
  } : {
    centerBoxTitle: '图片限制截图框内',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerBoxButton: '导出截图框结果',
    centerWrapperTitle: '图片限制容器内',
    centerWrapperDesc: '适合希望图片始终留在工作区内的编辑场景。',
    centerWrapperButton: '导出容器限制结果',
    successTitle: '截图成功',
    confirm: '确定',
  })

  const open = (img) => {
    ElMessageBox.alert(`<img src="${img}">`, labels.value.successTitle, {
      dangerouslyUseHTMLString: true,
      confirmButtonText: labels.value.confirm,
    })
  }

  const click1 = () => {
    loading.value = true
    cropper1.value.getCropData().then(open).finally(() => {
      loading.value = false
    })
  }

  const click2 = () => {
    loading.value = true
    cropper2.value.getCropData().then(open).finally(() => {
      loading.value = false
    })
  }
</script>

<style lang="scss" scoped>
  button {
    margin: 16px 0 32px;
  }

  .title {
    margin: 20px 0 8px;
    font-weight: 600;
  }

  .desc {
    margin: 12px 0 0;
    color: #666;
  }
</style>
