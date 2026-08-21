import { onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceImgAxis, InterfaceRealTimePreview } from '../interface'
import { createTransform } from '../common'

type LayoutContainerLike = {
  imgLayout: { width: number; height: number }
  imgAxis: InterfaceImgAxis
  cropAxis: { x: number; y: number }
}

export const useRealTime = (options: {
  imgs: Ref<string>
  cropping: Ref<boolean>
  effectiveCropLayoutStyle: Ref<{ width: number; height: number }>
  layout: LayoutContainerLike
  emit: (event: 'real-time' | 'realTime', payload: InterfaceRealTimePreview) => void
}) => {
  const { imgs, cropping, effectiveCropLayoutStyle, layout, emit } = options

  let realTimeFrame = 0

  const getRealTimePreview = (): InterfaceRealTimePreview | null => {
    if (!imgs.value || !cropping.value) {
      return null
    }

    const scale = layout.imgAxis.scale
    const transformX =
      ((layout.imgLayout.width * (scale - 1)) / 2 + (layout.imgAxis.x - layout.cropAxis.x)) / scale
    const transformY =
      ((layout.imgLayout.height * (scale - 1)) / 2 + (layout.imgAxis.y - layout.cropAxis.y)) / scale
    const transform = createTransform(
      scale,
      transformX,
      transformY,
      layout.imgAxis.rotate,
      layout.imgAxis.flipX,
      layout.imgAxis.flipY,
      '0',
    )

    const width = effectiveCropLayoutStyle.value.width
    const height = effectiveCropLayoutStyle.value.height

    return {
      w: width,
      h: height,
      url: imgs.value,
      img: {
        width: `${layout.imgLayout.width}px`,
        height: `${layout.imgLayout.height}px`,
        transform,
      },
      html: `<div class="show-preview" style="width: ${width}px; height: ${height}px; overflow: hidden"><div style="width: ${width}px; height: ${height}px"><img src="${imgs.value}" style="width: ${layout.imgLayout.width}px; height: ${layout.imgLayout.height}px; transform: ${transform}"></div></div>`,
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

  onUnmounted(() => {
    if (realTimeFrame) {
      cancelAnimationFrame(realTimeFrame)
      realTimeFrame = 0
    }
  })

  return {
    queueRealTimeEmit,
    getRealTimePreview,
  }
}
