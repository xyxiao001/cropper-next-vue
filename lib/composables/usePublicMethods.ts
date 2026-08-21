import type { Ref } from 'vue'
import type { InterfaceLayoutInput, InterfaceAxis, InterfaceImgAxis } from '../interface'
import { translateStyle } from '../common'
import { normalizeRotate } from './utils'

type LayoutContainerLike = {
  imgLayout: { width: number; height: number }
  wrapLayout: { width: number; height: number }
  imgAxis: InterfaceImgAxis
  imgExhibitionStyle: any
  cropAxis: InterfaceAxis
}

export const usePublicMethods = (options: {
  imgs: Ref<string>
  img: Ref<string>
  imgLoading: Ref<boolean>
  layout: LayoutContainerLike
  cropLayout: Ref<InterfaceLayoutInput>
  innerCropLayout: Ref<InterfaceLayoutInput>
  checkedImg: (url: string) => Promise<boolean> | boolean
  updateWrapLayoutFromDom: () => void
  renderCrop: (axis?: InterfaceAxis) => void
  checkedCrop: (axis: InterfaceAxis) => void
  reboundImg: () => void
  setScale: (scale: number) => void
  queueRealTimeEmit: () => void
  resetImageLayout: () => boolean
  cancelPendingRebound: () => void
}) => {
  const {
    imgs,
    img,
    imgLoading,
    layout,
    cropLayout,
    innerCropLayout,
    checkedImg,
    updateWrapLayoutFromDom,
    renderCrop,
    checkedCrop,
    reboundImg,
    setScale,
    queueRealTimeEmit,
    resetImageLayout,
    cancelPendingRebound,
  } = options

  const DEFAULT_ZOOM_STEP = 0.1

  const getValidZoomStep = (step: number = DEFAULT_ZOOM_STEP) => {
    const value = Math.abs(Number(step))
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_ZOOM_STEP
  }

  const setRotate = (rotate: number, shouldRebound: boolean = true) => {
    const { x, y, scale, flipX, flipY } = layout.imgAxis
    const axis = { x, y }
    const style = translateStyle(
      {
        scale,
        imgStyle: { ...layout.imgLayout },
        layoutStyle: { ...layout.wrapLayout },
        rotate,
        flipX,
        flipY,
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

  const setFlip = (flipX: boolean, flipY: boolean) => {
    if (!imgs.value) {
      return
    }
    const style = translateStyle(
      {
        scale: layout.imgAxis.scale,
        imgStyle: { ...layout.imgLayout },
        layoutStyle: { ...layout.wrapLayout },
        rotate: layout.imgAxis.rotate,
        flipX,
        flipY,
      },
      { x: layout.imgAxis.x, y: layout.imgAxis.y },
    )
    layout.imgExhibitionStyle = style.imgExhibitionStyle
    layout.imgAxis = style.imgAxis
    queueRealTimeEmit()
  }

  const flipHorizontal = () => {
    setFlip(!layout.imgAxis.flipX, layout.imgAxis.flipY)
  }

  const flipVertical = () => {
    setFlip(layout.imgAxis.flipX, !layout.imgAxis.flipY)
  }

  const reload = () => {
    if (!img.value) {
      imgs.value = ''
      imgLoading.value = false
      return false
    }
    return checkedImg(img.value)
  }

  const reset = () => {
    if (!imgs.value) {
      return
    }
    cancelPendingRebound()
    innerCropLayout.value = { ...cropLayout.value }
    resetImageLayout()
    renderCrop()
    reboundImg()
    queueRealTimeEmit()
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
    const nextScale = layout.imgAxis.scale + Number(value)
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
    flipHorizontal,
    flipVertical,
    reload,
    reset,
    setRotateAngle,
    setCropLayout,
    setCropAxis,
    changeScale,
    zoomIn,
    zoomOut,
  }
}
