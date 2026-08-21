import type { Ref } from 'vue'

export const useScaleLimits = (options: {
  minScale: Ref<number>
  maxScale: Ref<number>
  getBoundaryMin: () => number
}) => {
  const getScaleRange = () => {
    const effectiveMin = Math.max(options.minScale.value, options.getBoundaryMin())
    const effectiveMax = Math.max(options.maxScale.value, effectiveMin)

    return {
      min: effectiveMin,
      max: effectiveMax,
    }
  }

  const clampScale = (scale: number) => {
    const range = getScaleRange()
    return Math.min(Math.max(scale, range.min), range.max)
  }

  return {
    getScaleRange,
    clampScale,
  }
}
