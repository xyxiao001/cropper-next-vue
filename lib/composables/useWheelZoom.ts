import { onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceScaleAnchor, InterfaceZoomAnchor } from '../interface'
import { resetWheelZoomState } from '../changeImgSize'

type ImgAxis = { scale: number }
type ImgLayout = { width: number; height: number }

export const useWheelZoom = (options: {
  isIE: boolean
  supportWheel: string
  changeImgSize: (e: Event, scale: number, imgLayout: ImgLayout) => number
  imgAxis: Ref<ImgAxis> | ImgAxis
  imgLayout: Ref<ImgLayout> | ImgLayout
  cropperRef: Ref<HTMLElement | undefined>
  zoomAnchor: Ref<InterfaceZoomAnchor>
  zoomable: Ref<boolean>
  setScale: (scale: number, keep?: boolean, anchor?: InterfaceScaleAnchor) => void
}) => {
  const { isIE, supportWheel, changeImgSize, setScale } = options

  const getValue = <T>(v: Ref<T> | T): T => {
    return typeof (v as any)?.value !== 'undefined' ? (v as Ref<T>).value : (v as T)
  }

  const mouseScroll = (e: Event) => {
    if (!options.zoomable.value) return
    e.preventDefault()
    const axis = getValue(options.imgAxis)
    const layout = getValue(options.imgLayout)
    const scale = changeImgSize(e, axis.scale, layout)
    if (options.zoomAnchor.value === 'pointer') {
      const rect = options.cropperRef.value!.getBoundingClientRect()
      const wheelEvent = e as WheelEvent
      const pointer = {
        x: wheelEvent.clientX - rect.left,
        y: wheelEvent.clientY - rect.top,
      }
      setScale(scale, false, { previous: pointer, current: pointer })
      return
    }
    setScale(scale)
  }

  const mouseInCropper = () => {
    if (typeof window === 'undefined') return
    if (isIE) {
      window.addEventListener(supportWheel, mouseScroll)
    } else {
      window.addEventListener(supportWheel, mouseScroll, { passive: false })
    }
  }

  const mouseOutCropper = () => {
    if (typeof window === 'undefined') return
    window.removeEventListener(supportWheel, mouseScroll)
    resetWheelZoomState()
  }

  onUnmounted(() => {
    mouseOutCropper()
  })

  return {
    mouseInCropper,
    mouseOutCropper,
  }
}
