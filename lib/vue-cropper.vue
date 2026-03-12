<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, toRefs, watch, useSlots } from 'vue'
import type {
  InterfaceAxis,
  InterfaceImgLoad,
  InterfaceLayout,
  InterfaceLayoutInput,
  InterfaceLength,
  InterfaceLayoutStyle,
  InterfaceMessageEvent,
  InterfaceModeHandle,
  InterfaceRealTimePreview,
  InterfaceTransformStyle,
} from './interface'
import {
  loadImg,
  getExif,
  resetImg,
  createImgStyle,
  translateStyle,
  loadFile,
  getCropImgData,
  detectionBoundary,
  setAnimation,
  checkOrientationImage,
} from './common'
import { supportWheel, changeImgSize, isIE, changeImgSizeByTouch } from './changeImgSize'
import { BOUNDARY_DURATION, RESISTANCE } from './config'

import TouchEvent from './touch'
import cropperLoading from './loading'
import './style/index.scss'

interface InterfaceVueCropperProps {
  // 图片地址
  img?: string;
  // 外层容器宽高
  wrapper?: InterfaceLayout;
  // 截图框大小
  cropLayout?: InterfaceLayoutInput;
  // 主题色
  color?: string;
  // 滤镜函数
  filter?: ((canvas: HTMLCanvasElement) => HTMLCanvasElement) | null;
  // 输出格式
  outputType?: string;
  // 输出质量
  outputSize?: number;
  // 高清导出
  full?: boolean;
  original?: boolean;
  maxSideLength?: number;
  // 布局方式
  mode?: keyof InterfaceModeHandle;
  // 截图框的颜色
  cropColor?: string;
  // 默认旋转角度
  defaultRotate?: number;
  // 截图框是否限制图片里面
  centerBox?: boolean;
  // 图片不能小于外层容易
  centerWrapper?: boolean;
  // 图片限制在截图框内时的回弹时长
  centerBoxDelay?: number;
  // 图片限制在容器内时的回弹时长
  centerWrapperDelay?: number;
}
const props = withDefaults(defineProps<InterfaceVueCropperProps>(), {
  img: '',
  wrapper: () => ({
    width: 300,
    height: 300,
  }),
    // 截图框的大小
  cropLayout: () => ({
    width: 200,
    height: 200,
  }),
  color: '#fff',
  filter: null,
  outputType: 'png',
  outputSize: 1,
  full: true,
  original: false,
  maxSideLength: 3000,
  mode: 'cover',
  cropColor: '#fff',
  defaultRotate: 0,
  centerBox: false,
  centerWrapper: false,
  centerBoxDelay: BOUNDARY_DURATION,
  centerWrapperDelay: BOUNDARY_DURATION,
})
// 组件处理
const cropperRef = ref()
const cropperImg = ref()
const cropperBox = ref()
const emit = defineEmits<{
  (e: 'img-load', obj: InterfaceImgLoad): void,
  (e: 'img-upload', url: string): void
  (e: 'real-time', payload: InterfaceRealTimePreview): void
  (e: 'realTime', payload: InterfaceRealTimePreview): void
}>()
// 图片加载loading
const imgLoading = ref(false)

// 真实图片渲染地址
const imgs = ref('')

// 绘制图片的canvas
let canvas: HTMLCanvasElement | null = null

const LayoutContainer = reactive({
  // 图片真实宽高
  imgLayout: {
    width: 0,
    height: 0,
  },
  // 外层容器宽高
  wrapLayout: {
    width: 0,
    height: 0,
  },
  // 图片属性 包含当前坐标轴和缩放
  imgAxis: {
    x: 0,
    y: 0,
    scale: 0,
    rotate: 0,
  },
  // 图片css 转化之后的展示效果
  imgExhibitionStyle: {
    width: '',
    height: '',
    transform: '',
  },
  // 截图框的坐标
  cropAxis: {
    x: 0,
    y: 0,
  },
  // 截图框的样式， 包含外层和里面
  cropExhibitionStyle: {
    div: {},
    img: {},
  }
})

// 拖拽
const isDrag = ref(false)

// 裁剪过程中的一些状态
// 处于生成了截图的状态
const cropping = ref(true)

let cropImg: TouchEvent | null = null

let cropBox: TouchEvent | null = null

const setWaitFunc = ref<ReturnType<typeof window.setTimeout> | null>(null)

// 图片是否处于双指操作状态，禁止截图框拖动
const isImgTouchScale = ref(false)

// 处理 props
const {
  img,
  filter,
  mode,
  defaultRotate,
  outputType,
  outputSize,
  full,
  original,
  maxSideLength,
  centerBox,
  cropLayout,
  centerWrapper,
  centerBoxDelay,
  centerWrapperDelay,
} = toRefs(props);

let realTimeFrame = 0

const parseLength = (value: InterfaceLength): number => {
  if (typeof value === 'number') {
    return value
  }
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeLengthStyle = (value: InterfaceLength): string => {
  return typeof value === 'number' ? `${value}px` : value
}

const wrapperStyle = computed(() => ({
  ...props.wrapper,
  width: normalizeLengthStyle(props.wrapper.width),
  height: normalizeLengthStyle(props.wrapper.height),
}))

const cropLayoutStyle = computed(() => ({
  width: parseLength(props.cropLayout.width),
  height: parseLength(props.cropLayout.height),
}))

const updateWrapLayoutFromDom = () => {
  if (!cropperRef.value) {
    return
  }
  const width = Number.parseFloat((window.getComputedStyle(cropperRef.value).width || '').replace('px', ''))
  const height = Number.parseFloat((window.getComputedStyle(cropperRef.value).height || '').replace('px', ''))
  if (Number.isFinite(width) && Number.isFinite(height)) {
    LayoutContainer.wrapLayout = { width, height }
  }
}

const effectiveCropLayoutStyle = computed(() => {
  const wrapWidth = LayoutContainer.wrapLayout.width
  const wrapHeight = LayoutContainer.wrapLayout.height
  const cropWidth = cropLayoutStyle.value.width
  const cropHeight = cropLayoutStyle.value.height

  return {
    width: wrapWidth > 0 ? Math.min(cropWidth, wrapWidth) : cropWidth,
    height: wrapHeight > 0 ? Math.min(cropHeight, wrapHeight) : cropHeight,
  }
})

const shouldShowCropBox = computed(() => {
  const wrapWidth = LayoutContainer.wrapLayout.width
  const wrapHeight = LayoutContainer.wrapLayout.height
  if (wrapWidth <= 0 || wrapHeight <= 0) {
    return true
  }
  return (
    effectiveCropLayoutStyle.value.width < wrapWidth ||
    effectiveCropLayoutStyle.value.height < wrapHeight
  )
})

const getBoundaryDuration = () => {
  if (centerBox.value) {
    return Math.max(0, centerBoxDelay.value)
  }
  if (centerWrapper.value) {
    return Math.max(0, centerWrapperDelay.value)
  }
  return BOUNDARY_DURATION
}

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
  if (val) {
    if (shouldShowCropBox.value) {
      nextTick(() => {
        bindMoveCrop()
      })
    }
  }
})

watch(filter, () => {
  imgLoading.value = true;
  checkedImg(img.value)
})

watch(mode, () => {
  imgLoading.value = true;
  checkedImg(img.value)
})

watch(defaultRotate, (val) => {
  setRotate(val)
})

watch(
  wrapperStyle,
  async () => {
    await nextTick()
    updateWrapLayoutFromDom()
    if (!imgs.value) {
      return
    }
    if (cropping.value) {
      renderCrop({ ...LayoutContainer.cropAxis })
    }
    setImgAxis({ x: LayoutContainer.imgAxis.x, y: LayoutContainer.imgAxis.y })
    reboundImg()
  },
  { deep: true, flush: 'post' },
)

watch(
  cropLayoutStyle,
  () => {
    if (!imgs.value) {
      return
    }
    if (cropping.value) {
      renderCrop({ ...LayoutContainer.cropAxis })
    }
    reboundImg()
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

const imgLoadEmit = (obj: InterfaceImgLoad) => {
  emit('img-load', obj);
}

const imgUploadEmit = (url: string) => {
  emit('img-upload', url);
}

const getRealTimePreview = (): InterfaceRealTimePreview | null => {
  if (!imgs.value || !cropping.value) {
    return null
  }

  const scale = LayoutContainer.imgAxis.scale
  const transformX =
    ((LayoutContainer.imgLayout.width * (scale - 1)) / 2 +
      (LayoutContainer.imgAxis.x - LayoutContainer.cropAxis.x)) /
    scale
  const transformY =
    ((LayoutContainer.imgLayout.height * (scale - 1)) / 2 +
      (LayoutContainer.imgAxis.y - LayoutContainer.cropAxis.y)) /
    scale
  const transform = `scale(${scale}, ${scale}) translate3d(${transformX}px, ${transformY}px, 0) rotateZ(${LayoutContainer.imgAxis.rotate}deg)`
  const width = effectiveCropLayoutStyle.value.width
  const height = effectiveCropLayoutStyle.value.height

  return {
    w: width,
    h: height,
    url: imgs.value,
    img: {
      width: `${LayoutContainer.imgLayout.width}px`,
      height: `${LayoutContainer.imgLayout.height}px`,
      transform,
    },
    html: `<div class="show-preview" style="width: ${width}px; height: ${height}px; overflow: hidden"><div style="width: ${width}px; height: ${height}px"><img src="${imgs.value}" style="width: ${LayoutContainer.imgLayout.width}px; height: ${LayoutContainer.imgLayout.height}px; transform: ${transform}"></div></div>`,
  }
}

const emitRealTime = () => {
  const payload = getRealTimePreview()
  if (!payload) {
    return
  }
  emit('real-time', payload)
  emit('realTime', payload)
}

const queueRealTimeEmit = () => {
  if (realTimeFrame) {
    cancelAnimationFrame(realTimeFrame)
  }
  realTimeFrame = requestAnimationFrame(() => {
    realTimeFrame = 0
    emitRealTime()
  })
}

const drop = (e: DragEvent) => {
  e.preventDefault()
  const dataTransfer = e.dataTransfer as DataTransfer
  isDrag.value = false
  loadFile(dataTransfer.files[0]).then(res => {
    if (res) {
      imgUploadEmit(res)
    }
  })
}

const dragover = (e: Event) => {
  e.preventDefault()
  isDrag.value = true
}

const dragend = (e: Event) => {
  e.preventDefault()
  isDrag.value = false
}

// 检查图片, 修改图片为正确角度
const checkedImg = async (url: string) => {
  imgLoading.value = true
  imgs.value = ''
  canvas = null
  let img: HTMLImageElement
  try {
    img = await loadImg(url)
    imgLoadEmit({
      type: 'success',
      message: '图片加载成功',
    })
  } catch (error) {
    imgLoadEmit({
      type: 'error',
      message: `图片加载失败${error}`,
    })
    imgLoading.value = false
    return false
  }
  // 图片加载成功之后的操作 获取图片旋转角度
  let result = {
    orientation: -1,
  }
  try {
    result = await getExif(img)
  } catch (error) {
    result.orientation = 1
  }
  let orientation = result.orientation || -1
  orientation = checkOrientationImage(orientation) as number
  
  let newCanvas: HTMLCanvasElement = document.createElement('canvas')
  try {
    newCanvas = await resetImg(img, newCanvas, orientation) ?? newCanvas
  } catch (error) {
    console.error(error)
  }
  canvas = newCanvas
  renderFilter()
}

// 滤镜渲染
const renderFilter = () => {
  if (filter.value) {
    let newCanvas = canvas as HTMLCanvasElement
    newCanvas = filter.value(newCanvas) ?? newCanvas
    canvas = newCanvas
  }
  createImg()
}

// 生成新图片
const createImg = () => {
  if (!canvas) {
    return
  }
  try {
    canvas.toBlob(
      async blob => {
        if (blob) {
          URL.revokeObjectURL(imgs.value)
          const url = URL.createObjectURL(blob)
          let scale = 1
          try {
            scale = await renderImgLayout(url)
          } catch (e) {
            console.error(e)
          }
          const style = translateStyle({
            scale,
            imgStyle: { ...LayoutContainer.imgLayout },
            layoutStyle: { ...LayoutContainer.wrapLayout },
            rotate: defaultRotate.value,
          })
          LayoutContainer.imgExhibitionStyle = style.imgExhibitionStyle
          LayoutContainer.imgAxis = style.imgAxis
          imgs.value = url
          // 渲染截图框
          if (cropping.value) {
            renderCrop()
          }
          reboundImg()
          queueRealTimeEmit()
          imgLoading.value = false
        } else {
          imgs.value = ''
          imgLoading.value = false
        }
      },
      `image/${outputType.value}`,
      1,
    )
  } catch (e) {
    console.error(e)
    imgLoading.value = false
  }
}

// 渲染图片布局
const renderImgLayout = async (url: string): Promise<number> => {
  let img: HTMLImageElement
  try {
    img = await loadImg(url)
    imgLoadEmit({
      type: 'success',
      message: '图片加载成功',
    })
  } catch (error) {
    imgLoadEmit({
      type: 'error',
      message: `图片加载失败${error}`,
    })
    imgLoading.value = false
    return 1;
  }
  const wrapper = {
    width: 0,
    height: 0,
  }
  if (cropperRef.value) {
    wrapper.width = Number(
    (window.getComputedStyle(cropperRef.value).width || '').replace('px', ''),
    )
    wrapper.height = Number(
      (window.getComputedStyle(cropperRef.value).height || '').replace('px', ''),
    )
  }
  LayoutContainer.imgLayout = {
    width: img.width,
    height: img.height,
  }
  LayoutContainer.wrapLayout = { ...wrapper }

  return createImgStyle({ ...LayoutContainer.imgLayout }, wrapper, mode.value)
}

// 鼠标移入截图组件
const mouseInCropper = () => {
  if (isIE) {
    window.addEventListener(supportWheel, mouseScroll)
  } else {
    window.addEventListener(supportWheel, mouseScroll, {
      passive: false,
    })
  }
}

// 鼠标移出截图组件
const mouseOutCropper = () => {
  // console.log('remove')
  window.removeEventListener(supportWheel, mouseScroll)
}

// 鼠标滚动事件
const mouseScroll = (e: Event) => {
  e.preventDefault()
  const scale = changeImgSize(e, LayoutContainer.imgAxis.scale, LayoutContainer.imgLayout)
  setScale(scale)
  // console.log('scroll')
}
onMounted(() => {
  if (props.img) {
    checkedImg(props.img)
  } else {
    imgs.value = ''
  }
  // 添加拖拽上传
  const dom = cropperRef.value
  dom.addEventListener('dragover', dragover, false)
  dom.addEventListener('dragend', dragend, false)
  dom.addEventListener('drop', drop, false)
})

onUnmounted(() => {
  if (realTimeFrame) {
    cancelAnimationFrame(realTimeFrame)
    realTimeFrame = 0
  }
  cropperRef.value?.removeEventListener('drop', drop, false)
  cropperRef.value?.removeEventListener('dragover', dragover, false)
  cropperRef.value?.removeEventListener('dragend', dragend, false)
  unbindMoveImg()
  unbindMoveCrop()
})

// 修改图片缩放比例函数
const setScale = (scale: number, keep: boolean = false) => {
  // 保持当前坐标比例
  const axis = {
    x: LayoutContainer.imgAxis.x,
    y: LayoutContainer.imgAxis.y,
  }
  if (!keep) {
    axis.x -= (LayoutContainer.imgLayout.width * (scale - LayoutContainer.imgAxis.scale)) / 2
    axis.y -= (LayoutContainer.imgLayout.height * (scale - LayoutContainer.imgAxis.scale)) / 2
  }

  const style = translateStyle(
    {
      scale,
      imgStyle: { ...LayoutContainer.imgLayout },
      layoutStyle: { ...LayoutContainer.wrapLayout },
      rotate: LayoutContainer.imgAxis.rotate,
    },
    axis,
  )
  LayoutContainer.imgExhibitionStyle = style.imgExhibitionStyle
  LayoutContainer.imgAxis = style.imgAxis
  queueRealTimeEmit()
  // 设置完成图片大小后去校验 图片的坐标轴
  if (setWaitFunc.value !== null) {
    clearTimeout(setWaitFunc.value)
  }
  const boundaryDuration = getBoundaryDuration()
  setWaitFunc.value = setTimeout(() => {
    reboundImg()
  }, boundaryDuration)
}

// 移动图片
const moveImg = (message: InterfaceMessageEvent) => {
  // 拿到的是变化之后的坐标轴
  if (message.change) {
    // console.log(message.change)
    // 去更改图片的位置
    const axis = {
      x: message.change.x + LayoutContainer.imgAxis.x,
      y: message.change.y + LayoutContainer.imgAxis.y,
    }

    if (centerBox.value) {
      // 这个时候去校验下是否图片已经被拖拽出了不可限制区域，添加回弹
      const crossing = detectionBoundary(
        { ...LayoutContainer.cropAxis },
        { ...effectiveCropLayoutStyle.value },
        { ...LayoutContainer.imgAxis },
        { ...LayoutContainer.imgLayout },
      )

      if (crossing.landscape !== '' || crossing.portrait !== '') {
        // 施加拖动阻力 ？是否需要添加越来越大的阻力
        axis.x = LayoutContainer.imgAxis.x + message.change.x * RESISTANCE
        axis.y = LayoutContainer.imgAxis.y + message.change.y * RESISTANCE
      }
    }

    setImgAxis(axis)
  }
}

// 设置图片坐标
const setImgAxis = (axis: InterfaceAxis) => {
  const style = translateStyle(
    {
      scale: LayoutContainer.imgAxis.scale,
      imgStyle: { ...LayoutContainer.imgLayout },
      layoutStyle: { ...LayoutContainer.wrapLayout },
      rotate: LayoutContainer.imgAxis.rotate,
    },
    axis,
  )
  LayoutContainer.imgExhibitionStyle = style.imgExhibitionStyle
  LayoutContainer.imgAxis = style.imgAxis
  queueRealTimeEmit()
}

// 回弹图片
const reboundImg = (): void => {
  isImgTouchScale.value = false
  if (!centerBox.value && !centerWrapper.value) {
    return
  }
  const boundaryDuration = getBoundaryDuration()
  let crossing
  // 这个时候去校验下是否图片已经被拖拽出了不可限制区域，添加回弹
  if (centerBox.value) {
    crossing = detectionBoundary(
      { ...LayoutContainer.cropAxis },
      { ...effectiveCropLayoutStyle.value },
      { ...LayoutContainer.imgAxis },
      { ...LayoutContainer.imgLayout },
    )
  } else {
    crossing = detectionBoundary(
      { x: 0, y: 0 },
      { ...LayoutContainer.wrapLayout },
      { ...LayoutContainer.imgAxis },
      { ...LayoutContainer.imgLayout },
    )
  }
  
  if (LayoutContainer.imgAxis.scale < crossing.scale) {
    setAnimation(LayoutContainer.imgAxis.scale, crossing.scale, boundaryDuration, value => {
      setScale(value, true)
    })
  }

  if (crossing.landscape === 'left') {
    setAnimation(LayoutContainer.imgAxis.x, crossing.boundary.left, boundaryDuration, value => {
      // console.log('set left', value)
      setImgAxis({
        x: value,
        y: LayoutContainer.imgAxis.y,
      })
    })
  }

  if (crossing.landscape === 'right') {
    setAnimation(LayoutContainer.imgAxis.x, crossing.boundary.right, boundaryDuration, value => {
      setImgAxis({
        x: value,
        y: LayoutContainer.imgAxis.y,
      })
    })
  }

  if (crossing.portrait === 'top') {
    setAnimation(LayoutContainer.imgAxis.y, crossing.boundary.top, boundaryDuration, value => {
      // console.log('set top', value)
      setImgAxis({
        x: LayoutContainer.imgAxis.x,
        y: value,
      })
    })
  }

  if (crossing.portrait === 'bottom') {
    setAnimation(LayoutContainer.imgAxis.y, crossing.boundary.bottom, boundaryDuration, value => {
      setImgAxis({
        x: LayoutContainer.imgAxis.x,
        y: value,
      })
    })
  }

  // console.log('可以开始校验位置，回弹了')
  queueRealTimeEmit()
}

const moveScale = (message: InterfaceMessageEvent)=> {
  isImgTouchScale.value = true
  if (message.scale) {
    const scale = changeImgSizeByTouch(message.scale, LayoutContainer.imgAxis.scale);
    // alert(`${message.scale}${scale}`);
    setScale(scale)
  }
}

// 绑定拖拽
const bindMoveImg = (): void => {
  unbindMoveImg()
  const domImg = cropperImg.value
  cropImg = new TouchEvent(domImg)
  // 图片拖拽绑定
  cropImg.on('down-to-move', moveImg)
  cropImg.on('down-to-scale', moveScale)
  cropImg.on('up', reboundImg)
}

const unbindMoveImg = (): void => {
  if (cropImg) {
    cropImg.off('down-to-move', moveImg)
    cropImg.off('up', reboundImg)
    cropImg.off('down-to-scale', moveScale)
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
  cropImg = null
}

const unbindMoveCrop = (): void => {
  if (cropBox) {
    cropBox.off('down-to-move', moveCrop)
    cropBox.off('down-to-scale', moveScale)
    cropBox.off('up', reboundImg)
    cropBox = null
  }
}

// 设置旋转角度
const setRotate = (rotate: number, shouldRebound: boolean = true) => {
  const { x, y, scale } = LayoutContainer.imgAxis
  const axis = { x, y }
  const style = translateStyle(
    {
      scale,
      imgStyle: { ...LayoutContainer.imgLayout },
      layoutStyle: { ...LayoutContainer.wrapLayout },
      rotate,
    },
    axis,
  )
  LayoutContainer.imgExhibitionStyle = style.imgExhibitionStyle
  LayoutContainer.imgAxis = style.imgAxis
  queueRealTimeEmit()

  // 旋转会改变图片的实际包围范围，需要立即重新做边界校验。
  if (shouldRebound && imgs.value) {
    reboundImg()
  }
}

// 获取截图信息
const getCropData = (type: 'base64' | 'blob' = 'base64') => {
  // 组合数据
  const obj = {
    type,
    outputType: outputType.value,
    outputSize: outputSize.value,
    full: full.value,
    original: original.value,
    maxSideLength: maxSideLength.value,
    url: imgs.value,
    imgAxis: { ...LayoutContainer.imgAxis },
    imgLayout: { ...LayoutContainer.imgLayout },
    cropLayout: { ...effectiveCropLayoutStyle.value },
    cropAxis: { ...LayoutContainer.cropAxis },
    cropping: cropping.value,
  }
  return getCropImgData(obj)
}

const getCropBlob = () => {
  return getCropImgData({
    type: 'blob',
    outputType: outputType.value,
    outputSize: outputSize.value,
    full: full.value,
    original: original.value,
    maxSideLength: maxSideLength.value,
    url: imgs.value,
    imgAxis: { ...LayoutContainer.imgAxis },
    imgLayout: { ...LayoutContainer.imgLayout },
    cropLayout: { ...effectiveCropLayoutStyle.value },
    cropAxis: { ...LayoutContainer.cropAxis },
    cropping: cropping.value,
  }) as Promise<Blob>
}

// 渲染截图框
const renderCrop = (axis?: InterfaceAxis): void => {
  // 如果没有指定截图框的容器位置， 默认截图框为居中布局
  const { width, height } = LayoutContainer.wrapLayout
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
  // 校验截图框位置
  if (axis) {
    checkedCrop(axis)
  } else {
    checkedCrop(defaultAxis)
  }
}

// 移动截图框
const moveCrop = (message: InterfaceMessageEvent) => {
  if (isImgTouchScale.value) return;
  // 拿到的是变化之后的坐标轴
  if (message.change) {
    const axis = {
      x: message.change.x + LayoutContainer.cropAxis.x,
      y: message.change.y + LayoutContainer.cropAxis.y,
    }
    checkedCrop(axis)
  }
}

// 检查截图框位置
const checkedCrop = (axis: InterfaceAxis) => {
  // 截图了默认不允许超过容器
  const maxLeft = 0
  const maxTop = 0
  const cropWidth = effectiveCropLayoutStyle.value.width
  const cropHeight = effectiveCropLayoutStyle.value.height
  const maxRight = LayoutContainer.wrapLayout.width - cropWidth
  const maxBottom = LayoutContainer.wrapLayout.height - cropHeight
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

  LayoutContainer.cropAxis = axis
  cropping.value = true
  queueRealTimeEmit()
}

// 回弹截图框, 如果校验不通过那么截图框需要在指定时间弹回正常的位置

// 清除截图框
const clearCrop = () => {
  LayoutContainer.cropAxis = {
    x: 0,
    y: 0,
  }
  cropping.value = false
}

const rotateLeft = () => {
  setRotate(LayoutContainer.imgAxis.rotate - 90)
}

const rotateRight = () => {
  setRotate(LayoutContainer.imgAxis.rotate + 90)
}

const rotateClear = () => {
  setRotate(0)
}

// 计算拖拽的 class 名
const computedClassDrag = (): string => {
  const className = ['cropper-drag-box']
  if (cropping.value) {
    className.push('cropper-modal')
  }
  return className.join(' ')
}

// 计算截图框外层样式
const getCropBoxStyle = (): InterfaceTransformStyle => {
  const style = {
    width: `${effectiveCropLayoutStyle.value.width}px`,
    height: `${effectiveCropLayoutStyle.value.height}px`,
    transform: `translate3d(${LayoutContainer.cropAxis.x}px, ${LayoutContainer.cropAxis.y}px, 0)`,
  }
  LayoutContainer.cropExhibitionStyle.div = style
  return style
}

// 计算截图框图片的样式
const getCropImgStyle = (): InterfaceTransformStyle => {
  const scale = LayoutContainer.imgAxis.scale
  // 图片放大所带来的扩张坐标补充  加   图片坐标和截图坐标的差值
  const x =
    ((LayoutContainer.imgLayout.width * (scale - 1)) / 2 + (LayoutContainer.imgAxis.x - LayoutContainer.cropAxis.x)) / scale

  const y =
    ((LayoutContainer.imgLayout.height * (scale - 1)) / 2 + (LayoutContainer.imgAxis.y - LayoutContainer.cropAxis.y)) / scale
  const style = {
    width: `${LayoutContainer.imgLayout.width}px`,
    height: `${LayoutContainer.imgLayout.height}px`,
    transform: `scale(${scale}, ${scale}) translate3d(${x}px, ${y}px, 0) rotateZ(${LayoutContainer.imgAxis.rotate}deg)`,
  }
  LayoutContainer.cropExhibitionStyle.img = style
  return style
}

const slots = useSlots()

defineExpose({
  getCropData,
  getCropBlob,
  rotateLeft,
  rotateRight,
  rotateClear,
})
</script>

<template>
  <section
    class="vue-cropper"
    :style="wrapperStyle"
    ref="cropperRef"
    :onMouseover="mouseInCropper"
    :onMouseout="mouseOutCropper"
  >
    <section v-if="imgs" class="cropper-box cropper-fade-in">
      <section
        class="cropper-box-canvas"
        :style="LayoutContainer.imgExhibitionStyle"
      >
        <img :src="imgs" alt="cropper-next-vue" />
      </section>

      <section :class="computedClassDrag()" ref="cropperImg" />
    </section>
    <section
      v-if="cropping && imgs && shouldShowCropBox"
      class="cropper-crop-box cropper-fade-in"
      :style="getCropBoxStyle()"
    >
      <span class="cropper-view-box" :style="{outlineColor: cropColor}">
        <img v-if="img" :src="imgs" :style="getCropImgStyle()" alt="cropper-img" />
      </span>
      <span class="cropper-face cropper-move" ref="cropperBox" />
    </section>
    <section v-if="isDrag" class="drag">
      <slot name="drag">
        <p>拖动图片到此</p>
      </slot>
    </section>
    <cropperLoading :is-visible="imgLoading">
      <template v-if="slots.loading" #default>
        <slot name="loading"></slot>
      </template>
    </cropperLoading>
  </section>
</template>
