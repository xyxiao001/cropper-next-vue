<LangBlock lang="zh">

# 旋转控制

这个 demo 重点展示两件事：

- 每次旋转后都会重新做边界校验
- 你既可以用 `defaultRotate` 外部控制，也可以用实例方法旋转

### 旋转和边界联动

</LangBlock>

<LangBlock lang="en">

# Rotation Control

This demo highlights two things:

- boundary checks are recalculated after every rotation
- you can rotate through `defaultRotate` or through instance methods

### Rotation with boundary constraints

</LangBlock>

:::demo
```html
<vue-cropper 
  :center-box="centerBox"
  :center-box-delay="centerBoxDelay"
  :center-wrapper="centerWrapper"
  :center-wrapper-delay="centerWrapperDelay"
  :default-rotate="rotate"
  :wrapper="wrapper"
  ref="cropper"
  :img="img"
  :crop-layout="{ width: 220, height: 220 }"
>
</vue-cropper>
<demo-image-switch v-model="img" />
<p>
  <el-switch v-model="centerBox" :active-text="labels.centerBox" />
  <span class="delay-label">{{ labels.rebound }} {{ centerBoxDelay }}ms</span>
  <el-slider v-model="centerBoxDelay" :min="0" :max="1000" :step="50" />
</p>
<p>
  <el-switch v-model="centerWrapper" :active-text="labels.centerWrapper" />
  <span class="delay-label">{{ labels.rebound }} {{ centerWrapperDelay }}ms</span>
  <el-slider v-model="centerWrapperDelay" :min="0" :max="1000" :step="50" />
</p>
<p>
  <span>{{ labels.rotation }} --</span>
  <span>{{ rotate }}</span>
  <el-slider v-model="rotate" :max="360" />
</p>
<section class="actions">
  <el-button @click="rotateLeft">{{ labels.rotateLeft }}</el-button>
  <el-button @click="rotateRight">{{ labels.rotateRight }}</el-button>
  <el-button @click="rotateClear">{{ labels.rotateClear }}</el-button>
</section>
<crop-export-panel :cropper="cropper" :display-width="220" :display-height="220" />
```

```js
<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const centerBox = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapper = ref(false)
  const centerWrapperDelay = ref(100)
  const rotate = ref(30)
  const wrapper = { width: '500px', height: '500px' }
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBox: 'centerBox',
    centerWrapper: 'centerWrapper',
    rebound: 'Rebound',
    rotation: 'Rotation',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
  } : {
    centerBox: '图片限制截图框内',
    centerWrapper: '图片限制容器内',
    rebound: '回弹时长',
    rotation: '图片角度',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
  })

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }
</script>
```
:::

<script setup>
  import { computed, ref } from 'vue'
  import { useLocale } from '../composables/useLocale'

  const cropper = ref()
  const img = ref('')
  const centerBox = ref(false)
  const centerBoxDelay = ref(100)
  const centerWrapper = ref(false)
  const centerWrapperDelay = ref(100)
  const rotate = ref(30)
  const wrapper = { width: '500px', height: '500px' }
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    centerBox: 'centerBox',
    centerWrapper: 'centerWrapper',
    rebound: 'Rebound',
    rotation: 'Rotation',
    rotateLeft: 'Rotate left 90°',
    rotateRight: 'Rotate right 90°',
    rotateClear: 'Clear rotation',
  } : {
    centerBox: '图片限制截图框内',
    centerWrapper: '图片限制容器内',
    rebound: '回弹时长',
    rotation: '图片角度',
    rotateLeft: '向左旋转 90°',
    rotateRight: '向右旋转 90°',
    rotateClear: '清空旋转',
  })

  const rotateLeft = () => {
    cropper.value.rotateLeft()
    rotate.value -= 90
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
    rotate.value += 90
  }

  const rotateClear = () => {
    cropper.value.rotateClear()
    rotate.value = 0
  }
</script>

<style lang="scss" scoped>
  .delay-label {
    display: inline-block;
    margin: 0 12px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }
</style>
