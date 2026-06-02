import type { Ref } from 'vue'
import type { InterfaceLayoutInput, InterfaceAxis } from '../interface'
import { translateStyle } from '../common'
import { normalizeRotate } from './utils'

type LayoutContainerLike = {
  imgLayout: { width: number; height: number }
  wrapLayout: { width: number; height: number }
  imgAxis: { x: number; y: number; scale: number; rotate: number }
  imgExhibitionStyle: any
  cropAxis: InterfaceAxis
}

export const usePublicMethods = (options: {
  imgs: Ref<string>
  img: Ref<string>
  imgLoading: Ref<boolean>
  layout: LayoutContainerLike
  innerCropLayout: Ref<InterfaceLayoutInput>
  checkedImg: (url: string) => Promise<boolean> | boolean
  updateWrapLayoutFromDom: () => void
  renderCrop: (axis?: InterfaceAxis) => void
  checkedCrop: (axis: InterfaceAxis) => void
  reboundImg: () => void
  setScale: (scale: number) => void
  queueRealTimeEmit: () => void
}) => {
  const {
    imgs,
    img,
    imgLoading,
    layout,
    innerCropLayout,
    checkedImg,
    updateWrapLayoutFromDom,
    renderCrop,
    checkedCrop,
    reboundImg,
    setScale,
    queueRealTimeEmit,
  } = options

  const MIN_SCALE = 0.01
  const DEFAULT_ZOOM_STEP = 0.1

  const getValidZoomStep = (step: number = DEFAULT_ZOOM_STEP) => {
    const value = Math.abs(Number(step))
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_ZOOM_STEP
  }

  const setRotate = (rotate: number, shouldRebound: boolean = true) => {
    const { x, y, scale } = layout.imgAxis
    const axis = { x, y }
    const style = translateStyle(
      {
        scale,
        imgStyle: { ...layout.imgLayout },
        layoutStyle: { ...layout.wrapLayout },
        rotate,
      },
      axis,
    )
    layout.imgExhibitionStyle = style.imgExhibitionStyle
    layout.imgAxis = style.imgAxis
    queueRealTimeEmit()

    // 旋转会改变图片的实际包围范围，需要立即重新做边界校验。
    if (shouldRebound && imgs.value) {
      reboundImg()
    }
  }

  const rotateLeft = () => {
    setRotate(layout.imgAxis.rotate - 90)
  }

  const rotateRight = () => {
    setRotate(layout.imgAxis.rotate + 90)
  }

  const rotateClear = () => {
    setRotate(0)
  }

  const reload = () => {
    if (!img.value) {
      imgs.value = ''
      imgLoading.value = false
      return false
    }
    return checkedImg(img.value)
  }

  const setRotateAngle = (rotate: number) => {
    setRotate(normalizeRotate(rotate))
  }

  const setCropLayout = (layoutInput: InterfaceLayoutInput) => {
    innerCropLayout.value = { ...layoutInput }
    if (!imgs.value) {
      return
    }
    updateWrapLayoutFromDom()
    renderCrop()
    reboundImg()
  }

  const setCropAxis = (axis: InterfaceAxis) => {
    if (!imgs.value) {
      return
    }
    updateWrapLayoutFromDom()
    checkedCrop({ ...axis })
    reboundImg()
  }

  const changeScale = (value: number = DEFAULT_ZOOM_STEP) => {
    if (!imgs.value) {
      return
    }
    updateWrapLayoutFromDom()
    const nextScale = Math.max(MIN_SCALE, layout.imgAxis.scale + Number(value))
    setScale(Number.isFinite(nextScale) ? nextScale : layout.imgAxis.scale)
  }

  const zoomIn = (step: number = DEFAULT_ZOOM_STEP) => {
    changeScale(layout.imgAxis.scale * getValidZoomStep(step))
  }

  const zoomOut = (step: number = DEFAULT_ZOOM_STEP) => {
    changeScale(-layout.imgAxis.scale * getValidZoomStep(step))
  }

  return {
    setRotate,
    rotateLeft,
    rotateRight,
    rotateClear,
    reload,
    setRotateAngle,
    setCropLayout,
    setCropAxis,
    changeScale,
    zoomIn,
    zoomOut,
  }
}
