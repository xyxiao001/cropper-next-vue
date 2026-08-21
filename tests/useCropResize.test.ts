import { computed, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { InterfaceCropResizeConstraints, InterfaceCropResizeDirection } from '../lib/interface'
import {
  calculateConstrainedCropSize,
  calculateCropResize,
  useCropResize,
} from '../lib/composables/useCropResize'

const startCrop = { x: 50, y: 40, width: 100, height: 80 }
const startPointer = { x: 100, y: 80 }
const currentPointer = { x: 110, y: 100 }

describe('crop resize geometry', () => {
  const cases: Array<[InterfaceCropResizeDirection, typeof startCrop]> = [
    ['n', { x: 50, y: 60, width: 100, height: 60 }],
    ['s', { x: 50, y: 40, width: 100, height: 100 }],
    ['w', { x: 60, y: 40, width: 90, height: 80 }],
    ['e', { x: 50, y: 40, width: 110, height: 80 }],
    ['nw', { x: 60, y: 60, width: 90, height: 60 }],
    ['ne', { x: 50, y: 60, width: 110, height: 60 }],
    ['sw', { x: 60, y: 40, width: 90, height: 100 }],
    ['se', { x: 50, y: 40, width: 110, height: 100 }],
  ]

  it.each(cases)('resizes %s from the initial snapshot and keeps opposite edges fixed', (direction, expected) => {
    expect(calculateCropResize({
      direction,
      startCrop,
      startPointer,
      currentPointer,
      wrapper: { width: 300, height: 240 },
    })).toEqual(expected)
  })

  const boundaryCases: Array<[InterfaceCropResizeDirection, typeof startCrop, typeof currentPointer]> = [
    ['n', { x: 50, y: 96, width: 100, height: 24 }, { x: 100, y: 300 }],
    ['s', { x: 50, y: 40, width: 100, height: 200 }, { x: 100, y: 500 }],
    ['w', { x: 126, y: 40, width: 24, height: 80 }, { x: 400, y: 80 }],
    ['e', { x: 50, y: 40, width: 250, height: 80 }, { x: 500, y: 80 }],
    ['nw', { x: 0, y: 0, width: 150, height: 120 }, { x: -100, y: -100 }],
    ['ne', { x: 50, y: 0, width: 250, height: 120 }, { x: 500, y: -100 }],
    ['sw', { x: 0, y: 40, width: 150, height: 200 }, { x: -100, y: 500 }],
    ['se', { x: 50, y: 40, width: 250, height: 200 }, { x: 500, y: 500 }],
  ]

  it.each(boundaryCases)('clamps %s inside the wrapper and keeps a 24px minimum size', (direction, expected, pointer) => {
    expect(calculateCropResize({
      direction,
      startCrop,
      startPointer,
      currentPointer: pointer,
      wrapper: { width: 300, height: 240 },
    })).toEqual(expected)
  })

  const ratioCases: Array<[
    string,
    InterfaceCropResizeDirection,
    number,
    typeof startCrop,
    typeof startPointer,
    typeof currentPointer,
    typeof startCrop,
  ]> = [
    ['1:1 southeast', 'se', 1, { x: 80, y: 60, width: 120, height: 120 }, { x: 200, y: 180 }, { x: 240, y: 190 }, { x: 80, y: 60, width: 160, height: 160 }],
    ['4:3 northwest', 'nw', 4 / 3, { x: 80, y: 60, width: 160, height: 120 }, { x: 80, y: 60 }, { x: 40, y: 40 }, { x: 40, y: 30, width: 200, height: 150 }],
    ['4:3 northeast', 'ne', 4 / 3, { x: 80, y: 60, width: 160, height: 120 }, { x: 240, y: 60 }, { x: 280, y: 40 }, { x: 80, y: 30, width: 200, height: 150 }],
    ['4:3 southwest', 'sw', 4 / 3, { x: 80, y: 60, width: 160, height: 120 }, { x: 80, y: 180 }, { x: 40, y: 200 }, { x: 40, y: 60, width: 200, height: 150 }],
    ['16:9 southeast', 'se', 16 / 9, { x: 80, y: 75, width: 160, height: 90 }, { x: 240, y: 165 }, { x: 280, y: 175 }, { x: 80, y: 75, width: 200, height: 112.5 }],
  ]

  it.each(ratioCases)('keeps the requested ratio and opposite-corner anchor for %s', (_, direction, aspectRatio, crop, pointer, current, expected) => {
    expect(calculateCropResize({
      direction,
      startCrop: crop,
      startPointer: pointer,
      currentPointer: current,
      wrapper: { width: 320, height: 240 },
      constraints: {
        aspectRatio,
        minWidth: 24,
        minHeight: 24,
        maxWidth: Infinity,
        maxHeight: Infinity,
      },
    })).toEqual(expected)
  })

  it.each<[
    InterfaceCropResizeDirection,
    typeof currentPointer,
    typeof startCrop,
  ]>([
    ['n', { x: 160, y: 30 }, { x: 60, y: 30, width: 200, height: 150 }],
    ['s', { x: 160, y: 210 }, { x: 60, y: 60, width: 200, height: 150 }],
    ['w', { x: 40, y: 120 }, { x: 40, y: 45, width: 200, height: 150 }],
    ['e', { x: 280, y: 120 }, { x: 80, y: 45, width: 200, height: 150 }],
  ])('keeps the opposite edge and resizes around the paired center for %s', (direction, current, expected) => {
    expect(calculateCropResize({
      direction,
      startCrop: { x: 80, y: 60, width: 160, height: 120 },
      startPointer: { x: direction === 'w' ? 80 : direction === 'e' ? 240 : 160, y: direction === 'n' ? 60 : direction === 's' ? 180 : 120 },
      currentPointer: current,
      wrapper: { width: 320, height: 240 },
      constraints: {
        aspectRatio: 4 / 3,
        minWidth: 24,
        minHeight: 24,
        maxWidth: Infinity,
        maxHeight: Infinity,
      },
    })).toEqual(expected)
  })

  it.each<InterfaceCropResizeDirection>(['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'])('keeps proportional %s resizing inside the wrapper', (direction) => {
    const crop = calculateCropResize({
      direction,
      startCrop: { x: 80, y: 60, width: 160, height: 120 },
      startPointer: { x: 160, y: 120 },
      currentPointer: {
        x: direction.includes('w') ? -500 : 500,
        y: direction.includes('n') ? -500 : 500,
      },
      wrapper: { width: 320, height: 240 },
      constraints: {
        aspectRatio: 4 / 3,
        minWidth: 24,
        minHeight: 24,
        maxWidth: Infinity,
        maxHeight: Infinity,
      },
    })

    expect(crop.width / crop.height).toBeCloseTo(4 / 3)
    expect(crop.x).toBeGreaterThanOrEqual(0)
    expect(crop.y).toBeGreaterThanOrEqual(0)
    expect(crop.x + crop.width).toBeLessThanOrEqual(320)
    expect(crop.y + crop.height).toBeLessThanOrEqual(240)
  })

  const constrainedFreeCases: Array<[
    string,
    InterfaceCropResizeDirection,
    typeof currentPointer,
    typeof startCrop,
  ]> = [
    ['north minimum', 'n', { x: 100, y: 300 }, { x: 50, y: 70, width: 100, height: 50 }],
    ['south minimum', 's', { x: 100, y: -300 }, { x: 50, y: 40, width: 100, height: 50 }],
    ['west minimum', 'w', { x: 300, y: 80 }, { x: 90, y: 40, width: 60, height: 80 }],
    ['east minimum', 'e', { x: -300, y: 80 }, { x: 50, y: 40, width: 60, height: 80 }],
    ['northwest minimum', 'nw', { x: 300, y: 300 }, { x: 90, y: 70, width: 60, height: 50 }],
    ['northeast minimum', 'ne', { x: -300, y: 300 }, { x: 50, y: 70, width: 60, height: 50 }],
    ['southwest minimum', 'sw', { x: 300, y: -300 }, { x: 90, y: 40, width: 60, height: 50 }],
    ['southeast minimum', 'se', { x: -300, y: -300 }, { x: 50, y: 40, width: 60, height: 50 }],
    ['north maximum', 'n', { x: 100, y: -300 }, { x: 50, y: 10, width: 100, height: 110 }],
    ['south maximum', 's', { x: 100, y: 300 }, { x: 50, y: 40, width: 100, height: 110 }],
    ['west maximum', 'w', { x: -300, y: 80 }, { x: 10, y: 40, width: 140, height: 80 }],
    ['east maximum', 'e', { x: 300, y: 80 }, { x: 50, y: 40, width: 140, height: 80 }],
    ['northwest maximum', 'nw', { x: -300, y: -300 }, { x: 10, y: 10, width: 140, height: 110 }],
    ['northeast maximum', 'ne', { x: 300, y: -300 }, { x: 50, y: 10, width: 140, height: 110 }],
    ['southwest maximum', 'sw', { x: -300, y: 300 }, { x: 10, y: 40, width: 140, height: 110 }],
    ['southeast maximum', 'se', { x: 300, y: 300 }, { x: 50, y: 40, width: 140, height: 110 }],
  ]

  it.each(constrainedFreeCases)('applies configured free-size limits for %s', (_, direction, pointer, expected) => {
    expect(calculateCropResize({
      direction,
      startCrop,
      startPointer,
      currentPointer: pointer,
      wrapper: { width: 300, height: 240 },
      constraints: {
        minWidth: 60,
        minHeight: 50,
        maxWidth: 140,
        maxHeight: 110,
      },
    })).toEqual(expected)
  })

  it('intersects proportional minimum and maximum width and height limits', () => {
    const base = {
      direction: 'se' as const,
      startCrop: { x: 80, y: 60, width: 160, height: 120 },
      startPointer: { x: 240, y: 180 },
      wrapper: { width: 320, height: 240 },
      constraints: {
        aspectRatio: 4 / 3,
        minWidth: 160,
        minHeight: 100,
        maxWidth: 220,
        maxHeight: 150,
      },
    }

    expect(calculateCropResize({
      ...base,
      currentPointer: { x: 100, y: 100 },
    })).toEqual({ x: 80, y: 60, width: 160, height: 120 })
    expect(calculateCropResize({
      ...base,
      currentPointer: { x: 500, y: 500 },
    })).toEqual({ x: 80, y: 60, width: 200, height: 150 })
  })

  it('limits the paired centered dimension by the nearest wrapper edge', () => {
    expect(calculateCropResize({
      direction: 'e',
      startCrop: { x: 80, y: 10, width: 160, height: 120 },
      startPointer: { x: 240, y: 70 },
      currentPointer: { x: 500, y: 70 },
      wrapper: { width: 320, height: 240 },
      constraints: {
        aspectRatio: 4 / 3,
        minWidth: 24,
        minHeight: 24,
        maxWidth: 240,
        maxHeight: 180,
      },
    })).toEqual({
      x: 80,
      y: 0,
      width: 560 / 3,
      height: 140,
    })
  })
})

describe('programmatic crop size constraints', () => {
  it('clamps free width and height to the configured limits and wrapper', () => {
    expect(calculateConstrainedCropSize({
      requested: { width: 500, height: 10 },
      wrapper: { width: 420, height: 300 },
      constraints: {
        minWidth: 80,
        minHeight: 60,
        maxWidth: 360,
        maxHeight: 240,
      },
    })).toEqual({ width: 360, height: 60 })
  })

  it('fits the largest ratio box inside the requested size', () => {
    expect(calculateConstrainedCropSize({
      requested: { width: 300, height: 200 },
      wrapper: { width: 640, height: 480 },
      constraints: {
        aspectRatio: 1,
        minWidth: 24,
        minHeight: 24,
        maxWidth: Infinity,
        maxHeight: Infinity,
      },
    })).toEqual({ width: 200, height: 200 })
  })

  it('expands a ratio box to the minimum feasible size and clamps it to maximum limits', () => {
    const constraints = {
      aspectRatio: 4 / 3,
      minWidth: 160,
      minHeight: 120,
      maxWidth: 240,
      maxHeight: 180,
    }

    expect(calculateConstrainedCropSize({
      requested: { width: 80, height: 80 },
      wrapper: { width: 320, height: 240 },
      constraints,
    })).toEqual({ width: 160, height: 120 })

    expect(calculateConstrainedCropSize({
      requested: { width: 480, height: 320 },
      wrapper: { width: 320, height: 240 },
      constraints,
    })).toEqual({ width: 240, height: 180 })
  })
})

const createResize = (constraints?: Partial<InterfaceCropResizeConstraints>) => {
  const layout = {
    wrapLayout: { width: 300, height: 240 },
    cropAxis: { x: 50, y: 40 },
  }
  const innerCropLayout = ref({ width: 100, height: 80 })
  const effectiveCropLayoutStyle = computed(() => ({
    width: Number(innerCropLayout.value.width),
    height: Number(innerCropLayout.value.height),
  }))
  const onStart = vi.fn()
  const onResize = vi.fn()
  const onEnd = vi.fn()
  const cropResizeConstraints = computed<InterfaceCropResizeConstraints>(() => ({
    minWidth: 24,
    minHeight: 24,
    maxWidth: Infinity,
    maxHeight: Infinity,
    ...constraints,
  }))
  const resize = useCropResize({
    layout,
    innerCropLayout,
    effectiveCropLayoutStyle,
    constraints: cropResizeConstraints,
    onStart,
    onResize,
    onEnd,
  })

  return { layout, innerCropLayout, onStart, onResize, onEnd, resize }
}

describe('crop resize session', () => {
  it('tracks a mouse resize session and cleans it up on mouseup', () => {
    const { layout, innerCropLayout, onStart, onResize, onEnd, resize } = createResize()
    const start = new MouseEvent('mousedown', { button: 0, clientX: 100, clientY: 80 })

    resize.startCropResize('se', start)
    resize.moveCropResize(new MouseEvent('mousemove', { clientX: 130, clientY: 100 }))

    expect(resize.cropResizing.value).toBe(true)
    expect(layout.cropAxis).toEqual({ x: 50, y: 40 })
    expect(innerCropLayout.value).toEqual({ width: 130, height: 100 })
    expect(onStart).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledTimes(1)

    resize.endCropResize()
    expect(resize.cropResizing.value).toBe(false)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('tracks the first touch and ignores other touch identifiers', () => {
    const { innerCropLayout, resize } = createResize()
    const startEvent = {
      touches: [{ identifier: 7, clientX: 100, clientY: 80 }],
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as TouchEvent
    const moveEvent = {
      touches: [
        { identifier: 9, clientX: 200, clientY: 200 },
        { identifier: 7, clientX: 120, clientY: 90 },
      ],
      preventDefault: vi.fn(),
    } as unknown as TouchEvent

    resize.startCropResize('se', startEvent)
    resize.moveCropResize(moveEvent)

    expect(innerCropLayout.value).toEqual({ width: 120, height: 90 })
    resize.endCropResize()
  })

  it('stops handle start events from reaching crop movement and image dragging', () => {
    const { resize } = createResize()
    const event = new MouseEvent('mousedown', { button: 0, clientX: 100, clientY: 80 })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    const stopPropagation = vi.spyOn(event, 'stopPropagation')

    resize.startCropResize('e', event)

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(stopPropagation).toHaveBeenCalledTimes(1)
    resize.destroyCropResize()
  })

  it('snapshots the aspect ratio when a resize session starts', () => {
    const constraints = ref<InterfaceCropResizeConstraints>({
      aspectRatio: 1,
      minWidth: 24,
      minHeight: 24,
      maxWidth: Infinity,
      maxHeight: Infinity,
    })
    const layout = {
      wrapLayout: { width: 300, height: 240 },
      cropAxis: { x: 50, y: 40 },
    }
    const innerCropLayout = ref({ width: 100, height: 100 })
    const resize = useCropResize({
      layout,
      innerCropLayout,
      effectiveCropLayoutStyle: computed(() => ({
        width: Number(innerCropLayout.value.width),
        height: Number(innerCropLayout.value.height),
      })),
      constraints,
      onStart: vi.fn(),
      onResize: vi.fn(),
      onEnd: vi.fn(),
    })

    resize.startCropResize('se', new MouseEvent('mousedown', { button: 0, clientX: 150, clientY: 140 }))
    constraints.value = { ...constraints.value, aspectRatio: 16 / 9 }
    resize.moveCropResize(new MouseEvent('mousemove', { clientX: 180, clientY: 150 }))

    expect(innerCropLayout.value.width / Number(innerCropLayout.value.height)).toBeCloseTo(1)
    resize.endCropResize()
  })
})
