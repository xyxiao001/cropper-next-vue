import type { Ref } from 'vue'
import type { InterfaceAxis } from '../interface'
import { getCropImgData } from '../common'

type ImgAxis = { x: number; y: number; scale: number; rotate: number }
type ImgLayout = { width: number; height: number }

export const useExport = (options: {
  canvas: Ref<HTMLCanvasElement | null>
  outputType: Ref<string>
  outputSize: Ref<number>
  full: Ref<boolean>
  original: Ref<boolean>
  maxSideLength: Ref<number>
  imgAxis: Ref<ImgAxis> | ImgAxis
  imgLayout: Ref<ImgLayout> | ImgLayout
  cropAxis: Ref<InterfaceAxis> | InterfaceAxis
  cropLayout: Ref<{ width: number; height: number }>
  cropping: Ref<boolean>
  // Optional: used only for backward compatibility / diagnostics in getCropImgData
  url?: Ref<string> | string
}) => {
  const {
    canvas,
    outputType,
    outputSize,
    full,
    original,
    maxSideLength,
    cropLayout,
    cropping,
    url,
  } = options

  const getValue = <T>(v: Ref<T> | T): T => {
    return typeof (v as any)?.value !== 'undefined' ? (v as Ref<T>).value : (v as T)
  }

  const getUrl = () => {
    if (!url) return undefined
    return typeof (url as any)?.value !== 'undefined' ? (url as Ref<string>).value : (url as string)
  }

  const getCropData = (type: 'base64' | 'blob' = 'base64') => {
    if (!canvas.value) {
      return Promise.reject(new Error('No image canvas available'))
    }
    return getCropImgData({
      type,
      outputType: outputType.value,
      outputSize: outputSize.value,
      full: full.value,
      original: original.value,
      maxSideLength: maxSideLength.value,
      sourceCanvas: canvas.value,
      url: getUrl(),
      imgAxis: { ...getValue(options.imgAxis) },
      imgLayout: { ...getValue(options.imgLayout) },
      cropLayout: { ...cropLayout.value },
      cropAxis: { ...getValue(options.cropAxis) },
      cropping: cropping.value,
    })
  }

  const getCropBlob = () => {
    return getCropData('blob') as Promise<Blob>
  }

  return {
    getCropData,
    getCropBlob,
  }
}

