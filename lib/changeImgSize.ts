import type { InterfaceLayoutStyle } from './interface'

// 当前是否在缩放
let scaling = false

// 图片放大还是缩小
// 当前变化系数 1px像素大小对应 - 0.2
const BASE_COE = 0.2
const MAX_COE = 0.4
const SCALE_IDLE_DELAY = 180

let coe = BASE_COE
let coeStatus = ''
let scaleTimer: ReturnType<typeof window.setTimeout> | null = null
let resetTimer: ReturnType<typeof window.setTimeout> | null = null

// 火狐的变化量需要单独处理
const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') > -1

// 取得浏览器的userAgent字符
export const isIE =
  typeof window !== 'undefined' && (!!window.ActiveXObject || 'ActiveXObject' in window)

export const resetWheelZoomState = () => {
  scaling = false
  coe = BASE_COE
  coeStatus = ''
  if (scaleTimer !== null) {
    clearTimeout(scaleTimer)
    scaleTimer = null
  }
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
}

export const changeImgSize = (e: any, scale: number, imgStyle: InterfaceLayoutStyle): number => {
  // 获取到变化量
  let change = e.deltaY || e.wheelDelta
  let nowScale: number = scale
  if (isFirefox) {
    change = change * 30
  }
  if (isIE) {
    change = -change
  }

  // 延迟0.1s 每次放大大或者缩小的范围
  const status = change < 0 ? 'add' : 'reduce'
  if (status !== coeStatus) {
    coeStatus = status
    coe = BASE_COE
  }

  // 当前变化系数 1px像素大小对应 - 0.2
  const nowCoe = coe / imgStyle.width
  const num = nowCoe * change

  if (num < 0) {
    nowScale += Math.abs(num)
  }

  if (num > 0 && scale > Math.abs(num)) {
    nowScale -= Math.abs(num)
  }

  if (!scaling) {
    scaling = true
    scaleTimer = window.setTimeout(() => {
      scaling = false
      coe = Math.min(MAX_COE, coe + 0.01)
      scaleTimer = null
    }, 100)
  }

  if (resetTimer !== null) {
    clearTimeout(resetTimer)
  }
  resetTimer = window.setTimeout(resetWheelZoomState, SCALE_IDLE_DELAY)

  return nowScale
}

export const changeImgSizeByTouch = (value: number, scale: number): number => {
  const nowScale = value * scale
  return nowScale
}

export const supportWheel =
  typeof document !== 'undefined' && 'onwheel' in document.createElement('div')
    ? 'wheel'
    : 'mousewheel'
