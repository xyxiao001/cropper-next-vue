import { nextTick, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceImgLoad } from '../interface'
import { loadImg, getExif, resetImg, createImgStyle, translateStyle, checkOrientationImage } from '../common'
import { normalizeRotate } from './utils'
import { nextFrame, revokeBlobUrl } from './preview'

type LayoutContainerLike = {
  imgLayout: { width: number; height: number }
  wrapLayout: { width: number; height: number }
  imgAxis: { x: number; y: number; scale: number; rotate: number }
  imgExhibitionStyle: any
}

export const useImagePipeline = (options: {
  canvas: Ref<HTMLCanvasElement | null>
  imgs: Ref<string>
  imgLoading: Ref<boolean>
  cropping: Ref<boolean>
  filter: Ref<((canvas: HTMLCanvasElement) => HTMLCanvasElement) | null>
  mode: Ref<any>
  defaultRotate: Ref<number>
  previewMaxSide: Ref<number>
  layout: LayoutContainerLike
  updateWrapLayoutFromDom: () => void
  createPreviewUrl: (canvas: HTMLCanvasElement) => Promise<string>
  imgLoadEmit: (obj: InterfaceImgLoad) => void
  renderCrop: () => void
  reboundImg: () => void
  queueRealTimeEmit: () => void
}) => {
  const {
    canvas,
    imgs,
    imgLoading,
    cropping,
    filter,
    mode,
    defaultRotate,
    layout,
    updateWrapLayoutFromDom,
    createPreviewUrl,
    imgLoadEmit,
    renderCrop,
    reboundImg,
    queueRealTimeEmit,
  } = options

  // Sequence token used to ignore stale async work when:
  // - user changes `img` quickly
  // - filter/mode triggers a re-render
  // - component unmounts during async operations
  let loadSeq = 0
  let isUnmounted = false

  const renderFilter = (seq: number) => {
    if (!canvas.value) return
    // Filters are allowed to mutate the canvas or return a new canvas instance.
    if (filter.value) {
      let newCanvas = canvas.value
      newCanvas = filter.value(newCanvas) ?? newCanvas
      canvas.value = newCanvas
    }
    createImg(seq)
  }

  const resetImageLayout = () => {
    if (!canvas.value) {
      return false
    }
    updateWrapLayoutFromDom()
    layout.imgLayout = { width: canvas.value.width, height: canvas.value.height }
    const scale = createImgStyle({ ...layout.imgLayout }, { ...layout.wrapLayout }, mode.value)

    const style = translateStyle({
      scale,
      imgStyle: { ...layout.imgLayout },
      layoutStyle: { ...layout.wrapLayout },
      rotate: normalizeRotate(defaultRotate.value),
    })
    layout.imgExhibitionStyle = style.imgExhibitionStyle
    layout.imgAxis = style.imgAxis
    return true
  }

  const createImg = (seq: number) => {
    if (!canvas.value) {
      return
    }
    try {
      resetImageLayout()

      const prevUrl = imgs.value
      createPreviewUrl(canvas.value)
        .then(async url => {
          // Drop results from older loads to avoid "flash back" when user switches images quickly.
          if (isUnmounted || seq !== loadSeq) {
            revokeBlobUrl(url)
            return
          }
          imgs.value = url
          // Replace preview URL, then revoke the old blob URL to avoid memory leaks.
          revokeBlobUrl(prevUrl)
          if (cropping.value) {
            renderCrop()
          }
          reboundImg()
          queueRealTimeEmit()
          await nextTick()
          await nextFrame()
          imgLoading.value = false
        })
        .catch(err => {
          if (isUnmounted || seq !== loadSeq) {
            return
          }
          console.error(err)
          imgs.value = ''
          imgLoading.value = false
        })
    } catch (e) {
      console.error(e)
      imgLoading.value = false
    }
  }

  const checkedImg = async (url: string) => {
    const seq = ++loadSeq
    imgLoading.value = true
    const prevPreviewUrl = imgs.value
    imgs.value = ''
    revokeBlobUrl(prevPreviewUrl)
    canvas.value = null

    let img: HTMLImageElement
    try {
      img = await loadImg(url)
      imgLoadEmit({ type: 'success', message: '图片加载成功' })
    } catch (error) {
      imgLoadEmit({ type: 'error', message: `图片加载失败${error}` })
      imgLoading.value = false
      return false
    }

    // Read EXIF orientation and normalize it before drawing to canvas, so later transforms
    // (move/zoom/rotate/export) are applied on a "visually correct" base image.
    let result = { orientation: -1 }
    try {
      result = await getExif(img)
    } catch {
      result.orientation = 1
    }
    let orientation = result.orientation || -1
    orientation = checkOrientationImage(orientation) as number

    let newCanvas: HTMLCanvasElement = document.createElement('canvas')
    try {
      newCanvas = (resetImg(img, newCanvas, orientation) as any) ?? newCanvas
    } catch (error) {
      console.error(error)
    }

    if (isUnmounted || seq !== loadSeq) {
      imgLoading.value = false
      return false
    }

    canvas.value = newCanvas
    renderFilter(seq)
    return true
  }

  const markUnmounted = () => {
    isUnmounted = true
    loadSeq += 1
    revokeBlobUrl(imgs.value)
  }

  onUnmounted(() => {
    markUnmounted()
  })

  return {
    checkedImg,
    markUnmounted,
    resetImageLayout,
  }
}
