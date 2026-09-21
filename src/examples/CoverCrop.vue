<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

// Put your own photo at public/photo.jpg, or choose a file below.
const image = ref('/photo.jpg')
const cropper = ref<InstanceType<typeof VueCropper>>()
const result = ref('')
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

const preview = ref({ w: 0, h: 0, url: '', img: { width: '0px', height: '0px', transform: '' } })
const updatePreview = (value: typeof preview.value) => { preview.value = value }

onBeforeUnmount(() => {
  URL.revokeObjectURL(selectedUrl)
  URL.revokeObjectURL(result.value)
})
</script>

<template>
  <input type="file" accept="image/*" aria-label="Choose image" @change="chooseImage" />
  <VueCropper
    ref="cropper"
    @real-time="updatePreview"
    :img="image"
    :wrapper="{ width: '100%', height: 360 }"
    :crop-layout="{ width: '60%', height: '60%' }"
    :crop-box-resizable="true"
    :crop-box-constraints-enabled="true"
    :crop-aspect-ratio="16 / 9"
    :min-crop-width="240"
    :min-crop-height="135"
    :center-box="true"
    output-type="webp"
    :output-size="0.9"
    :full="true"
    :max-side-length="1920"
  ></VueCropper>

  <!-- The preview is styled with CSS. The exported image keeps the crop ratio. -->
  <div :style="{ width: preview.w + 'px', height: preview.h + 'px', overflow: 'hidden', zoom: preview.w ? 160 / preview.w : 1 }">
    <img v-if="preview.url" :src="preview.url" :style="preview.img" alt="Crop preview" />
  </div>
  <button @click="exportImage">Export image</button>
  <img v-if="result" :src="result" alt="Exported crop" style="max-width: 100%" />
</template>
