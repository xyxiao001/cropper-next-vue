import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPreviewUrlFromCanvas } from '../lib/composables/preview'

describe('preview helpers', () => {
  const OriginalImage = globalThis.Image
  const originalCreateObjectURL = window.URL.createObjectURL

  let toBlobSpy: ReturnType<typeof vi.fn>
  let createObjectURLSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Provide a deterministic Image.decode() to avoid JSDOM hanging on `blob:` urls.
    class DecodeImage {
      src = ''
      decode() {
        return Promise.resolve()
      }
    }
    globalThis.Image = DecodeImage as never

    createObjectURLSpy = vi.fn(() => 'blob:preview-test-url')
    window.URL.createObjectURL = createObjectURLSpy

    // Capture the canvas dimensions at the moment `toBlob` is called, which tells us
    // whether downscaling happened and what size we generated.
    toBlobSpy = vi.fn(function (this: HTMLCanvasElement, callback: BlobCallback) {
      callback(new Blob(['preview'], { type: 'image/png' }))
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(toBlobSpy)

    // JSDOM does not implement a real 2d canvas context unless the optional `canvas`
    // dependency is installed. For these unit tests we only need `drawImage` and
    // the smoothing flags to exist.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    } as unknown as CanvasRenderingContext2D)
  })

  afterEach(() => {
    globalThis.Image = OriginalImage
    window.URL.createObjectURL = originalCreateObjectURL
    vi.restoreAllMocks()
  })

  it('downscales preview to respect wrapper size, dpr clamp and previewMaxSide', async () => {
    const src = document.createElement('canvas')
    src.width = 4000
    src.height = 2000

    const url = await createPreviewUrlFromCanvas(src, {
      previewMaxSide: 500,
      getWrapLayout: () => ({ width: 300, height: 300 }),
      getDevicePixelRatio: () => 3, // should clamp to 2 internally
    })

    expect(url).toBe('blob:preview-test-url')
    expect(createObjectURLSpy).toHaveBeenCalled()

    // desiredEdge = min(previewMaxSide=500, targetEdge=300*2=600) = 500
    // scale = 500 / max(4000, 2000) = 0.125 => 500 x 250
    const calledCanvas = toBlobSpy.mock.instances[0] as HTMLCanvasElement
    expect(calledCanvas.width).toBe(500)
    expect(calledCanvas.height).toBe(250)
  })

  it('treats previewMaxSide <= 0 as "no cap"', async () => {
    const src = document.createElement('canvas')
    src.width = 4000
    src.height = 2000

    await createPreviewUrlFromCanvas(src, {
      previewMaxSide: 0,
      getWrapLayout: () => ({ width: 300, height: 300 }),
      getDevicePixelRatio: () => 2,
    })

    // desiredEdge = targetEdge=300*2=600 (no cap), scale = 600/4000 => 600 x 300
    const calledCanvas = toBlobSpy.mock.instances[0] as HTMLCanvasElement
    expect(calledCanvas.width).toBe(600)
    expect(calledCanvas.height).toBe(300)
  })

  it('keeps the source canvas size when no downscaling is needed', async () => {
    const src = document.createElement('canvas')
    src.width = 200
    src.height = 100

    await createPreviewUrlFromCanvas(src, {
      previewMaxSide: 2048,
      getWrapLayout: () => ({ width: 300, height: 300 }),
      getDevicePixelRatio: () => 2,
    })

    const calledCanvas = toBlobSpy.mock.instances[0] as HTMLCanvasElement
    expect(calledCanvas.width).toBe(200)
    expect(calledCanvas.height).toBe(100)
  })
})
