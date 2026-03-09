import { beforeEach, describe, expect, it, vi } from 'vitest'
import { changeImgSize, changeImgSizeByTouch, supportWheel } from '../lib/changeImgSize'

describe('changeImgSize', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shrinks image when wheel delta is positive', () => {
    const scale = changeImgSize({ deltaY: 50 }, 1, { width: 100, height: 100 })
    expect(scale).toBeLessThan(1)
  })

  it('grows image when wheel delta is negative', () => {
    const scale = changeImgSize({ deltaY: -50 }, 1, { width: 100, height: 100 })
    expect(scale).toBeGreaterThan(1)
  })

  it('scales by touch ratio', () => {
    expect(changeImgSizeByTouch(1.5, 2)).toBe(3)
  })

  it('detects supported wheel event name', () => {
    expect(['wheel', 'mousewheel']).toContain(supportWheel)
  })
})
