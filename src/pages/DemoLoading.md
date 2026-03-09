<LangBlock lang="zh">

# 替换 loading 样式例子

当前版本支持通过 `loading` 插槽替换默认加载态。

### 功能展示

</LangBlock>

<LangBlock lang="en">

# Loading Slot Demo

The current version supports replacing the default loading state through the `loading` slot.

### Demo

</LangBlock>

:::demo
```html
<vue-cropper :img="currentImg">
  <template #loading>
    <p>{{ labels.loading }}</p>
  </template>
</vue-cropper>
<el-button @click="changeImg">{{ labels.changeImage }}</el-button>
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const currentImg = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    changeImage: 'Change image',
  } : {
    loading: '加载中...',
    changeImage: '切换图片',
  })
  const list = [
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/mosaic-legacy_2e7480001384708367aa1.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-i-0813_80f34c63344d44c292dacf4608c7b258.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_48b61ee1b6b34fe945246cd1ccc4243d.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg'
  ]

  const changeImg = () => {
    currentImg.value = list[Math.floor(Math.random() * list.length)]
  }

  changeImg()
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const currentImg = ref('')
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    changeImage: 'Change image',
  } : {
    loading: '加载中...',
    changeImage: '切换图片',
  })
  const list = [
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/mosaic-legacy_2e7480001384708367aa1.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-i-0813_80f34c63344d44c292dacf4608c7b258.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_48b61ee1b6b34fe945246cd1ccc4243d.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-i-0813_64784ee9972c4f578f2e91effa67f31a.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_9ecef7db552d442b6ebfe7919d0083f8.jpeg',
    'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_ee370f4d30adda3fc5ba9ba079c6f636.jpeg'
  ]

  const changeImg = () => {
    const index = Math.floor(Math.random() * list.length)
    currentImg.value = list[index]
  }

  changeImg()
</script>

<style lang="scss" scoped>
  button {
    margin-top: 30px;
  }
</style>
