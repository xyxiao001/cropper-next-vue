import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkOrientationImage,
  createImgStyle,
  detectionBoundary,
  getVersion,
  setAnimation,
  translateStyle,
} from '../lib/common'

describe('common helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('reads browser version fragments from userAgent', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 Chrome/120.0.0 Safari/605.1.15',
    )

    expect(getVersion('chrome')[0]).toBe('120')
  })

  it('skips orientation fix on modern browsers', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 Chrome/120.0.0 Safari/605.1.15',
    )

    expect(checkOrientationImage(6)).toBe(-1)
  })

  it('keeps legacy safari orientation handling when needed', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 Version/13.1 Safari/604.1',
    )

    expect(checkOrientationImage(8)).toBe(8)
  })

  it('skips orientation fix for newer ios and firefox runtimes', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) Firefox/97.0 Safari/604.1',
    )

    expect(checkOrientationImage(3)).toBe(-1)
  })

  it('creates centered transform styles', () => {
    const result = translateStyle(
      {
        scale: 2,
        rotate: 30,
        imgStyle: { width: 100, height: 50 },
        layoutStyle: { width: 300, height: 300 },
      },
    )

    expect(result.imgAxis).toEqual({
      x: 50,
      y: 100,
      scale: 2,
      rotate: 30,
    })
    expect(result.imgExhibitionStyle.transform).toContain('rotateZ(30deg)')
  })

  it('delegates image layout mode calculation', () => {
    expect(
      createImgStyle({ width: 100, height: 50 }, { width: 200, height: 200 }, 'cover'),
    ).toBe(4)
  })

  it('keeps unrotated image inside crop box', () => {
    const result = detectionBoundary(
      { x: 50, y: 50 },
      { width: 100, height: 100 },
      { x: 40, y: 40, scale: 1, rotate: 0 },
      { width: 200, height: 200 },
    )

    expect(result.landscape).toBe('')
    expect(result.portrait).toBe('')
    expect(result.boundary.left).toBe(40)
    expect(result.boundary.top).toBe(40)
  })

  it('recomputes rotated image bounds', () => {
    const result = detectionBoundary(
      { x: 100, y: 100 },
      { width: 80, height: 80 },
      { x: 90, y: 90, scale: 1, rotate: 45 },
      { width: 120, height: 120 },
    )

    expect(result.scale).toBeGreaterThanOrEqual(1)
    expect(result.boundary.left).toBeTypeOf('number')
    expect(result.boundary.top).toBeTypeOf('number')
  })

  it('applies immediate animation updates when duration is zero', () => {
    const callback = vi.fn()

    setAnimation(0, 10, 0, callback)

    expect(callback).toHaveBeenCalledWith(10)
  })
})
