import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { loadFile } from '../common'

export const useDragUpload = (options: {
  cropperRef: Ref<HTMLElement | undefined>
  isDrag: Ref<boolean>
  onUpload: (url: string) => void
}) => {
  const { cropperRef, isDrag, onUpload } = options

  const drop = (e: DragEvent) => {
    e.preventDefault()
    const dataTransfer = e.dataTransfer as DataTransfer
    isDrag.value = false
    loadFile(dataTransfer.files[0]).then(res => {
      if (res) {
        onUpload(res)
      }
    })
  }

  const dragover = (e: Event) => {
    e.preventDefault()
    isDrag.value = true
  }

  const dragend = (e: Event) => {
    e.preventDefault()
    isDrag.value = false
  }

  onMounted(() => {
    const dom = cropperRef.value
    if (!dom) return
    dom.addEventListener('dragover', dragover, false)
    dom.addEventListener('dragend', dragend, false)
    dom.addEventListener('drop', drop, false)
  })

  onUnmounted(() => {
    cropperRef.value?.removeEventListener('drop', drop, false)
    cropperRef.value?.removeEventListener('dragover', dragover, false)
    cropperRef.value?.removeEventListener('dragend', dragend, false)
  })

  return {
    drop,
    dragover,
    dragend,
  }
}

