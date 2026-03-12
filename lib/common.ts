import exif from './exif'

import type {
  InterfaceLayoutStyle,
  InterfaceModeHandle,
  InterfaceRenderImgLayout,
  InterfaceAxis,
  InterfaceImgAxis,
  InterfaceBoundary,
} from './interface'

// 图片方向校验
import Conversion from './conversion'
const conversion = new Conversion()

// 图片布局
import layout from './layoutBox'

// 加载图片方法
export const loadImg = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
    // 判断如果不是base64图片 再添加crossOrigin属性，否则会导致iOS低版本(10.2)无法显示图片
    if (url.substr(0, 4) !== 'data') {
      img.crossOrigin = ''
    }
  })
}

// 获取图片的 orientation角度
export const getExif = (img: HTMLImageElement): Promise<any> => {
  return exif.getData(img)
}

// 重置图片
export const resetImg = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement | null,
  orientation: number,
): HTMLCanvasElement | null => {
  if (!canvas) return canvas;
  return conversion.render(img, canvas, orientation)
}

export const getVersion = (name: string) => {
  if (typeof navigator === 'undefined') {
    return ['0', '0', '0']
  }
  const arr = navigator.userAgent.split(' ')
  let chromeVersion = ''
  let result: string[] = ['0', '0', '0']
  const reg = new RegExp(name, 'i')
  for (let i = 0; i < arr.length; i++) {
    if (reg.test(arr[i])) {
      chromeVersion = arr[i]
    }
  }
  if (chromeVersion) {
    result = chromeVersion.split('/')[1].split('.')
  }
  return result
}

export const checkOrientationImage = (orientation: number) => {
  // 如果是 chrome内核版本在81 safari 在 605 以上不处理图片旋转
  // alert(navigator.userAgent)
  if (Number(getVersion('chrome')[0]) >= 81) {
    return -1
  }
  if (Number(getVersion('safari')[0]) >= 605) {
    const safariVersion = getVersion('version')
    if (Number(safariVersion[0]) > 13 && Number(safariVersion[1]) > 1) {
      return -1
    }
  }

   //  判断 ios 版本进行处理
   // 针对 ios 版本大于 13.4的系统不做图片旋转
    const isIos  =
      typeof navigator !== 'undefined'
        ? navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/)
        : null
  if (isIos) {
    const version = isIos[1].split('_').map(item => Number(item))
    if (version[0] > 13 ||  (version[0] >= 13 && version[1] >= 4)) {
      return -1
    }
    if (Number(getVersion('Firefox')[0]) >= 97) {
      return -1
    }
    return orientation
  }
  return orientation
}
// 给出图片的大小和容器大小 还有布局方式， 返回布局。
export const createImgStyle = (
  imgStyle: InterfaceLayoutStyle,
  layoutStyle: InterfaceLayoutStyle,
  mode: keyof InterfaceModeHandle,
): number => {
  return layout(imgStyle, layoutStyle, mode)
}

export const translateStyle = (style: InterfaceRenderImgLayout, axis?: InterfaceAxis): any => {
  const { scale, imgStyle, layoutStyle, rotate } = style
  const curStyle = {
    width: scale * imgStyle.width,
    height: scale * imgStyle.height,
  }
  // 图片坐标， 如果不传坐标， 默认是居中布局
  let x = (layoutStyle.width - curStyle.width) / 2
  let y = (layoutStyle.height - curStyle.height) / 2

  if (axis) {
    x = axis.x
    y = axis.y
  }

  // 通过坐标轴 计算图片的布局， 默认不旋转的计算
  // const left = x / scale
  // const top = y / scale
  const left = ((curStyle.width - imgStyle.width) / 2 + x) / scale
  const top = ((curStyle.height - imgStyle.height) / 2 + y) / scale

  // console.log(imgStyle, layoutStyle, curStyle, left, top, 'x--y-', x, y)
  return {
    imgExhibitionStyle: {
      width: `${imgStyle.width}px`,
      height: `${imgStyle.height}px`,
      transform: `scale(${scale}, ${scale}) translate3d(${left}px, ${top}px, 0px) rotateZ(${rotate}deg)`,
    },
    // 返回左上角的坐标轴
    imgAxis: {
      x,
      y,
      scale,
      rotate,
    },
  }
}

interface CropImageOptions {
  type?: 'base64' | 'blob'
  outputType: string
  outputSize?: number
  full?: boolean
  original?: boolean
  maxSideLength?: number
  url: string
  imgAxis: InterfaceImgAxis
  imgLayout: InterfaceLayoutStyle
  cropLayout: InterfaceLayoutStyle
  cropAxis: InterfaceAxis
  cropping: boolean
}

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  outputType: string,
  outputSize: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error('canvas toBlob failed'))
      },
      `image/${outputType}`,
      outputSize,
    )
  })
}

// 加载文件函数
export const loadFile = async (file: File): Promise<any> => {
  if (!file) {
    return ''
  }
  if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|WEBP|webp)$/.test(file.name)) {
    alert('图片类型必须是.gif,jpeg,jpg,png,bmp,webp中的一种')
    return ''
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event: Event) => {
      let data: string = ''
      const targetTwo = event.target as FileReader
      if (typeof targetTwo.result === 'object' && targetTwo.result) {
        data = window.URL.createObjectURL(new Blob([targetTwo.result]))
      } else {
        data = targetTwo.result as string
      }
      resolve(data)
    }
    reader.onerror = reject
    // 转化为blob
    reader.readAsArrayBuffer(file)
  })
}

/**
 * #### 获取绘制了图片的 canvas, 不旋转为图片大小，
 * #### 旋转则为 Math.sqrt(width * width + height * height)
 * @param { image, imgLayout, rotate, scale }
 * @return { HTMLCanvasElement }
 */
export const getImgCanvas = (
  img: HTMLImageElement,
  imgLayout: InterfaceLayoutStyle,
  rotate: number = 0,
  scale: number = 1,
): HTMLCanvasElement => {
  // 图片放在外部加载 这里不处理图片加载
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  let { width, height } = imgLayout
  let dx = 0
  let dy = 0
  let max = 0

  width = width * scale
  height = height * scale

  canvas.width = width
  canvas.height = height

  if (rotate) {
    // 坐标  nx = (x - cx) * cos A - (y - cy) * sinA   ny = (y - cy) * cosA + (x - cx) * sinA
    // 表示存在角度
    max = Math.ceil(Math.sqrt(width * width + height * height))
    canvas.width = max
    canvas.height = max
    ctx.translate(max / 2, max / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    dx = -max / 2 + (max - width) / 2
    dy = -max / 2 + (max - height) / 2
  }

  ctx.drawImage(img, dx, dy, width, height)
  ctx.restore()
  return canvas
}

/**
 * 生成最终截图函数
 * @param options
 */
export const getCropImgData = async (options: CropImageOptions): Promise<string | Blob> => {
  const {
    type = 'base64',
    url,
    imgLayout,
    imgAxis,
    cropAxis,
    cropLayout,
    outputType,
    outputSize = 1,
    full = true,
    original = false,
    maxSideLength,
    cropping,
  } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  // 加载图片
  let img: HTMLImageElement
  try {
    img = await loadImg(url)
  } catch (e) {
    console.log(e)
    img = new Image()
  }
  return new Promise((resolve, reject) => {
    try {
      const enforceMaxSideLength = Number.isFinite(maxSideLength) ? maxSideLength! : 3000

      const axisScale = Number.isFinite(imgAxis.scale) && imgAxis.scale > 0 ? imgAxis.scale : 1
      const coordinateScale = original ? 1 / axisScale : 1
      const canvasScale = original ? 1 : Math.max(1, axisScale)
      const drawScale = original ? 1 : axisScale / canvasScale

      const scaledCropAxis = {
        x: cropAxis.x * coordinateScale,
        y: cropAxis.y * coordinateScale,
      }
      const scaledCropLayout = {
        width: cropLayout.width * coordinateScale,
        height: cropLayout.height * coordinateScale,
      }
      const scaledImgAxis = {
        ...imgAxis,
        x: imgAxis.x * coordinateScale,
        y: imgAxis.y * coordinateScale,
      }

      const imgCanvas = getImgCanvas(img, imgLayout, imgAxis.rotate, canvasScale)
      let dx = scaledImgAxis.x - scaledCropAxis.x
      let dy = scaledImgAxis.y - scaledCropAxis.y
      let width = scaledCropLayout.width
      let height = scaledCropLayout.height

      if (!cropping) {
        width = imgCanvas.width * drawScale
        height = imgCanvas.height * drawScale
        dx = 0
        dy = 0
      }

      if (imgAxis.rotate && cropping) {
        const unrotatedWidth = imgLayout.width * (original ? 1 : axisScale)
        const unrotatedHeight = imgLayout.height * (original ? 1 : axisScale)
        dx -= (imgCanvas.width * drawScale - unrotatedWidth) / 2
        dy -= (imgCanvas.height * drawScale - unrotatedHeight) / 2
      }

      const pixelRatio =
        full && typeof window !== 'undefined'
          ? Math.max(1, window.devicePixelRatio || 1)
          : 1
      let renderRatio = pixelRatio
      if (enforceMaxSideLength > 0) {
        const maxEdge = Math.max(width * renderRatio, height * renderRatio)
        if (maxEdge > enforceMaxSideLength) {
          renderRatio *= enforceMaxSideLength / maxEdge
        }
      }
      canvas.width = Math.max(1, Math.round(width * renderRatio))
      canvas.height = Math.max(1, Math.round(height * renderRatio))
      ctx.scale(renderRatio, renderRatio)

      ctx.imageSmoothingEnabled = true
      if ('imageSmoothingQuality' in ctx) {
        ctx.imageSmoothingQuality = 'high'
      }

      // 是否填充背景颜色 transparent
      // const fillColor = 'transparent'
      // ctx.fillStyle = fillColor
      // ctx.fillRect(0, 0, width, height)

      // 绘制图片
      ctx.drawImage(imgCanvas, dx, dy, imgCanvas.width * drawScale, imgCanvas.height * drawScale)
      ctx.restore()
      if (type === 'blob') {
        canvasToBlob(canvas, outputType, outputSize).then(resolve).catch(reject)
        return
      }
      // 输出图片
      const res = canvas.toDataURL(`image/${outputType}`, outputSize)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 边界计算函数 -> 返回图片应该要放大到多少，以及各个方向的最大坐标点
 *  返回参数 包括是否在边界内， 以及需要往哪个方向进行回弹
 * 如果判断图片够不够大，是否进行放大处理， 即宽度 高度要比截图框大
 * 截图的 x 小于 图片的 x  那么图片需要往左移动
 * 截图框的 x + w  大于 图片的 x + w 那么图片需要右移
 * 截图 y 小于 图片的 y  那么图片上移
 * 截图的 y + h 大于 图片的 y + h 图片需要下移
 * @param  { cropAxis, cropLayout, imgAxis, imgLayout}
 * @return { top, right, bottom, left, scale}
 */
export const boundaryCalculation = (
  cropAxis: InterfaceAxis,
  cropLayout: InterfaceLayoutStyle,
  imgAxis: InterfaceImgAxis,
  imgLayout: InterfaceLayoutStyle,
): InterfaceBoundary => {
  const boundary: InterfaceBoundary = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    scale: 1,
  }
  const rotate = (imgAxis.rotate * Math.PI) / 180
  const cropPoints = [
    { x: cropAxis.x, y: cropAxis.y },
    { x: cropAxis.x + cropLayout.width, y: cropAxis.y },
    { x: cropAxis.x + cropLayout.width, y: cropAxis.y + cropLayout.height },
    { x: cropAxis.x, y: cropAxis.y + cropLayout.height },
  ]

  const rotatedCropPoints = cropPoints.map(point => rotatePoint(point, -rotate))
  const cropRangeX =
    Math.max(...rotatedCropPoints.map(point => point.x)) -
    Math.min(...rotatedCropPoints.map(point => point.x))
  const cropRangeY =
    Math.max(...rotatedCropPoints.map(point => point.y)) -
    Math.min(...rotatedCropPoints.map(point => point.y))

  const scale = Math.max(
    imgAxis.scale,
    cropRangeX / imgLayout.width,
    cropRangeY / imgLayout.height,
  )
  const imgWidth = imgLayout.width * scale
  const imgHeight = imgLayout.height * scale
  const halfWidth = imgWidth / 2
  const halfHeight = imgHeight / 2

  const allowedCenterMinX = Math.max(...rotatedCropPoints.map(point => point.x - halfWidth))
  const allowedCenterMaxX = Math.min(...rotatedCropPoints.map(point => point.x + halfWidth))
  const allowedCenterMinY = Math.max(...rotatedCropPoints.map(point => point.y - halfHeight))
  const allowedCenterMaxY = Math.min(...rotatedCropPoints.map(point => point.y + halfHeight))

  const currentCenter = {
    x: imgAxis.x + halfWidth,
    y: imgAxis.y + halfHeight,
  }
  const rotatedCenter = rotatePoint(currentCenter, -rotate)
  const targetCenter = rotatePoint(
    {
      x: clamp(rotatedCenter.x, allowedCenterMinX, allowedCenterMaxX),
      y: clamp(rotatedCenter.y, allowedCenterMinY, allowedCenterMaxY),
    },
    rotate,
  )

  boundary.scale = scale
  boundary.left = targetCenter.x - halfWidth
  boundary.right = targetCenter.x - halfWidth
  boundary.top = targetCenter.y - halfHeight
  boundary.bottom = targetCenter.y - halfHeight
  return boundary
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const rotatePoint = (point: InterfaceAxis, angle: number): InterfaceAxis => {
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  }
}

/**
 * 边界校验函数, 截图框应该被包裹在容器里面
 * @param  { cropAxis, cropLayout, imgAxis, imgLayout}
 * @return
 */

export const detectionBoundary = (
  cropAxis: InterfaceAxis,
  cropLayout: InterfaceLayoutStyle,
  imgAxis: InterfaceImgAxis,
  imgLayout: InterfaceLayoutStyle,
) => {
  // 横向的方向
  let landscape = ''
  // 纵向的方向
  let portrait = ''
  // 判断横向
  const boundary: InterfaceBoundary = boundaryCalculation(cropAxis, cropLayout, imgAxis, imgLayout)

  const scale = boundary.scale
  const precision = 0.5

  if (imgAxis.x > boundary.left + precision) {
    landscape = 'left'
  } else if (imgAxis.x < boundary.right - precision) {
    landscape = 'right'
  }

  if (imgAxis.y > boundary.top + precision) {
    portrait = 'top'
  } else if (imgAxis.y < boundary.bottom - precision) {
    portrait = 'bottom'
  }

  return {
    landscape,
    portrait,
    scale,
    boundary,
    imgAxis,
  }
}

/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * you can visit 'https://www.zhangxinxu.com/study/201612/how-to-use-tween-js.html' to get effect
 */
export const tween = {
  easeInOut: (t: number, b: number, c: number, d: number) => {
    t = (t / d) * 2
    if (t < 1) {
      return (c / 2) * t * t + b
    }
    return (-c / 2) * (--t * (t - 2) - 1) + b
  },
}

export const setAnimation = (
  from: number,
  to: number,
  duration: number,
  callback?: (value: number) => void,
) => {
  if (duration <= 0 || from === to) {
    if (callback) {
      callback(to)
    }
    return (): number => 0
  }
  // 算法需要的几个变量
  let start = 0
  // during根据设置的总时间计算
  const during = Math.max(1, Math.ceil(duration / 17))
  // 动画请求帧
  let req: number = 0

  const step = () => {
    const value = tween.easeInOut(start, from, to - from, during)
    start++
    // 如果还没有运动到位，继续
    if (start <= during) {
      if (callback) {
        callback(value)
      }
      req = requestAnimationFrame(step)
    } else {
      // 动画结束，这里可以插入回调...
      if (callback) {
        callback(to)
      }
    }
  }
  step()
  return (): number => req
}
