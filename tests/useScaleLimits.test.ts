import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useScaleLimits } from '../lib/composables/useScaleLimits'

describe('useScaleLimits', () => {
  it('clamps scale to the configured range', () => {
    const limits = useScaleLimits({
      minScale: ref(0.5),
      maxScale: ref(2),
      getBoundaryMin: () => 0,
    })

    expect(limits.clampScale(0.1)).toBe(0.5)
    expect(limits.clampScale(1.5)).toBe(1.5)
    expect(limits.clampScale(3)).toBe(2)
  })

  it('lets boundary coverage take priority over the configured maximum', () => {
    const limits = useScaleLimits({
      minScale: ref(0.5),
      maxScale: ref(1),
      getBoundaryMin: () => 1.5,
    })

    expect(limits.getScaleRange()).toEqual({ min: 1.5, max: 1.5 })
    expect(limits.clampScale(0.8)).toBe(1.5)
    expect(limits.clampScale(3)).toBe(1.5)
  })

  it('uses the latest reactive range', () => {
    const minScale = ref(0.5)
    const maxScale = ref(2)
    const limits = useScaleLimits({ minScale, maxScale, getBoundaryMin: () => 0 })

    minScale.value = 1.2
    maxScale.value = 1.4

    expect(limits.clampScale(1)).toBe(1.2)
    expect(limits.clampScale(2)).toBe(1.4)
  })
})
