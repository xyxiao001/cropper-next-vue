<LangBlock lang="zh">

# 基础例子

这个页面建议先完成 3 个动作：

1. 拖拽图片，确认截图区域跟随变化。
2. 鼠标滚轮缩放，观察截图结果。
3. 点击导出，确认已经能拿到 base64 结果。

### 最小可用示例

</LangBlock>

<LangBlock lang="en">

# Basic Demo

Try these three actions first:

1. Drag the image and confirm the crop area follows correctly.
2. Use the mouse wheel to zoom.
3. Export once and confirm you receive a base64 result.

### Minimal working example

</LangBlock>

:::demo
```html
<vue-cropper
  ref="cropper"
  :crop-layout="{ width: 220, height: 220 }"
  img="https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg">
</vue-cropper>
<section class="tips">
  <p>{{ labels.tipFlow }}</p>
  <p>{{ labels.tipRetina }}</p>
</section>
<section class="actions">
  <el-button :loading="loading" type="primary" @click="click">{{ labels.exportBase64 }}</el-button>
</section>
<section v-if="resultUrl" class="result-panel">
  <p>{{ labels.resultTitle }}</p>
  <img :src="resultUrl" class="result-image" alt="result" />
</section>
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    tipFlow: 'Suggested flow: drag first, zoom with the wheel, then export.',
    tipRetina: 'This demo uses the default full=true, so export is high-DPI friendly by default.',
    exportBase64: 'Export base64',
    resultTitle: 'Export result',
  } : {
    tipFlow: '操作建议：拖拽图片后再用滚轮缩放，然后点击导出。',
    tipRetina: '这个 demo 使用默认 full=true，导出结果默认更适合高分屏。',
    exportBase64: '导出 base64',
    resultTitle: '导出结果',
  })

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
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const loading = ref(false)
  const resultUrl = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    tipFlow: 'Suggested flow: drag first, zoom with the wheel, then export.',
    tipRetina: 'This demo uses the default full=true, so export is high-DPI friendly by default.',
    exportBase64: 'Export base64',
    resultTitle: 'Export result',
  } : {
    tipFlow: '操作建议：拖拽图片后再用滚轮缩放，然后点击导出。',
    tipRetina: '这个 demo 使用默认 full=true，导出结果默认更适合高分屏。',
    exportBase64: '导出 base64',
    resultTitle: '导出结果',
  })

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
  .actions {
    margin-top: 30px;
  }

  .tips {
    margin-top: 20px;
    color: #666;
    line-height: 1.8;
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

  p {
    margin: 0;
  }
</style>
