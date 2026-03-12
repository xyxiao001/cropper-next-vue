import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCropImgData,
  getImgCanvas,
  loadFile,
  loadImg,
  resetImg,
} from '../lib/common'

class MockImage {
  crossOrigin: string | null = null
  onload: null | (() => void) = null
  onerror: null | ((error?: Error) => void) = null
  width = 120
  height = 80
  private _src = ''

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
    queueMicrotask(() => {
      if (value.includes('fail')) {
        this.onerror?.(new Error('load failed'))
      } else {
        this.onload?.()
      }
    })
  }
}

class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: null | ((event: Event) => void) = null
  onerror: null | ((error?: Error) => void) = null

  readAsArrayBuffer(file: File) {
    this.result = file.name.includes('buffer')
      ? new Uint8Array([1, 2, 3]).buffer
      : 'data:image/png;base64,ZmFrZQ=='
    this.onload?.({ target: this } as unknown as Event)
  }
}

describe('common runtime helpers', () => {
  const OriginalImage = globalThis.Image
  const OriginalFileReader = globalThis.FileReader
  let drawImage: ReturnType<typeof vi.fn>

  beforeEach(() => {
    globalThis.Image = MockImage as never
    globalThis.FileReader = MockFileReader as never

    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    })
    drawImage = vi.fn()
    vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(window, 'alert').mockImplementation(() => undefined)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
      translate: vi.fn(),
      rotate: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,canvas',
    )
  })

  afterEach(() => {
    globalThis.Image = OriginalImage
    globalThis.FileReader = OriginalFileReader
    vi.restoreAllMocks()
  })

  it('loads remote images with crossOrigin enabled', async () => {
    const img = await loadImg('https://example.com/demo.jpg')

    expect(img.crossOrigin).toBe('')
    expect(img.src).toBe('https://example.com/demo.jpg')
  })

  it('loads data urls without forcing crossOrigin', async () => {
    const img = await loadImg('data:image/png;base64,ZmFrZQ==')

    expect(img.crossOrigin).toBeNull()
  })

  it('rejects unsupported file types', async () => {
    const file = new File(['x'], 'demo.txt', { type: 'text/plain' })

    await expect(loadFile(file)).resolves.toBe('')
    expect(window.alert).toHaveBeenCalled()
  })

  it('reads file uploads into object urls', async () => {
    const file = new File(['x'], 'demo-buffer.png', { type: 'image/png' })

    await expect(loadFile(file)).resolves.toBe('blob:mock-url')
    expect(window.URL.createObjectURL).toHaveBeenCalled()
  })

  it('builds rotated image canvases', () => {
    const img = new Image()
    const canvas = getImgCanvas(img, { width: 100, height: 50 }, 45, 1.5)

    expect(canvas.width).toBeGreaterThan(150)
    expect(canvas.height).toBe(canvas.width)
  })

  it('renders crop output for the visible crop box', async () => {
    await expect(
      getCropImgData({
        outputType: 'png',
        outputSize: 0.8,
        full: true,
        url: 'https://example.com/demo.jpg',
        imgAxis: { x: 10, y: 20, scale: 1, rotate: 0 },
        imgLayout: { width: 120, height: 80 },
        cropLayout: { width: 60, height: 40 },
        cropAxis: { x: 5, y: 5 },
        cropping: true,
      }),
    ).resolves.toBe('data:image/png;base64,canvas')
  })

  it('returns the whole image canvas when cropping is disabled', async () => {
    await expect(
      getCropImgData({
        outputType: 'jpeg',
        outputSize: 0.6,
        full: false,
        url: 'https://example.com/demo.jpg',
        imgAxis: { x: 10, y: 20, scale: 1.2, rotate: 30 },
        imgLayout: { width: 120, height: 80 },
        cropLayout: { width: 60, height: 40 },
        cropAxis: { x: 5, y: 5 },
        cropping: false,
      }),
    ).resolves.toBe('data:image/png;base64,canvas')
  })

  it('returns blob output when requested', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(callback => {
      callback(new Blob(['crop'], { type: 'image/png' }))
    })

    await expect(
      getCropImgData({
        type: 'blob',
        outputType: 'png',
        outputSize: 0.9,
        full: true,
        url: 'https://example.com/demo.jpg',
        imgAxis: { x: 10, y: 20, scale: 1, rotate: 0 },
        imgLayout: { width: 120, height: 80 },
        cropLayout: { width: 60, height: 40 },
        cropAxis: { x: 5, y: 5 },
        cropping: true,
      }),
    ).resolves.toBeInstanceOf(Blob)
  })

  it('scales export resolution from display scale when original is enabled', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function (this: HTMLCanvasElement) {
      return `${this.width}x${this.height}`
    })

    await expect(
      getCropImgData({
        outputType: 'png',
        outputSize: 1,
        full: false,
        original: true,
        url: 'https://example.com/demo.jpg',
        imgAxis: { x: 10, y: 20, scale: 0.5, rotate: 0 },
        imgLayout: { width: 120, height: 80 },
        cropLayout: { width: 60, height: 40 },
        cropAxis: { x: 5, y: 5 },
        cropping: true,
      }),
    ).resolves.toBe('120x80')
  })

  it('renders downscaled output from a full-resolution rotated canvas by default', async () => {
    await getCropImgData({
      outputType: 'png',
      outputSize: 1,
      full: false,
      url: 'https://example.com/demo.jpg',
      imgAxis: { x: 10, y: 20, scale: 0.5, rotate: 45 },
      imgLayout: { width: 120, height: 80 },
      cropLayout: { width: 60, height: 40 },
      cropAxis: { x: 5, y: 5 },
      cropping: true,
    })

    const args = drawImage.mock.calls[drawImage.mock.calls.length - 1]
    expect(args[0]).toBeInstanceOf(HTMLCanvasElement)
    expect(args[3]).toBe(72.5)
    expect(args[4]).toBe(72.5)
  })

  it('clamps export canvas size with maxSideLength', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function (this: HTMLCanvasElement) {
      return `${this.width}x${this.height}`
    })

    await expect(
      getCropImgData({
        outputType: 'png',
        outputSize: 1,
        full: true,
        maxSideLength: 3000,
        url: 'https://example.com/demo.jpg',
        imgAxis: { x: 0, y: 0, scale: 1, rotate: 0 },
        imgLayout: { width: 120, height: 80 },
        cropLayout: { width: 4000, height: 4000 },
        cropAxis: { x: 0, y: 0 },
        cropping: true,
      }),
    ).resolves.toBe('3000x3000')
  })

  it('keeps null canvases untouched when resetting orientation', () => {
    const img = new Image()

    expect(resetImg(img, null, 6)).toBeNull()
  })

  it('renders oriented images onto a provided canvas', () => {
    const img = new Image()
    const canvas = document.createElement('canvas')

    expect(resetImg(img, canvas, 6)).toBe(canvas)
  })
})
