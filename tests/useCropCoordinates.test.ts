import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCropCoordinates } from '../lib/composables/useCropCoordinates'

const createCoordinates = (overrides: Record<string, unknown> = {}) => {
  const layout = {
    imgLayout: { width: 100, height: 80 },
    imgAxis: {
      x: 10,
      y: 20,
      scale: 2,
      rotate: 0,
      flipX: false,
      flipY: false,
    },
    cropAxis: { x: 30, y: 40 },
    ...overrides,
  }
  return useCropCoordinates({
    imgs: ref('blob:preview'),
    layout,
    cropLayout: ref({ width: 40, height: 20 }),
  })
}

describe('useCropCoordinates', () => {
  it('maps crop corners to normalized source pixels without transforms', () => {
    const result = createCoordinates().getCropCoordinates()!

    expect(result.points).toEqual([
      { x: 10, y: 10 },
      { x: 30, y: 10 },
      { x: 30, y: 20 },
      { x: 10, y: 20 },
    ])
    expect(result.boundingBox).toEqual({ x: 10, y: 10, width: 20, height: 10 })
    expect(result.source).toEqual({ width: 100, height: 80 })
  })

  it('inverts arbitrary rotation and both screen-axis flips', () => {
    const result = createCoordinates({
      imgAxis: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 45,
        flipX: true,
        flipY: true,
      },
      cropAxis: { x: 50, y: 40 },
    }).getCropCoordinates()!

    expect(result.points[0].x).toBeCloseTo(50, 8)
    expect(result.points[0].y).toBeCloseTo(40, 8)
    expect(result.transform).toEqual({ rotate: 45, flipX: true, flipY: true })
    expect(result.boundingBox.width).toBeCloseTo(60 * Math.SQRT1_2, 8)
    expect(result.boundingBox.height).toBeCloseTo(60 * Math.SQRT1_2, 8)
  })

  it('keeps points outside the source without clamping', () => {
    const result = createCoordinates({ cropAxis: { x: -50, y: -60 } }).getCropCoordinates()!

    expect(result.points[0].x).toBeLessThan(0)
    expect(result.points[0].y).toBeLessThan(0)
  })

  it('returns null when no image is loaded', () => {
    const coordinates = useCropCoordinates({
      imgs: ref(''),
      layout: {
        imgLayout: { width: 100, height: 80 },
        imgAxis: { x: 0, y: 0, scale: 1, rotate: 0, flipX: false, flipY: false },
        cropAxis: { x: 0, y: 0 },
      },
      cropLayout: ref({ width: 20, height: 20 }),
    })

    expect(coordinates.getCropCoordinates()).toBeNull()
  })
})
