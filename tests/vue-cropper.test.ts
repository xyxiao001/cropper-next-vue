import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VueCropper from '../lib/vue-cropper.vue'

const { detectionBoundary, getCropImgData, loadImg } = vi.hoisted(() => ({
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
  getCropImgData: vi.fn(),
  loadImg: vi.fn(async (url: string) => ({ width: 120, height: 80, src: url })),
}))

// JSDOM does not reliably load/decode `blob:` URLs, which can cause the preview pipeline
// (`createPreviewUrlFromCanvas` -> `decodeImgUrl`) to hang and prevent downstream emits.
vi.mock('../lib/composables/preview', () => ({
  revokeBlobUrl: (url: string) => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  },
  decodeImgUrl: vi.fn(async () => undefined),
  nextFrame: vi.fn(async () => undefined),
  createPreviewUrlFromCanvas: vi.fn(async () => 'blob:preview-url'),
}))

vi.mock('../lib/common', async () => {
  const actual = await vi.importActual<typeof import('../lib/common')>('../lib/common')

  return {
    ...actual,
    loadImg,
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
          flipX: style.flipX ?? false,
          flipY: style.flipY ?? false,
        },
      }
    }),
    getCropImgData,
    detectionBoundary,
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
    detectionBoundary.mockClear()
    getCropImgData.mockReset()
    getCropImgData.mockResolvedValue('data:image/png;base64,stub')
    loadImg.mockClear()

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

  it('uses pointer and touch center zoom by default', () => {
    expect((VueCropper as unknown as { props: Record<string, { default: unknown }> }).props.zoomAnchor.default)
      .toBe('pointer')
  })

  it('keeps crop-box resizing disabled by default', () => {
    expect((VueCropper as unknown as { props: Record<string, { default: unknown }> }).props.cropBoxResizable.default)
      .toBe(false)
  })

  it('keeps crop-box constraints disabled by default', () => {
    expect((VueCropper as unknown as { props: Record<string, { default: unknown }> }).props.cropBoxConstraintsEnabled.default)
      .toBe(false)
  })

  it('keeps crop-box aspect ratio unrestricted by default', () => {
    expect((VueCropper as unknown as { props: Record<string, { default: unknown }> }).props.cropAspectRatio.default)
      .toBeUndefined()
  })

  it('uses the existing 24px minimum and no extra maximum crop-box size by default', () => {
    const componentProps = (VueCropper as unknown as { props: Record<string, { default: unknown }> }).props

    expect(componentProps.minCropWidth.default).toBe(24)
    expect(componentProps.minCropHeight.default).toBe(24)
    expect(componentProps.maxCropWidth.default).toBe(Infinity)
    expect(componentProps.maxCropHeight.default).toBe(Infinity)
  })

  it('uses the aspect ratio captured at the beginning of each crop resize session', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 120, height: 120 },
        cropBoxResizable: true,
        cropBoxConstraintsEnabled: true,
        cropAspectRatio: 1,
      },
    })
    await flush()
    await flush()

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 220,
      clientY: 180,
    })
    await wrapper.setProps({ cropAspectRatio: 16 / 9 })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250, clientY: 190 }))

    const activeCrop = wrapper.emitted('change')?.at(-1)?.[0].crop
    expect(activeCrop.width / activeCrop.height).toBeCloseTo(1)
    window.dispatchEvent(new MouseEvent('mouseup'))

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 250,
      clientY: 210,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 270, clientY: 220 }))

    const nextCrop = wrapper.emitted('change')?.at(-1)?.[0].crop
    expect(nextCrop.width / nextCrop.height).toBeCloseTo(16 / 9)
    window.dispatchEvent(new MouseEvent('mouseup'))
  })

  it('captures crop-box size limits at the beginning of each resize session', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 100, height: 100 },
        cropBoxResizable: true,
        cropBoxConstraintsEnabled: true,
        maxCropWidth: 130,
        maxCropHeight: 130,
      },
    })
    await flush()
    await flush()

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 210,
      clientY: 170,
    })
    await wrapper.setProps({ maxCropWidth: 200, maxCropHeight: 200 })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 310, clientY: 270 }))

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({
      width: 130,
      height: 130,
    })
    window.dispatchEvent(new MouseEvent('mouseup'))
  })

  it('ignores crop constraints for dragging, crop layout methods and reset while disabled', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
        cropBoxResizable: true,
        cropAspectRatio: 1,
        minCropWidth: 80,
        minCropHeight: 80,
        maxCropWidth: 100,
        maxCropHeight: 100,
      },
    })
    await flush()
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 160, height: 120 })

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 240,
      clientY: 180,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 280, clientY: 200 }))
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 140 })
    window.dispatchEvent(new MouseEvent('mouseup'))

    const vm = wrapper.vm as unknown as {
      setCropLayout: (layout: { width: number, height: number }) => void
      reset: () => void
    }
    vm.setCropLayout({ width: 200, height: 150 })
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 150 })

    vm.reset()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 160, height: 120 })
  })

  it('applies enabled constraints to initial and runtime crop layouts, methods and reset', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 480, height: 320 },
        cropBoxResizable: true,
        cropBoxConstraintsEnabled: true,
        cropAspectRatio: 1,
        minCropWidth: 80,
        minCropHeight: 80,
        maxCropWidth: 240,
        maxCropHeight: 240,
      },
    })
    await flush()
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 240, height: 240 })

    await wrapper.setProps({ cropLayout: { width: 300, height: 200 } })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })

    const vm = wrapper.vm as unknown as {
      setCropLayout: (layout: { width: number, height: number }) => void
      reset: () => void
    }
    vm.setCropLayout({ width: 180, height: 300 })
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 180, height: 180 })

    vm.reset()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })
  })

  it('recomputes the actual crop size when constraints are enabled or updated at runtime', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 300, height: 200 },
        cropAspectRatio: 1,
        maxCropWidth: 240,
        maxCropHeight: 240,
      },
    })
    await flush()
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 300, height: 200 })

    await wrapper.setProps({ cropBoxConstraintsEnabled: true })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })

    await wrapper.setProps({ maxCropWidth: 120, maxCropHeight: 120 })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 120, height: 120 })
  })

  it('centers the constrained crop when enabling constraints and preserves that axis for later limit updates', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 320, height: 240 },
        cropBoxConstraintsEnabled: false,
        maxCropWidth: 200,
        maxCropHeight: 160,
      },
    })
    await flush()
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toEqual({
      x: 0,
      y: 0,
      width: 320,
      height: 240,
    })

    await wrapper.setProps({ cropBoxConstraintsEnabled: true })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toEqual({
      x: 60,
      y: 40,
      width: 200,
      height: 160,
    })

    await wrapper.setProps({ maxCropWidth: 180, maxCropHeight: 140 })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toEqual({
      x: 60,
      y: 40,
      width: 180,
      height: 140,
    })
  })

  it('starts the first resize from the already constrained crop size without a jump', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 480, height: 320 },
        cropBoxResizable: true,
        cropBoxConstraintsEnabled: true,
        cropAspectRatio: 1,
        maxCropWidth: 200,
        maxCropHeight: 200,
      },
    })
    await flush()
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 260,
      clientY: 220,
    })
    await flush()
    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 260, clientY: 220 }))

    expect(wrapper.emitted('change')?.at(-1)?.[0].crop).toMatchObject({ width: 200, height: 200 })
    window.dispatchEvent(new MouseEvent('mouseup'))
  })

  it('keeps a visible crop frame and activates four grid lines only during crop-box resizing', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
      },
    })
    await flush()
    await flush()

    expect(wrapper.findAll('.cropper-resize-handle')).toHaveLength(0)
    expect(wrapper.findAll('.cropper-grid-line')).toHaveLength(0)
    expect(wrapper.findAll('.cropper-frame')).toHaveLength(1)

    await wrapper.setProps({ cropBoxResizable: true })
    expect(wrapper.findAll('.cropper-resize-handle')).toHaveLength(8)
    expect(wrapper.findAll('.cropper-grid-line')).toHaveLength(4)
    expect(wrapper.find('.cropper-grid').classes()).not.toContain('cropper-grid--active')
    expect(wrapper.find('.cropper-grid').attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('.cropper-resize-handle').map(handle => handle.attributes('data-direction')))
      .toEqual(['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'])

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 100,
      clientY: 100,
    })
    expect(wrapper.find('.cropper-grid').classes()).toContain('cropper-grid--active')
    expect(wrapper.find('.cropper-grid').attributes('aria-hidden')).toBe('false')

    window.dispatchEvent(new MouseEvent('mouseup'))
    await flush()
    expect(wrapper.find('.cropper-grid').classes()).not.toContain('cropper-grid--active')
    expect(wrapper.find('.cropper-grid').attributes('aria-hidden')).toBe('true')

    await wrapper.setProps({ cropLayout: { width: 320, height: 240 } })
    await flush()
    expect(wrapper.findAll('.cropper-resize-handle')).toHaveLength(0)
    expect(wrapper.findAll('.cropper-grid-line')).toHaveLength(0)
    expect(wrapper.findAll('.cropper-frame')).toHaveLength(0)
  })

  it('defers center-box rebound until crop-box resizing ends', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
        cropBoxResizable: true,
        centerBox: true,
      },
    })
    await flush()
    await flush()
    detectionBoundary.mockClear()

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 100,
      clientY: 100,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 120 }))
    await flush()

    expect(detectionBoundary).not.toHaveBeenCalled()

    window.dispatchEvent(new MouseEvent('mouseup'))
    await flush()
    expect(detectionBoundary).toHaveBeenCalledTimes(1)
  })

  it('does not change the image when crop-box resizing ends without center-box mode', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
        cropBoxResizable: true,
      },
    })
    await flush()
    await flush()
    const initialImage = structuredClone(wrapper.emitted('change')?.at(-1)?.[0].image)

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 100,
      clientY: 100,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 120 }))
    window.dispatchEvent(new MouseEvent('mouseup'))
    await flush()

    expect(wrapper.emitted('change')?.at(-1)?.[0].image).toEqual(initialImage)
  })

  it('synchronously queues state and preview updates for resized crop geometry and resets it', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
        cropBoxResizable: true,
      },
    })
    await flush()
    await flush()
    const initial = structuredClone(wrapper.emitted('change')?.at(-1)?.[0])
    const changeCount = wrapper.emitted('change')?.length ?? 0
    const previewCount = wrapper.emitted('real-time')?.length ?? 0

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 100,
      clientY: 100,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 140, clientY: 130 }))

    expect(wrapper.emitted('change')?.length).toBeGreaterThan(changeCount)
    expect(wrapper.emitted('real-time')?.length).toBeGreaterThan(previewCount)
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({
      crop: { x: 80, y: 60, width: 200, height: 150 },
    })
    expect(wrapper.emitted('real-time')?.at(-1)?.[0]).toMatchObject({
      w: 200,
      h: 150,
    })

    const vm = wrapper.vm as unknown as {
      getCropCoordinates: () => { boundingBox: { width: number, height: number } }
      reset: () => void
    }
    expect(vm.getCropCoordinates().boundingBox).toMatchObject({ width: 200, height: 150 })

    window.dispatchEvent(new MouseEvent('mouseup'))
    vm.reset()
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual(initial)
  })

  it('exports the latest crop geometry after handle resizing', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
        cropBoxResizable: true,
      },
    })
    await flush()
    await flush()

    await wrapper.find('.cropper-resize-handle--se').trigger('mousedown', {
      button: 0,
      clientX: 100,
      clientY: 100,
    })
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 140, clientY: 130 }))
    window.dispatchEvent(new MouseEvent('mouseup'))

    await (wrapper.vm as unknown as { getCropData: () => Promise<string> }).getCropData()
    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cropAxis: { x: 80, y: 60 },
        cropLayout: { width: 200, height: 150 },
      }),
    )
  })

  it('emits real-time preview payloads after image setup', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
      },
    })

    await flush()
    await flush()

    const emitted = wrapper.emitted('real-time') ?? wrapper.emitted('realTime')

    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toMatchObject({
      w: 200,
      h: 200,
      url: 'blob:preview-url',
    })
  })

  it('emits structured state changes and keeps export isolated', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
      },
    })

    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      getCropData: () => Promise<string>
      setRotateAngle: (angle: number) => void
      setCropAxis: (axis: { x: number, y: number }) => void
      zoomIn: (step?: number) => void
      reset: () => void
    }
    const initial = structuredClone(wrapper.emitted('change')?.at(-1)?.[0])

    expect(initial).toEqual({
      image: { x: 0, y: 0, scale: 1, rotate: 0, flipX: false, flipY: false },
      crop: { x: 80, y: 60, width: 160, height: 120 },
    })

    const changeCountBeforeExport = wrapper.emitted('change')?.length
    await vm.getCropData()
    expect(wrapper.emitted('change')?.length).toBe(changeCountBeforeExport)

    vm.setRotateAngle(90)
    vm.setCropAxis({ x: 20, y: 30 })
    vm.zoomIn(0.2)

    const changed = wrapper.emitted('change')?.at(-1)?.[0] as {
      image: { x: number, y: number, scale: number, rotate: number }
      crop: { x: number, y: number, width: number, height: number }
    }
    expect(changed).toMatchObject({
      image: { scale: 1.2, rotate: 90 },
      crop: { x: 20, y: 30, width: 160, height: 120 },
    })
    expect(changed.image.x).toBeCloseTo(-30)
    expect(changed.image.y).toBeCloseTo(-15)

    vm.reset()
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual(initial)
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

  it('reloads the current image through the public instance method', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
      },
    })

    await flush()
    await flush()

    expect(loadImg).toHaveBeenCalledTimes(1)
    expect(loadImg).toHaveBeenCalledWith('https://example.com/demo.jpg')

    await (wrapper.vm as unknown as {
      reload: () => Promise<boolean> | boolean
    }).reload()
    await flush()

    expect(loadImg).toHaveBeenCalledTimes(2)
    expect(loadImg).toHaveBeenLastCalledWith('https://example.com/demo.jpg')
  })

  it('resets image and crop state without reloading the image', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        cropLayout: { width: 160, height: 120 },
      },
    })

    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      getCropData: () => Promise<string>
      setRotateAngle: (angle: number) => void
      setCropAxis: (axis: { x: number, y: number }) => void
      zoomIn: (step?: number) => void
      reset: () => void
    }

    await vm.getCropData()
    const initial = structuredClone(getCropImgData.mock.lastCall?.[0])

    vm.setRotateAngle(90)
    vm.setCropAxis({ x: 20, y: 30 })
    vm.zoomIn(0.2)
    vm.reset()
    await vm.getCropData()

    expect(loadImg).toHaveBeenCalledTimes(1)
    expect(getCropImgData.mock.lastCall?.[0]).toMatchObject({
      imgAxis: initial.imgAxis,
      cropAxis: initial.cropAxis,
      cropLayout: initial.cropLayout,
    })
  })

  it('supports setting rotate angle, crop layout and crop axis through the public api', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        wrapper: { width: 320, height: 240 },
        centerBox: true,
      },
    })

    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      setRotateAngle: (angle: number) => void
      setCropLayout: (layout: { width: number | string, height: number | string }) => void
      setCropAxis: (axis: { x: number, y: number }) => void
      getCropData: () => Promise<string>
    }

    vm.setRotateAngle(450)
    vm.setCropLayout({ width: '50%', height: '25%' })
    vm.setCropAxis({ x: 999, y: -20 })
    await flush()

    await vm.getCropData()

    // `detectionBoundary` is used during `reboundImg()` (boundary enforcement),
    // which is triggered by public methods and/or internal watchers.
    expect(detectionBoundary).toHaveBeenCalled()
    expect(getCropImgData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        imgAxis: expect.objectContaining({
          rotate: 90,
        }),
        cropLayout: {
          width: 160,
          height: 60,
        },
        cropAxis: {
          x: 160,
          y: 0,
        },
      }),
    )
  })

  it('supports zooming through public instance methods', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
      },
    })

    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      zoomIn: (step?: number) => void
      zoomOut: (step?: number) => void
      changeScale: (value?: number) => void
      getCropData: () => Promise<string>
    }

    await vm.getCropData()
    const initialScale = getCropImgData.mock.lastCall?.[0].imgAxis.scale

    vm.zoomIn(0.2)
    await vm.getCropData()
    const zoomedInScale = initialScale * 1.2
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBeCloseTo(zoomedInScale)

    vm.zoomOut(0.05)
    await vm.getCropData()
    const zoomedOutScale = zoomedInScale * 0.95
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBeCloseTo(zoomedOutScale)

    vm.changeScale(-0.1)
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBeCloseTo(zoomedOutScale - 0.1)
  })

  it('applies scale props to public zoom, reset and runtime updates', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        minScale: 0.8,
        maxScale: 1.1,
      },
    })
    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      zoomIn: (step?: number) => void
      zoomOut: (step?: number) => void
      reset: () => void
      getCropData: () => Promise<string>
    }

    vm.zoomIn(1)
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBe(1.1)

    vm.zoomOut(1)
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBe(0.8)

    vm.reset()
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBe(1)

    await wrapper.setProps({ minScale: 1.05, maxScale: 1.06 })
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.scale).toBe(1.05)
  })

  it('toggles screen-axis flips, exports state and clears flips on reset', async () => {
    const wrapper = mount(VueCropper, {
      props: { img: 'https://example.com/demo.jpg' },
    })
    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      flipHorizontal: () => void
      flipVertical: () => void
      setRotateAngle: (angle: number) => void
      reset: () => void
      getCropData: () => Promise<string>
    }

    vm.setRotateAngle(90)
    vm.flipHorizontal()
    vm.flipVertical()
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis).toMatchObject({
      rotate: 90,
      flipX: true,
      flipY: true,
    })
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({
      image: { rotate: 90, flipX: true, flipY: true },
    })

    vm.flipHorizontal()
    vm.flipHorizontal()
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis.flipX).toBe(true)

    vm.reset()
    await vm.getCropData()
    expect(getCropImgData.mock.lastCall?.[0].imgAxis).toMatchObject({
      rotate: 0,
      flipX: false,
      flipY: false,
    })
  })

  it('returns original crop coordinates synchronously without emitting events', async () => {
    const empty = mount(VueCropper)
    expect((empty.vm as unknown as { getCropCoordinates: () => unknown }).getCropCoordinates()).toBeNull()

    const wrapper = mount(VueCropper, {
      props: { img: 'https://example.com/demo.jpg' },
    })
    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      getCropCoordinates: () => {
        points: Array<{ x: number, y: number }>
        source: { width: number, height: number }
        transform: { rotate: number, flipX: boolean, flipY: boolean }
      }
    }
    const changeCount = wrapper.emitted('change')?.length
    const realTimeCount = wrapper.emitted('real-time')?.length
    const result = vm.getCropCoordinates()

    expect(result.points).toHaveLength(4)
    expect(result.source).toEqual({ width: 300, height: 150 })
    expect(result.transform).toEqual({ rotate: 0, flipX: false, flipY: false })
    expect(wrapper.emitted('change')?.length).toBe(changeCount)
    expect(wrapper.emitted('real-time')?.length).toBe(realTimeCount)
  })

  it('keeps public movement and zoom methods available when interactions are disabled', async () => {
    const wrapper = mount(VueCropper, {
      props: {
        img: 'https://example.com/demo.jpg',
        movable: false,
        zoomable: false,
      },
    })

    await flush()
    await flush()

    const vm = wrapper.vm as unknown as {
      setCropAxis: (axis: { x: number, y: number }) => void
      zoomIn: (step?: number) => void
      getCropData: () => Promise<string>
    }
    vm.setCropAxis({ x: 20, y: 30 })
    vm.zoomIn(0.2)
    await vm.getCropData()

    expect(getCropImgData.mock.lastCall?.[0]).toMatchObject({
      cropAxis: { x: 20, y: 30 },
      imgAxis: { scale: 1.2 },
    })
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
