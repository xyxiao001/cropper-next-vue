<LangBlock lang="zh">

# 替换 loading 样式例子

当前版本支持通过 `loading` 插槽替换默认加载态。您可以通过下方的选择器切换不同的 loading 样式。

### 功能展示

</LangBlock>

<LangBlock lang="en">

# Loading Slot Demo

The current version supports replacing the default loading state through the `loading` slot. You can switch between different loading styles using the selector below.

### Demo

</LangBlock>

:::demo
```html
<div class="loading-toolbar">
  <label>{{ labels.selectLoading }}</label>
  <select v-model="loadingType">
    <option value="text">{{ labels.textLoading }}</option>
    <option value="spinner">{{ labels.spinnerLoading }}</option>
    <option value="pulse">{{ labels.pulseLoading }}</option>
    <option value="progress">{{ labels.progressLoading }}</option>
    <option value="dots">{{ labels.dotsLoading }}</option>
    <option value="wave">{{ labels.waveLoading }}</option>
  </select>
</div>

<vue-cropper
  ref="cropper"
  :img="img"
  :crop-layout="{ width: 220, height: 220 }"
>
  <template #loading>
    <div v-if="loadingType === 'text'" class="loading-text">{{ labels.loading }}</div>
    <div v-else-if="loadingType === 'spinner'" class="loading-spinner"></div>
    <div v-else-if="loadingType === 'pulse'" class="loading-pulse"></div>
    <div v-else-if="loadingType === 'progress'" class="loading-progress">
      <div class="loading-progress-bar"></div>
    </div>
    <div v-else-if="loadingType === 'dots'" class="loading-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div v-else-if="loadingType === 'wave'" class="loading-wave">
      <span class="wave"></span>
      <span class="wave"></span>
      <span class="wave"></span>
    </div>
  </template>
</vue-cropper>

<demo-image-switch v-model="img" />
<crop-export-panel :cropper="cropper" :display-width="220" :display-height="220" />
```

```js
<script setup>
  import { computed, ref, watch } from 'vue'
  import { useLocale } from '../composables/useLocale'
  import { imageList } from '../utils/image'

  const cropper = ref()
  const img = ref('')
  const loadingType = ref('text')
  watch(loadingType, () => {
    if (img.value) {
      cropper.value?.reload?.()
    }
  })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    changeImage: 'Change image',
    selectLoading: 'Select loading style:',
    textLoading: 'Text',
    spinnerLoading: 'Spinner',
    pulseLoading: 'Pulse',
    progressLoading: 'Progress Bar',
    dotsLoading: 'Bouncing Dots',
    waveLoading: 'Wave',
  } : {
    loading: '加载中...',
    changeImage: '切换图片',
    selectLoading: '选择加载样式:',
    textLoading: '文本',
    spinnerLoading: '旋转',
    pulseLoading: '脉冲',
    progressLoading: '进度条',
    dotsLoading: '跳动点',
    waveLoading: '波浪',
  })
</script>
```

```scss
<style scoped>
.loading-text {
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-pulse {
  width: 20px;
  height: 20px;
  background-color: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(0.8); opacity: 1; }
}

.loading-progress {
  width: 100px;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.loading-progress-bar {
  height: 100%;
  background-color: #3498db;
  border-radius: 2px;
  animation: progress 1.5s ease-in-out infinite;
}

@keyframes progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 0%; }
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #3498db;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.loading-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.wave {
  width: 3px;
  height: 15px;
  background-color: #3498db;
  border-radius: 3px;
  animation: wave 1.2s ease-in-out infinite;
}

.wave:nth-child(1) { animation-delay: -0.4s; }
.wave:nth-child(2) { animation-delay: -0.2s; }

@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}
</style>
```
:::

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useLocale } from '../composables/useLocale'
  import { imageList } from '../utils/image'

  const cropper = ref()
  const img = ref('')
  const loadingType = ref('text')
  watch(loadingType, () => {
    if (img.value) {
      cropper.value?.reload?.()
    }
  })
  const { isEn } = useLocale()
  const labels = computed(() => isEn.value ? {
    loading: 'Loading...',
    changeImage: 'Change image',
    selectLoading: 'Select loading style:',
    textLoading: 'Text',
    spinnerLoading: 'Spinner',
    pulseLoading: 'Pulse',
    progressLoading: 'Progress Bar',
    dotsLoading: 'Bouncing Dots',
    waveLoading: 'Wave',
  } : {
    loading: '加载中...',
    changeImage: '切换图片',
    selectLoading: '选择加载样式:',
    textLoading: '文本',
    spinnerLoading: '旋转',
    pulseLoading: '脉冲',
    progressLoading: '进度条',
    dotsLoading: '跳动点',
    waveLoading: '波浪',
  })
</script>

<style lang="scss" scoped>
  button {
    margin-top: 30px;
  }

  .loading-toolbar {
    margin-bottom: 16px;
  }

  .loading-toolbar select {
    margin-left: 10px;
    padding: 5px;
  }

  .loading-text {
    text-align: center;
    color: #666;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-pulse {
    width: 20px;
    height: 20px;
    background-color: #3498db;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(0.8); opacity: 1; }
  }

  .loading-progress {
    width: 100px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
  }

  .loading-progress-bar {
    height: 100%;
    background-color: #3498db;
    border-radius: 2px;
    animation: progress 1.5s ease-in-out infinite;
  }

  @keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 0%; }
  }

  .loading-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background-color: #3498db;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .loading-wave {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
  }

  .wave {
    width: 3px;
    height: 15px;
    background-color: #3498db;
    border-radius: 3px;
    animation: wave 1.2s ease-in-out infinite;
  }

  .wave:nth-child(1) { animation-delay: -0.4s; }
  .wave:nth-child(2) { animation-delay: -0.2s; }

  @keyframes wave {
    0%, 40%, 100% { transform: scaleY(0.4); }
    20% { transform: scaleY(1); }
  }
</style>
