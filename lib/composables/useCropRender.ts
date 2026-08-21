import { computed } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceAxis, InterfaceImgAxis, InterfaceTransformStyle } from '../interface'
import { createTransform } from '../common'

type LayoutContainerLike = {
  wrapLayout: { width: number; height: number }
  imgLayout: { width: number; height: number }
  imgAxis: InterfaceImgAxis
  cropAxis: InterfaceAxis
  cropExhibitionStyle: { div: any; img: any }
}

export const useCropRender = (options: {
  layout: LayoutContainerLike
  imgs: Ref<string>
  cropping: Ref<boolean>
  cropLayoutStyle: Ref<{ width: number; height: number }>
  effectiveCropLayoutStyle: Ref<{ width: number; height: number }>
  shouldShowCropBox: Ref<boolean>
  checkedCrop: (axis: InterfaceAxis) => void
  queueRealTimeEmit: () => void
}) => {
  const { layout, imgs, cropping, cropLayoutStyle, effectiveCropLayoutStyle, shouldShowCropBox, checkedCrop, queueRealTimeEmit } = options

  const renderCrop = (axis?: InterfaceAxis): void => {
    const { width, height } = layout.wrapLayout
    let cropW = cropLayoutStyle.value.width
    let cropH = cropLayoutStyle.value.height
    if (width > 0) {
      cropW = Math.min(cropW, width)
    }
    if (height > 0) {
      cropH = Math.min(cropH, height)
    }
    const defaultAxis: InterfaceAxis = {
      x: (width - cropW) / 2,
      y: (height - cropH) / 2,
    }
    checkedCrop(axis ? { ...axis } : defaultAxis)
  }

  const computedClassDrag = (): string => {
    const className = ['cropper-drag-box']
    if (cropping.value && shouldShowCropBox.value) {
      className.push('cropper-modal')
    }
    return className.join(' ')
  }

  const getCropBoxStyle = (): InterfaceTransformStyle => {
    const style = {
      width: `${effectiveCropLayoutStyle.value.width}px`,
      height: `${effectiveCropLayoutStyle.value.height}px`,
      transform: `translate3d(${layout.cropAxis.x}px, ${layout.cropAxis.y}px, 0)`,
    }
    layout.cropExhibitionStyle.div = style
    return style
  }

  const getCropImgStyle = (): InterfaceTransformStyle => {
    const scale = layout.imgAxis.scale
    const x =
      ((layout.imgLayout.width * (scale - 1)) / 2 + (layout.imgAxis.x - layout.cropAxis.x)) / scale

    const y =
      ((layout.imgLayout.height * (scale - 1)) / 2 + (layout.imgAxis.y - layout.cropAxis.y)) / scale

    const style = {
      width: `${layout.imgLayout.width}px`,
      height: `${layout.imgLayout.height}px`,
      transform: createTransform(
        scale,
        x,
        y,
        layout.imgAxis.rotate,
        layout.imgAxis.flipX,
        layout.imgAxis.flipY,
        '0',
      ),
    }
    layout.cropExhibitionStyle.img = style
    return style
  }

  const isFullCropMode = computed(() => {
    return Boolean(imgs.value) && cropping.value && !shouldShowCropBox.value
  })

  const onCropAxisChanged = () => {
    // used by external callers if needed
    queueRealTimeEmit()
  }

  return {
    renderCrop,
    computedClassDrag,
    getCropBoxStyle,
    getCropImgStyle,
    isFullCropMode,
    onCropAxisChanged,
  }
}
