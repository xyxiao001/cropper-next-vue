import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VueCropper from '../lib/vue-cropper.vue'

const { getCropImgData } = vi.hoisted(() => ({
  getCropImgData: vi.fn(),
}))

vi.mock('../lib/common', async () => {
  const actual = await vi.importActual<typeof import('../lib/common')>('../lib/common')

  return {
    ...actual,
    loadImg: vi.fn(async (url: string) => ({ width: 120, height: 80, src: url })),
    getExif: vi.fn(async () => ({ orientation: 1 })),
    resetImg: vi.fn((_: HTMLImageElement, canvas: HTMLCanvasElement | null) => canvas),
    createImgStyle: vi.fn(() => 1),
    translateStyle: vi.fn((style, axis) => {
      const x = axis?.x ?? 0
      const y = axis?.y ?? 0

      return {
        imgExhibitionStyle: {
          width: `${style.imgStyle.width}px`,
          height: `${style.imgStyle.height}px`,
          transform: `scale(${style.scale}, ${style.scale}) translate3d(${x}px, ${y}px, 0) rotateZ(${style.rotate}deg)`,
        },
        imgAxis: {
          x,
          y,
          scale: style.scale,
          rotate: style.rotate,
        },
      }
    }),
    getCropImgData,
    detectionBoundary: vi.fn(() => ({
      landscape: '',
      portrait: '',
      scale: 1,
      boundary: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        scale: 1,
      },
    })),
    setAnimation: vi.fn((_: number, to: number, __: number, callback?: (value: number) => void) => {
      callback?.(to)
      return () => 0
    }),
    checkOrientationImage: vi.fn((orientation: number) => orientation),
  }
})

vi.mock('../lib/loading', () => ({
  default: defineComponent({
    name: 'CropperLoadingStub',
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
    },
    setup(_, { slots }) {
      return () => h('div', {}, slots.default ? slots.default() : [])
    },
  }),
}))

const flush = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('vue-cropper component api', () => {
  beforeEach(() => {
    getCropImgData.mockReset()
    getCropImgData.mockResolvedValue('data:image/png;base64,stub')

    vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:preview-url')
    vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(callback => {
      callback(new Blob(['preview'], { type: 'image/png' }))
    })
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      ;(callback as FrameRequestCallback)(0)
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
  })

  it('emits real-time preview payloads after image setup', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
      },
    })

    await flush()
    await flush()

    const emitted = wrapper.emitted('real-time')

    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toMatchObject({
      w: 200,
      h: 200,
      url: 'blob:preview-url',
    })
  })

  it('exposes crop export and rotate helpers', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        outputType: 'jpeg',
        outputSize: 0.6,
        full: true,
      },
    })

    await flush()
    await flush()

    await (wrapper.vm as unknown as {
      rotateRight: () => void
      getCropData: () => Promise<string>
      getCropBlob: () => Promise<Blob>
      rotateClear: () => void
      rotateLeft: () => void
    }).rotateRight()

    await (wrapper.vm as unknown as {
      getCropData: () => Promise<string>
    }).getCropData()

    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'base64',
        outputType: 'jpeg',
        outputSize: 0.6,
        full: true,
        imgAxis: expect.objectContaining({
          rotate: 90,
        }),
      }),
    )

    getCropImgData.mockResolvedValueOnce(new Blob(['crop'], { type: 'image/jpeg' }))
    await (wrapper.vm as unknown as { getCropBlob: () => Promise<Blob> }).getCropBlob()

    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'blob',
        outputType: 'jpeg',
        outputSize: 0.6,
        full: true,
      }),
    )

    ;(wrapper.vm as unknown as { rotateLeft: () => void }).rotateLeft()
    ;(wrapper.vm as unknown as { rotateClear: () => void }).rotateClear()
    await (wrapper.vm as unknown as { getCropData: () => Promise<string> }).getCropData()

    expect(
      getCropImgData,
    ).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'base64',
        imgAxis: expect.objectContaining({
          rotate: 0,
        }),
      }),
    )
  })

  it('forwards original export options to the export helper', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        original: true,
        maxSideLength: 1234,
      },
    })

    await flush()
    await flush()

    await (wrapper.vm as unknown as { getCropData: () => Promise<string> }).getCropData()

    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        original: true,
        maxSideLength: 1234,
      }),
    )
  })

  it('hides crop box when crop layout covers the wrapper', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 320, height: 240 },
      },
    })

    await flush()
    await flush()

    expect(wrapper.find('.cropper-crop-box').exists()).toBe(false)

    await (wrapper.vm as unknown as { getCropData: () => Promise<string> }).getCropData()

    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cropping: true,
        cropLayout: { width: 320, height: 240 },
        cropAxis: { x: 0, y: 0 },
      }),
    )
  })

  it('clamps export crop layout when crop layout exceeds the wrapper', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 999, height: 999 },
      },
    })

    await flush()
    await flush()

    expect(wrapper.find('.cropper-crop-box').exists()).toBe(false)

    await (wrapper.vm as unknown as { getCropData: () => Promise<string> }).getCropData()

    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cropping: true,
        cropLayout: { width: 320, height: 240 },
        cropAxis: { x: 0, y: 0 },
      }),
    )
  })
})
