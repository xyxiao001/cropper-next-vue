import { afterEach, describe, expect, it, vi } from 'vitest'

describe('library entry runtime guards', () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame
  const originalCancelAnimationFrame = window.cancelAnimationFrame

  afterEach(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame
    window.cancelAnimationFrame = originalCancelAnimationFrame
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('installs animation frame polyfills when browser APIs are missing', async () => {
    // Force the entry module to exercise its browser fallback branch.
    window.requestAnimationFrame = undefined as never
    window.cancelAnimationFrame = undefined as never

    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')

    await import('../lib/index')

    expect(typeof window.requestAnimationFrame).toBe('function')
    expect(typeof window.cancelAnimationFrame).toBe('function')

    const id = window.requestAnimationFrame(() => undefined)
    window.cancelAnimationFrame(id)

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
