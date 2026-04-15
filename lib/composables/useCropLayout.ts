import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceLayoutInput } from '../interface'
import { normalizeLengthStyle, parseLength } from './utils'

type WrapLayout = { width: number; height: number }

export const useCropLayout = (options: {
  props: { wrapper: any; cropLayout: InterfaceLayoutInput }
  cropperRef: Ref<HTMLElement | undefined>
  layoutContainer: { wrapLayout: WrapLayout }
  imgs: Ref<string>
  cropping: Ref<boolean>
}) => {
  const { props, cropperRef, layoutContainer, imgs, cropping } = options

  const wrapperStyle = computed(() => ({
    ...props.wrapper,
    width: normalizeLengthStyle(props.wrapper.width),
    height: normalizeLengthStyle(props.wrapper.height),
  }))

  const innerCropLayout = ref<InterfaceLayoutInput>({ ...props.cropLayout })

  const cropLayoutStyle = computed(() => ({
    width: parseLength(innerCropLayout.value.width, layoutContainer.wrapLayout.width),
    height: parseLength(innerCropLayout.value.height, layoutContainer.wrapLayout.height),
  }))

  const updateWrapLayoutFromDom = () => {
    if (!cropperRef.value) {
      return
    }
    const width = Number.parseFloat((window.getComputedStyle(cropperRef.value).width || '').replace('px', ''))
    const height = Number.parseFloat((window.getComputedStyle(cropperRef.value).height || '').replace('px', ''))
    if (Number.isFinite(width) && Number.isFinite(height)) {
      layoutContainer.wrapLayout = { width, height }
    }
  }

  const effectiveCropLayoutStyle = computed(() => {
    const wrapWidth = layoutContainer.wrapLayout.width
    const wrapHeight = layoutContainer.wrapLayout.height
    const cropWidth = cropLayoutStyle.value.width
    const cropHeight = cropLayoutStyle.value.height

    return {
      width: wrapWidth > 0 ? Math.min(cropWidth, wrapWidth) : cropWidth,
      height: wrapHeight > 0 ? Math.min(cropHeight, wrapHeight) : cropHeight,
    }
  })

  const shouldShowCropBox = computed(() => {
    const wrapWidth = layoutContainer.wrapLayout.width
    const wrapHeight = layoutContainer.wrapLayout.height
    if (wrapWidth <= 0 || wrapHeight <= 0) {
      return true
    }
    return (
      effectiveCropLayoutStyle.value.width < wrapWidth ||
      effectiveCropLayoutStyle.value.height < wrapHeight
    )
  })

  // When the requested crop box is >= wrapper, we clamp to wrapper size and hide the crop box.
  // In that case, we render a subtle full-frame hint overlay (see template/styles).
  const isFullCropMode = computed(() => {
    return Boolean(imgs.value) && cropping.value && !shouldShowCropBox.value
  })

  return {
    wrapperStyle,
    innerCropLayout,
    cropLayoutStyle,
    effectiveCropLayoutStyle,
    shouldShowCropBox,
    isFullCropMode,
    updateWrapLayoutFromDom,
  }
}

