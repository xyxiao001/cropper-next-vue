<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRef, toRefs, useSlots } from 'vue'
import type {
  InterfaceImgLoad,
  InterfaceCropperState,
  InterfaceLayout,
  InterfaceLayoutInput,
  InterfaceModeHandle,
  InterfaceRealTimePreview,
  InterfaceZoomAnchor,
} from './interface'
import { supportWheel, changeImgSize, isIE } from './changeImgSize'
import { BOUNDARY_DURATION } from './config'

import cropperLoading from './loading'
import './styles/index.scss'
import { normalizeRotate } from './composables/utils'
import { useCropLayout } from './composables/useCropLayout'
import { useInteractions } from './composables/useInteractions'
import { useRealTime } from './composables/useRealTime'
import { useCropRender } from './composables/useCropRender'
import { useExport } from './composables/useExport'
import { useImagePipeline } from './composables/useImagePipeline'
import { useDragUpload } from './composables/useDragUpload'
import { useWheelZoom } from './composables/useWheelZoom'
import { useCropperWatchers } from './composables/useCropperWatchers'
import { usePublicMethods } from './composables/usePublicMethods'
import { createLayoutContainer } from './composables/state'
import { useBoundaryDuration } from './composables/useBoundaryDuration'
import { usePreviewFactory } from './composables/usePreviewFactory'
import { useCropperEmits } from './composables/useCropperEmits'
import { useCropState } from './composables/useCropState'

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
  // 预览用最大边长（像素），仅影响预览渲染，不影响导出结果
  previewMaxSide?: number;
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
  // 缩放锚点
  zoomAnchor?: InterfaceZoomAnchor;
  // 是否允许用户拖拽图片和裁剪框
  movable?: boolean;
  // 是否允许用户通过滚轮或双指缩放
  zoomable?: boolean;
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
  previewMaxSide: 2048,
  mode: 'cover',
  cropColor: '#fff',
  defaultRotate: 0,
  centerBox: false,
  centerWrapper: false,
  centerBoxDelay: BOUNDARY_DURATION,
  centerWrapperDelay: BOUNDARY_DURATION,
  zoomAnchor: 'center',
  movable: true,
  zoomable: true,
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
  (e: 'change', payload: InterfaceCropperState): void
}>()
// 图片加载loading
const imgLoading = ref(false)

// 真实图片渲染地址
const imgs = ref('')

const canvas = ref<HTMLCanvasElement | null>(null)

// 绘制图片的canvas
const LayoutContainer = reactive(createLayoutContainer())

// 拖拽
const isDrag = ref(false)

// 裁剪过程中的一些状态
// 处于生成了截图的状态
const cropping = ref(true)

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
  previewMaxSide,
  centerBox,
  cropLayout,
  centerWrapper,
  centerBoxDelay,
  centerWrapperDelay,
  zoomAnchor,
  movable,
  zoomable,
} = toRefs(props);

const {
  wrapperStyle,
  innerCropLayout,
  cropLayoutStyle,
  effectiveCropLayoutStyle,
  shouldShowCropBox,
  isFullCropMode,
  updateWrapLayoutFromDom,
} = useCropLayout({
  props,
  cropperRef,
  layoutContainer: LayoutContainer as any,
  imgs,
  cropping,
})

const { getBoundaryDuration } = useBoundaryDuration({
  centerBox,
  centerWrapper,
  centerBoxDelay,
  centerWrapperDelay,
})

const { imgLoadEmit, imgUploadEmit, emitRealTime, emitChange } = useCropperEmits(emit)

const { queueRealTimeEmit } = useRealTime({
  imgs,
  cropping,
  effectiveCropLayoutStyle,
  layout: LayoutContainer as any,
  emit: emitRealTime,
})

const { queueChangeEmit } = useCropState({
  imgs,
  effectiveCropLayoutStyle,
  layout: LayoutContainer as any,
  emit: emitChange,
})

const queueStateEmit = () => {
  queueRealTimeEmit()
  queueChangeEmit()
}

const {
  bindMoveImg,
  unbindMoveImg,
  bindMoveCrop,
  unbindMoveCrop,
  setScale,
  setImgAxis,
  reboundImg,
  checkedCrop,
  cancelPendingRebound,
} = useInteractions({
  cropperImg,
  cropperBox,
  cropperRef,
  layout: LayoutContainer as any,
  cropping,
  centerBox,
  centerWrapper,
  movable,
  zoomable,
  zoomAnchor,
  effectiveCropLayoutStyle,
  getBoundaryDuration,
  queueRealTimeEmit: queueStateEmit,
})

useDragUpload({
  cropperRef,
  isDrag,
  onUpload: imgUploadEmit,
})

const {
  renderCrop,
  computedClassDrag,
  getCropBoxStyle,
  getCropImgStyle,
} = useCropRender({
  layout: LayoutContainer as any,
  imgs,
  cropping,
  cropLayoutStyle,
  effectiveCropLayoutStyle,
  shouldShowCropBox,
  checkedCrop,
  queueRealTimeEmit: queueStateEmit,
})

// These are replaced as whole objects during interactions; use refs to always read latest values.
const imgAxisRef = toRef(LayoutContainer, 'imgAxis')
const imgLayoutRef = toRef(LayoutContainer, 'imgLayout')
const cropAxisRef = toRef(LayoutContainer, 'cropAxis')

const { getCropData, getCropBlob } = useExport({
  canvas,
  outputType,
  outputSize,
  full,
  original,
  maxSideLength,
  imgAxis: imgAxisRef,
  imgLayout: imgLayoutRef,
  cropAxis: cropAxisRef,
  cropLayout: effectiveCropLayoutStyle,
  cropping,
  url: img,
})

const { createPreviewUrl } = usePreviewFactory({
  previewMaxSide,
  getWrapLayout: () => {
    updateWrapLayoutFromDom()
    return { ...LayoutContainer.wrapLayout }
  },
})

const { checkedImg, resetImageLayout } = useImagePipeline({
  canvas,
  imgs,
  imgLoading,
  cropping,
  filter,
  mode,
  defaultRotate,
  previewMaxSide,
  layout: LayoutContainer as any,
  updateWrapLayoutFromDom,
  createPreviewUrl,
  imgLoadEmit,
  renderCrop: () => renderCrop(),
  reboundImg,
  queueRealTimeEmit: queueStateEmit,
})

const { mouseInCropper, mouseOutCropper } = useWheelZoom({
  isIE,
  supportWheel,
  changeImgSize,
  imgAxis: imgAxisRef,
  imgLayout: imgLayoutRef,
  cropperRef,
  zoomAnchor,
  zoomable,
  setScale,
})

useCropperWatchers({
  img,
  imgs,
  imgLoading,
  cropping,
  filter,
  mode,
  defaultRotate,
  cropLayout,
  wrapperStyle,
  cropLayoutStyle,
  shouldShowCropBox,
  centerBox,
  centerWrapper,
  innerCropLayout,
  layout: LayoutContainer as any,
  checkedImg,
  bindMoveImg,
  bindMoveCrop,
  unbindMoveCrop,
  renderCrop,
  setImgAxis,
  reboundImg,
  updateWrapLayoutFromDom,
  normalizeRotate,
  setRotate: (rotate: number) => setRotate(rotate),
})

const {
  setRotate,
  rotateLeft,
  rotateRight,
  rotateClear,
  reload,
  reset,
  setRotateAngle,
  setCropLayout,
  setCropAxis,
  changeScale,
  zoomIn,
  zoomOut,
} = usePublicMethods({
  imgs,
  img,
  imgLoading,
  layout: LayoutContainer as any,
  cropLayout,
  innerCropLayout,
  checkedImg,
  updateWrapLayoutFromDom,
  renderCrop,
  checkedCrop,
  reboundImg,
  setScale,
  queueRealTimeEmit: queueStateEmit,
  resetImageLayout,
  cancelPendingRebound,
})
onMounted(() => {
  if (props.img) {
    checkedImg(props.img)
  } else {
    imgs.value = ''
  }
})

onUnmounted(() => {
  // 释放滚轮事件绑定
  unbindMoveImg()
  unbindMoveCrop()
})

const slots = useSlots()

defineExpose({
  getCropData,
  getCropBlob,
  rotateLeft,
  rotateRight,
  rotateClear,
  reload,
  reset,
  setRotateAngle,
  setCropLayout,
  setCropAxis,
  changeScale,
  zoomIn,
  zoomOut,
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
    <section v-if="isFullCropMode" class="cropper-full-mask cropper-fade-in" />
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
