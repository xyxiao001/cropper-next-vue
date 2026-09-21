<LangBlock lang="zh">

# 边界控制

这页用来理解两种最核心的限制策略：

- `centerBox`：图片必须完整包住截图框
- `centerWrapper`：图片必须完整覆盖外层容器

分别拖动、缩放两组图片，观察覆盖范围与松手后的回弹。两者同时开启时 `centerBox` 优先。

<h3 id="section-1">图片限制示例</h3>

</LangBlock>

<LangBlock lang="en">

# Boundary Control

This page explains the two core boundary strategies:

- `centerBox`: the image must fully cover the crop box
- `centerWrapper`: the image must fully cover the wrapper

Drag and zoom both demos to compare coverage and rebound after release. When both options are enabled, `centerBox` takes priority.

<h3 id="section-1">Boundary examples</h3>

</LangBlock>

:::demo
```html
<p class="title">{{ labels.centerBoxTitle }}</p>
<vue-cropper 
  center-box
  :center-box-delay="150"
  ref="cropper1"
  @change="cropSize1 = $event.crop"
  :img="img"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<p class="desc">{{ labels.centerBoxDesc }}</p>
<crop-export-panel :cropper="cropper1" :display-width="cropSize1.width" :display-height="cropSize1.height" />

<p class="title">{{ labels.centerWrapperTitle }}</p>
<vue-cropper 
  center-wrapper
  :center-wrapper-delay="150"
  ref="cropper2"
  @change="cropSize2 = $event.crop"
  :img="img"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
>
</vue-cropper>
<p class="desc">{{ labels.centerWrapperDesc }}</p>
<crop-export-panel :cropper="cropper2" :display-width="cropSize2.width" :display-height="cropSize2.height" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropSize1 = ref({ width: 320, height: 320 })
  const cropper2 = ref()
  const cropSize2 = ref({ width: 320, height: 320 })
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerWrapperTitle: 'Keep image covering wrapper',
    centerWrapperDesc: 'Keeps the entire workspace covered, including the area outside the crop box.',
  } : {
    centerBoxTitle: '图片覆盖裁剪框',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerWrapperTitle: '图片覆盖整个容器',
    centerWrapperDesc: '使整个工作区始终被图片覆盖，包括裁剪框以外的区域。',
  })
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper1 = ref()
  const cropSize1 = ref({ width: 320, height: 320 })
  const cropper2 = ref()
  const cropSize2 = ref({ width: 320, height: 320 })
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBoxTitle: 'Keep image covering crop box',
    centerBoxDesc: 'Useful when the final output must fully cover the crop area, such as avatar cropping.',
    centerWrapperTitle: 'Keep image covering wrapper',
    centerWrapperDesc: 'Keeps the entire workspace covered, including the area outside the crop box.',
  } : {
    centerBoxTitle: '图片覆盖裁剪框',
    centerBoxDesc: '适合最终必须铺满裁剪区域的场景，比如头像裁剪。',
    centerWrapperTitle: '图片覆盖整个容器',
    centerWrapperDesc: '使整个工作区始终被图片覆盖，包括裁剪框以外的区域。',
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
