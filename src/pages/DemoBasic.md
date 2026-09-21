<LangBlock lang="zh">

# 基础裁剪

这个页面建议先完成 3 个动作：

1. 拖拽图片，确认截图区域跟随变化。
2. 鼠标滚轮缩放，观察截图结果。
3. 点击导出，确认已经能拿到 base64 结果。

<h3 id="section-1">最小可用示例</h3>

</LangBlock>

<LangBlock lang="en">

# Basic cropping

Try these three actions first:

1. Drag the image and confirm the crop area follows correctly.
2. Use the mouse wheel to zoom.
3. Export once and confirm you receive a base64 result.

<h3 id="section-1">Minimal working example</h3>

</LangBlock>

:::demo
```html
<vue-cropper
  ref="cropper"
  @change="cropSize = $event.crop"
  :img="img"
  :wrapper="{ width: 480, height: 480 }"
  :crop-layout="{ width: 320, height: 320 }"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<section class="tips">
  <p>{{ labels.tipFlow }}</p>
  <p>{{ labels.tipRetina }}</p>
</section>
<crop-export-panel :cropper="cropper" :display-width="cropSize.width" :display-height="cropSize.height" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const cropSize = ref({ width: 320, height: 320 })
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    tipFlow: 'Suggested flow: drag first, zoom with the wheel, then export.',
    tipRetina: 'This demo uses the default full=true, so export is high-DPI friendly by default.',
  } : {
    tipFlow: '操作建议：拖拽图片后再用滚轮缩放，然后点击导出。',
    tipRetina: '这个 demo 使用默认 full=true，导出结果默认更适合高分屏。',
  })
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const cropSize = ref({ width: 320, height: 320 })
  const img = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    tipFlow: 'Suggested flow: drag first, zoom with the wheel, then export.',
    tipRetina: 'This demo uses the default full=true, so export is high-DPI friendly by default.',
  } : {
    tipFlow: '操作建议：拖拽图片后再用滚轮缩放，然后点击导出。',
    tipRetina: '这个 demo 使用默认 full=true，导出结果默认更适合高分屏。',
  })
</script>

<style lang="scss" scoped>
  .tips {
    margin-top: 20px;
    color: #666;
    line-height: 1.8;
  }

  p {
    margin: 0;
  }
</style>
