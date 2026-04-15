import type { Ref } from 'vue'
import { createPreviewUrlFromCanvas } from './preview'

type WrapLayout = { width: number; height: number }

export const usePreviewFactory = (options: {
  previewMaxSide: Ref<number>
  getWrapLayout: () => WrapLayout
}) => {
  const { previewMaxSide, getWrapLayout } = options

  const createPreviewUrl = (canvas: HTMLCanvasElement) => {
    return createPreviewUrlFromCanvas(canvas, {
      previewMaxSide: previewMaxSide.value,
      getWrapLayout,
    })
  }

  return { createPreviewUrl }
}

