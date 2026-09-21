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
const coordinates = ref<ReturnType<InstanceType<typeof VueCropper>['getCropCoordinates']>>(null)
const readCoordinates = () => { coordinates.value = cropper.value!.getCropCoordinates() }

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

  ></VueCropper>
  <button @click="cropper!.flipHorizontal()">Flip horizontally</button>
<button @click="cropper!.flipVertical()">Flip vertically</button>
<button @click="readCoordinates">Read source coordinates</button>
<pre>{{ coordinates }}</pre>
  <button @click="exportImage">Export image</button>
  <img v-if="result" :src="result" alt="Exported crop" style="max-width: 100%" />
</template>
