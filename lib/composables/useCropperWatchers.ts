import { nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceAxis, InterfaceLayoutInput } from '../interface'

type LayoutContainerLike = {
  cropAxis: InterfaceAxis
  imgAxis: { x: number; y: number }
}

export const useCropperWatchers = (options: {
  img: Ref<string>
  imgs: Ref<string>
  imgLoading: Ref<boolean>
  cropping: Ref<boolean>
  filter: Ref<((canvas: HTMLCanvasElement) => HTMLCanvasElement) | null>
  mode: Ref<any>
  defaultRotate: Ref<number>
  cropLayout: Ref<InterfaceLayoutInput>
  wrapperStyle: Ref<any>
  effectiveCropLayoutStyle: Ref<{ width: number; height: number }>
  cropBoxConstraintsEnabled: Ref<boolean>
  shouldShowCropBox: Ref<boolean>
  centerBox: Ref<boolean>
  centerWrapper: Ref<boolean>
  cropResizing: Ref<boolean>
  innerCropLayout: Ref<InterfaceLayoutInput>
  layout: LayoutContainerLike

  checkedImg: (url: string) => Promise<boolean> | boolean
  bindMoveImg: () => void
  bindMoveCrop: () => void
  unbindMoveCrop: () => void
  renderCrop: (axis?: InterfaceAxis) => void
  setImgAxis: (axis: InterfaceAxis) => void
  reboundImg: () => void
  updateWrapLayoutFromDom: () => void
  normalizeRotate: (rotate: number) => number
  setRotate: (rotate: number) => void
}) => {
  const {
    img,
    imgs,
    imgLoading,
    cropping,
    filter,
    mode,
    defaultRotate,
    cropLayout,
    wrapperStyle,
    effectiveCropLayoutStyle,
    cropBoxConstraintsEnabled,
    shouldShowCropBox,
    centerBox,
    centerWrapper,
    cropResizing,
    innerCropLayout,
    layout,
    checkedImg,
    bindMoveImg,
    bindMoveCrop,
    unbindMoveCrop,
    renderCrop,
    setImgAxis,
    reboundImg,
    updateWrapLayoutFromDom,
    normalizeRotate,
    setRotate,
  } = options

  watch(img, (val) => {
    if (val && val !== imgs.value) {
      checkedImg(val)
    }
  })

  watch(imgs, (val) => {
    if (val) {
      nextTick(() => {
        bindMoveImg()
      })

      if (cropping.value && shouldShowCropBox.value) {
        nextTick(() => {
          bindMoveCrop()
        })
      }
    }
  })

  watch(cropping, (val) => {
    if (val && shouldShowCropBox.value) {
      nextTick(() => {
        bindMoveCrop()
      })
    }
  })

  watch(filter, () => {
    imgLoading.value = true
    checkedImg(img.value)
  })

  watch(mode, () => {
    imgLoading.value = true
    checkedImg(img.value)
  })

  watch(defaultRotate, (val) => {
    setRotate(normalizeRotate(val))
  })

  watch(
    cropLayout,
    (val) => {
      innerCropLayout.value = { ...val }
    },
    { deep: true },
  )

  watch(
    wrapperStyle,
    async () => {
      await nextTick()
      updateWrapLayoutFromDom()
      if (!imgs.value) {
        return
      }
      if (cropping.value) {
        renderCrop({ ...layout.cropAxis })
      }
      setImgAxis({ x: layout.imgAxis.x, y: layout.imgAxis.y })
      reboundImg()
    },
    { deep: true, flush: 'post' },
  )

  watch(
    [effectiveCropLayoutStyle, cropBoxConstraintsEnabled],
    ([, constraintsEnabled], [, previousConstraintsEnabled]) => {
      if (!imgs.value) {
        return
      }
      if (cropping.value) {
        renderCrop(constraintsEnabled && !previousConstraintsEnabled
          ? undefined
          : { ...layout.cropAxis })
      }
      if (!cropResizing.value) {
        reboundImg()
      }
    },
    { deep: true },
  )

  watch(
    shouldShowCropBox,
    (val) => {
      if (!imgs.value) {
        return
      }
      if (val && cropping.value) {
        nextTick(() => {
          bindMoveCrop()
        })
        return
      }
      unbindMoveCrop()
    },
    { flush: 'post' },
  )

  watch(centerBox, (val) => {
    if (val) {
      reboundImg()
    }
  })

  watch(centerWrapper, (val) => {
    if (val) {
      reboundImg()
    }
  })
}
