import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useInteractions } from '../lib/composables/useInteractions'

const createInteractions = (options: {
  centerBox?: boolean
  movable?: boolean
  zoomable?: boolean
} = {}) => {
  const layout = {
    imgLayout: { width: 100, height: 80 },
    wrapLayout: { width: 300, height: 200 },
    imgAxis: { x: 50, y: 40, scale: 1, rotate: 0, flipX: false, flipY: false },
    imgExhibitionStyle: {},
    cropAxis: { x: 0, y: 0 },
  }

  const queueRealTimeEmit = vi.fn()
  const interactions = useInteractions({
    cropperImg: ref<HTMLElement>(),
    cropperBox: ref<HTMLElement>(),
    cropperRef: ref<HTMLElement>(),
    layout,
    cropping: ref(true),
    centerBox: ref(options.centerBox ?? false),
    centerWrapper: ref(false),
    movable: ref(options.movable ?? true),
    zoomable: ref(options.zoomable ?? true),
    zoomAnchor: ref('center'),
    effectiveCropLayoutStyle: ref({ width: 200, height: 160 }),
    getBoundaryDuration: () => 100,
    queueRealTimeEmit,
    clampScale: scale => Math.min(Math.max(scale, 0.5), 2),
  })

  return { layout, interactions, queueRealTimeEmit }
}

describe('useInteractions scale anchor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it('keeps the existing image-center zoom behavior without an anchor', () => {
    const { layout, interactions } = createInteractions()

    interactions.setScale(2)

    expect(layout.imgAxis).toMatchObject({ x: 0, y: 0, scale: 2 })
  })

  it('keeps the image point under a fixed pointer while scaling', () => {
    const { layout, interactions } = createInteractions()

    interactions.setScale(2, false, {
      previous: { x: 150, y: 100 },
      current: { x: 150, y: 100 },
    })

    expect(layout.imgAxis).toMatchObject({ x: -50, y: -20, scale: 2 })
  })

  it('uses the previous and current touch centers while pinching', () => {
    const { layout, interactions } = createInteractions()

    interactions.setScale(2, false, {
      previous: { x: 150, y: 100 },
      current: { x: 160, y: 110 },
    })

    expect(layout.imgAxis).toMatchObject({ x: -40, y: -10, scale: 2 })
  })

  it('cancels a pending rebound before resetting state', () => {
    const { interactions, queueRealTimeEmit } = createInteractions({ centerBox: true })

    interactions.setScale(2)
    interactions.cancelPendingRebound()
    vi.runAllTimers()

    expect(queueRealTimeEmit).toHaveBeenCalledTimes(1)
  })

  it('invalidates an in-flight rebound animation before resetting state', () => {
    const { layout, interactions } = createInteractions({ centerBox: true })

    interactions.reboundImg()
    interactions.cancelPendingRebound()
    vi.runAllTimers()

    expect(layout.imgAxis.scale).toBe(1)
  })

  it('does not move the image or crop box when movable is false', () => {
    const { layout, interactions, queueRealTimeEmit } = createInteractions({ movable: false })

    interactions.moveImg({ type: 'down-to-move', change: { x: 10, y: 20 } })
    interactions.moveCrop({ type: 'down-to-move', change: { x: 30, y: 40 } })

    expect(layout.imgAxis).toMatchObject({ x: 50, y: 40 })
    expect(layout.cropAxis).toEqual({ x: 0, y: 0 })
    expect(queueRealTimeEmit).not.toHaveBeenCalled()
  })

  it('does not pinch zoom when zoomable is false', () => {
    const { layout, interactions, queueRealTimeEmit } = createInteractions({ zoomable: false })

    interactions.moveScale({ type: 'down-to-scale', scale: 2 })

    expect(layout.imgAxis.scale).toBe(1)
    expect(queueRealTimeEmit).not.toHaveBeenCalled()
  })

  it('keeps position fixed when an anchored zoom exceeds the range', () => {
    const { layout, interactions, queueRealTimeEmit } = createInteractions()

    interactions.setScale(3, false, {
      previous: { x: 150, y: 100 },
      current: { x: 150, y: 100 },
    })
    const atMax = { ...layout.imgAxis }
    interactions.setScale(4, false, {
      previous: { x: 10, y: 10 },
      current: { x: 20, y: 20 },
    })

    expect(layout.imgAxis).toEqual(atMax)
    expect(queueRealTimeEmit).toHaveBeenCalledTimes(1)
  })
})
