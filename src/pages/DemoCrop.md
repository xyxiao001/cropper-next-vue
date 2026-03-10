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
  :img="img"
  :crop-color="cropColor"
  :wrapper="wrapper"
  :crop-layout="cropLayout"
>
</vue-cropper>
<demo-image-switch v-model="img" />
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
<crop-export-panel :cropper="cropper" :display-width="cropLayout.width" :display-height="cropLayout.height" />
```

```js
<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const cropColor = ref('#ffffff')
  const wrapper = reactive({ width: '400px', height: '400px' })
  const cropLayout = reactive({ width: 300, height: 300 })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    wrapper: 'Wrapper style',
    cropLayout: 'Crop-box style',
  } : {
    cropColor: '修改截图框颜色',
    wrapper: '容器样式',
    cropLayout: '截图框样式',
  })
</script>
```
:::

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const cropColor = ref('#ffffff')
  const wrapper = reactive({ width: '400px', height: '400px' })
  const cropLayout = reactive({ width: 300, height: 300 })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    cropColor: 'Crop-box color',
    wrapper: 'Wrapper style',
    cropLayout: 'Crop-box style',
  } : {
    cropColor: '修改截图框颜色',
    wrapper: '容器样式',
    cropLayout: '截图框样式',
  })
</script>

<style lang="scss" scoped>
  .control {
    display: flex;
    align-items: center;
    margin: 30px 0;
  }

  p {
    margin: 0;
    margin-right: 10px;
  }
</style>
