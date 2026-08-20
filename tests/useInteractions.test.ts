import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useInteractions } from '../lib/composables/useInteractions'

const createInteractions = () => {
  const layout = {
    imgLayout: { width: 100, height: 80 },
    wrapLayout: { width: 300, height: 200 },
    imgAxis: { x: 50, y: 40, scale: 1, rotate: 0 },
    imgExhibitionStyle: {},
    cropAxis: { x: 0, y: 0 },
  }

  const interactions = useInteractions({
    cropperImg: ref<HTMLElement>(),
    cropperBox: ref<HTMLElement>(),
    cropperRef: ref<HTMLElement>(),
    layout,
    cropping: ref(true),
    centerBox: ref(false),
    centerWrapper: ref(false),
    zoomAnchor: ref('center'),
    effectiveCropLayoutStyle: ref({ width: 200, height: 160 }),
    getBoundaryDuration: () => 100,
    queueRealTimeEmit: vi.fn(),
  })

  return { layout, interactions }
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
})
