import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  changeImgSize,
  changeImgSizeByTouch,
  resetWheelZoomState,
  supportWheel,
} from '../lib/changeImgSize'

describe('changeImgSize', () => {
  beforeEach(() => {
    resetWheelZoomState()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('shrinks image when wheel delta is positive', () => {
    const scale = changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })
    expect(scale).toBeLessThan(1)
  })

  it('grows image when wheel delta is negative', () => {
    const scale = changeImgSize({ deltaY: -50 }, 1, { width: 100, height: 100 })
    expect(scale).toBeGreaterThan(1)
  })

  it('resets wheel acceleration after idle', () => {
    vi.useFakeTimers()

    const firstScale = changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })
    vi.advanceTimersByTime(100)
    const acceleratedScale = changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })
    vi.advanceTimersByTime(180)
    const resetScale = changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })

    expect(acceleratedScale).toBeLessThan(firstScale)
    expect(resetScale).toBeCloseTo(firstScale)
  })

  it('resets wheel acceleration when direction changes', () => {
    vi.useFakeTimers()

    changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })
    vi.advanceTimersByTime(100)

    const scale = changeImgSize({ deltaY: -50 }, 1, { width: 100, height: 100 })
    expect(scale).toBeCloseTo(1.1)
  })

  it('scales by touch ratio', () => {
    expect(changeImgSizeByTouch(1.5, 2)).toBe(3)
  })

  it('detects supported wheel event name', () => {
    expect(['wheel', 'mousewheel']).toContain(supportWheel)
  })
})
