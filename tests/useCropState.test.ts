import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import { useCropState } from '../lib/composables/useCropState'

describe('useCropState', () => {
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0

  beforeEach(() => {
    frames.clear()
    frameId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      frameId += 1
      frames.set(frameId, callback)
      return frameId
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
      frames.delete(id)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createState = (hasImage = true) => {
    const emit = vi.fn()
    const scope = effectScope()
    const state = scope.run(() => useCropState({
      imgs: ref(hasImage ? 'blob:preview' : ''),
      effectiveCropLayoutStyle: ref({ width: 200, height: 160 }),
      layout: {
        imgAxis: { x: 10, y: 20, scale: 1.5, rotate: 90, flipX: true, flipY: false },
        cropAxis: { x: 30, y: 40 },
      },
      emit,
    }))!
    return { emit, state, scope }
  }

  it('returns a complete cropper state snapshot', () => {
    const { state } = createState()

    expect(state.getCropperState()).toEqual({
      image: { x: 10, y: 20, scale: 1.5, rotate: 90, flipX: true, flipY: false },
      crop: { x: 30, y: 40, width: 200, height: 160 },
    })
  })

  it('does not emit before an image is available', () => {
    const { emit, state } = createState(false)

    state.queueChangeEmit()
    frames.get(1)?.(0)

    expect(state.getCropperState()).toBeNull()
    expect(emit).not.toHaveBeenCalled()
  })

  it('coalesces queued changes into the latest frame', () => {
    const { emit, state } = createState()

    state.queueChangeEmit()
    state.queueChangeEmit()

    expect(frames.size).toBe(1)
    frames.get(2)?.(0)
    expect(emit).toHaveBeenCalledTimes(1)
  })
})
