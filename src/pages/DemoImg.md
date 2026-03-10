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
  :img="img"
  :crop-layout="{ width: 220, height: 220 }"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<p class="desc">{{ labels.centerBoxDesc }}</p>
<crop-export-panel :cropper="cropper1" :display-width="220" :display-height="220" />

<p class="title">{{ labels.centerWrapperTitle }}</p>
<vue-cropper 
  center-wrapper
  :center-wrapper-delay="150"
  ref="cropper2"
  :img="img"
  :crop-layout="{ width: 220, height: 220 }"
>
</vue-cropper>
<p class="desc">{{ labels.centerWrapperDesc }}</p>
<crop-export-panel :cropper="cropper2" :display-width="220" :display-height="220" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropper2 = ref()
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerWrapperTitle: 'Keep image inside wrapper',
    centerWrapperDesc: 'Useful for editing flows where the image must always remain inside the workspace.',
  } : {
    centerBoxTitle: '图片限制截图框内',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerWrapperTitle: '图片限制容器内',
    centerWrapperDesc: '适合希望图片始终留在工作区内的编辑场景。',
  })
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropper2 = ref()
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerWrapperTitle: 'Keep image inside wrapper',
    centerWrapperDesc: 'Useful for editing flows where the image must always remain inside the workspace.',
  } : {
    centerBoxTitle: '图片限制截图框内',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerWrapperTitle: '图片限制容器内',
    centerWrapperDesc: '适合希望图片始终留在工作区内的编辑场景。',
  })
</script>

<style lang="scss" scoped>
  .title {
    margin: 20px 0 8px;
    font-weight: 600;
  }

  .desc {
    margin: 12px 0 0;
    color: #666;
  }
</style>
