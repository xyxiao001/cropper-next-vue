<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

// Put your own photo at public/photo.jpg, or choose a file below.
const image = ref('/photo.jpg')
const cropper = ref<InstanceType<typeof VueCropper>>()
const result = ref('')
const outputType = ref('webp')
const outputSize = ref(0.9)
let selectedUrl = ''
const chooseImage = (event: Event) => {
  URL.revokeObjectURL(selectedUrl)
  selectedUrl = URL.createObjectURL((event.target as HTMLInputElement).files![0])
  image.value = selectedUrl
}
const exportImage = async () => {
  const blob = await cropper.value!.getCropBlob()
  URL.revokeObjectURL(result.value)
  result.value = URL.createObjectURL(blob)
  // Use this Blob in FormData when integrating your own upload service.
}

onBeforeUnmount(() => {
  URL.revokeObjectURL(selectedUrl)
  URL.revokeObjectURL(result.value)
})
</script>

<template>
  <input type="file" accept="image/*" aria-label="Choose image" @change="chooseImage" />
  <VueCropper
    ref="cropper"
    :img="image"
    :wrapper="{ width: '100%', height: 360 }"
    :crop-layout="{ width: '60%', height: '60%' }"
    :crop-box-resizable="true"
    :crop-box-constraints-enabled="true"
    :crop-aspect-ratio="1"
    :center-box="true"
    :min-crop-width="180"
    :min-crop-height="180"
    :max-crop-width="360"
    :max-crop-height="360"
    :output-type="outputType"
    :output-size="outputSize"
    :full="true"
    :max-side-length="2400"
  ></VueCropper>

  <label>Format <select v-model="outputType"><option value="webp">WebP</option><option value="jpeg">JPEG</option></select></label>
  <label>Quality {{ outputSize }} <input v-model.number="outputSize" type="range" min="0.5" max="1" step="0.1" /></label>
  <button @click="exportImage">Export image</button>
  <img v-if="result" :src="result" alt="Exported crop" style="max-width: 100%" />
</template>
