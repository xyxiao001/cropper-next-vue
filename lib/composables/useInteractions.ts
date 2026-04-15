import { ref } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceAxis, InterfaceMessageEvent } from '../interface'
import { translateStyle, detectionBoundary, setAnimation } from '../common'
import { changeImgSizeByTouch } from '../changeImgSize'
import { RESISTANCE } from '../config'
import TouchEvent from '../touch'

type LayoutContainerLike = {
  imgLayout: { width: number; height: number }
  wrapLayout: { width: number; height: number }
  imgAxis: { x: number; y: number; scale: number; rotate: number }
  imgExhibitionStyle: any
  cropAxis: InterfaceAxis
}

type CropLayoutLike = { width: number; height: number }

export const useInteractions = (options: {
  cropperImg: Ref<HTMLElement | undefined>
  cropperBox: Ref<HTMLElement | undefined>
  layout: LayoutContainerLike
  cropping: Ref<boolean>
  centerBox: Ref<boolean>
  centerWrapper: Ref<boolean>
  effectiveCropLayoutStyle: Ref<CropLayoutLike>
  getBoundaryDuration: () => number
  queueRealTimeEmit: () => void
}) => {
  const {
    cropperImg,
    cropperBox,
    layout,
    cropping,
    centerBox,
    centerWrapper,
    effectiveCropLayoutStyle,
    getBoundaryDuration,
    queueRealTimeEmit,
  } = options

  const setWaitFunc = ref<ReturnType<typeof window.setTimeout> | null>(null)
  const isImgTouchScale = ref(false)

  let cropImg: TouchEvent | null = null
  let cropBox: TouchEvent | null = null

  const setImgAxis = (axis: InterfaceAxis) => {
    const style = translateStyle(
      {
        scale: layout.imgAxis.scale,
        imgStyle: { ...layout.imgLayout },
        layoutStyle: { ...layout.wrapLayout },
        rotate: layout.imgAxis.rotate,
      },
      axis,
    )
    layout.imgExhibitionStyle = style.imgExhibitionStyle
    layout.imgAxis = style.imgAxis
    queueRealTimeEmit()
  }

  const reboundImg = (): void => {
    isImgTouchScale.value = false
    if (!centerBox.value && !centerWrapper.value) {
      return
    }
    const boundaryDuration = getBoundaryDuration()
    let crossing
    if (centerBox.value) {
      crossing = detectionBoundary(
        { ...layout.cropAxis },
        { ...effectiveCropLayoutStyle.value },
        { ...layout.imgAxis },
        { ...layout.imgLayout },
      )
    } else {
      crossing = detectionBoundary(
        { x: 0, y: 0 },
        { ...layout.wrapLayout },
        { ...layout.imgAxis },
        { ...layout.imgLayout },
      )
    }

    if (layout.imgAxis.scale < crossing.scale) {
      setAnimation(layout.imgAxis.scale, crossing.scale, boundaryDuration, value => {
        setScale(value, true)
      })
    }

    if (crossing.landscape === 'left') {
      setAnimation(layout.imgAxis.x, crossing.boundary.left, boundaryDuration, value => {
        setImgAxis({
          x: value,
          y: layout.imgAxis.y,
        })
      })
    }

    if (crossing.landscape === 'right') {
      setAnimation(layout.imgAxis.x, crossing.boundary.right, boundaryDuration, value => {
        setImgAxis({
          x: value,
          y: layout.imgAxis.y,
        })
      })
    }

    if (crossing.portrait === 'top') {
      setAnimation(layout.imgAxis.y, crossing.boundary.top, boundaryDuration, value => {
        setImgAxis({
          x: layout.imgAxis.x,
          y: value,
        })
      })
    }

    if (crossing.portrait === 'bottom') {
      setAnimation(layout.imgAxis.y, crossing.boundary.bottom, boundaryDuration, value => {
        setImgAxis({
          x: layout.imgAxis.x,
          y: value,
        })
      })
    }

    queueRealTimeEmit()
  }

  const setScale = (scale: number, keep: boolean = false) => {
    const axis = {
      x: layout.imgAxis.x,
      y: layout.imgAxis.y,
    }
    if (!keep) {
      axis.x -= (layout.imgLayout.width * (scale - layout.imgAxis.scale)) / 2
      axis.y -= (layout.imgLayout.height * (scale - layout.imgAxis.scale)) / 2
    }

    const style = translateStyle(
      {
        scale,
        imgStyle: { ...layout.imgLayout },
        layoutStyle: { ...layout.wrapLayout },
        rotate: layout.imgAxis.rotate,
      },
      axis,
    )
    layout.imgExhibitionStyle = style.imgExhibitionStyle
    layout.imgAxis = style.imgAxis
    queueRealTimeEmit()

    if (setWaitFunc.value !== null) {
      clearTimeout(setWaitFunc.value)
    }
    const boundaryDuration = getBoundaryDuration()
    setWaitFunc.value = setTimeout(() => {
      reboundImg()
    }, boundaryDuration)
  }

  const checkedCrop = (axis: InterfaceAxis) => {
    const maxLeft = 0
    const maxTop = 0
    const cropWidth = effectiveCropLayoutStyle.value.width
    const cropHeight = effectiveCropLayoutStyle.value.height
    const maxRight = layout.wrapLayout.width - cropWidth
    const maxBottom = layout.wrapLayout.height - cropHeight
    if (axis.x < maxLeft) {
      axis.x = maxLeft
    }

    if (axis.y < maxTop) {
      axis.y = maxTop
    }

    if (axis.x > maxRight) {
      axis.x = maxRight
    }

    if (axis.y > maxBottom) {
      axis.y = maxBottom
    }

    layout.cropAxis = axis
    cropping.value = true
    queueRealTimeEmit()
  }

  const clearCrop = () => {
    layout.cropAxis = {
      x: 0,
      y: 0,
    }
    cropping.value = false
  }

  const moveImg = (message: InterfaceMessageEvent) => {
    if (!message.change) return

    const axis = {
      x: message.change.x + layout.imgAxis.x,
      y: message.change.y + layout.imgAxis.y,
    }

    if (centerBox.value || centerWrapper.value) {
      // Apply the same "resistance while dragging" behavior for both modes:
      // - centerBox: constrain image within crop box
      // - centerWrapper: constrain image within wrapper container
      const crossing = centerBox.value
        ? detectionBoundary(
            { ...layout.cropAxis },
            { ...effectiveCropLayoutStyle.value },
            { ...layout.imgAxis },
            { ...layout.imgLayout },
          )
        : detectionBoundary(
            { x: 0, y: 0 },
            { ...layout.wrapLayout },
            { ...layout.imgAxis },
            { ...layout.imgLayout },
          )

      if (crossing.landscape !== '' || crossing.portrait !== '') {
        axis.x = layout.imgAxis.x + message.change.x * RESISTANCE
        axis.y = layout.imgAxis.y + message.change.y * RESISTANCE
      }
    }

    setImgAxis(axis)
  }

  const moveScale = (message: InterfaceMessageEvent) => {
    isImgTouchScale.value = true
    if (message.scale) {
      const scale = changeImgSizeByTouch(message.scale, layout.imgAxis.scale)
      setScale(scale)
    }
  }

  const moveCrop = (message: InterfaceMessageEvent) => {
    if (isImgTouchScale.value) return
    if (message.change) {
      const axis = {
        x: message.change.x + layout.cropAxis.x,
        y: message.change.y + layout.cropAxis.y,
      }
      checkedCrop(axis)
    }
  }

  const bindMoveImg = (): void => {
    unbindMoveImg()
    const domImg = cropperImg.value
    if (!domImg) return
    cropImg = new TouchEvent(domImg)
    cropImg.on('down-to-move', moveImg)
    cropImg.on('down-to-scale', moveScale)
    cropImg.on('up', reboundImg)
  }

  const unbindMoveImg = (): void => {
    if (cropImg) {
      cropImg.off('down-to-move', moveImg)
      cropImg.off('up', reboundImg)
      cropImg.off('down-to-scale', moveScale)
      cropImg = null
    }
  }

  const bindMoveCrop = (): void => {
    unbindMoveCrop()
    const domBox = cropperBox.value
    if (!domBox) {
      return
    }
    cropBox = new TouchEvent(domBox)
    cropBox.on('down-to-move', moveCrop)
    cropBox.on('down-to-scale', moveScale)
    cropBox.on('up', reboundImg)
  }

  const unbindMoveCrop = (): void => {
    if (cropBox) {
      cropBox.off('down-to-move', moveCrop)
      cropBox.off('down-to-scale', moveScale)
      cropBox.off('up', reboundImg)
      cropBox = null
    }
  }

  return {
    bindMoveImg,
    unbindMoveImg,
    bindMoveCrop,
    unbindMoveCrop,
    setScale,
    setImgAxis,
    reboundImg,
    checkedCrop,
    clearCrop,
  }
}
