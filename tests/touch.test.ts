import { describe, expect, it, vi } from 'vitest'
import CropperTouchEvent from '../lib/touch'

const touch = (clientX: number, clientY: number) => ({ clientX, clientY }) as Touch

describe('CropperTouchEvent', () => {
  it('emits previous and current centers during pinch scaling', () => {
    const cropperTouch = new CropperTouchEvent(document.createElement('div'))
    const handler = vi.fn()
    cropperTouch.watcher.addHandler('down-to-scale', handler)
    cropperTouch.touches = [touch(100, 100), touch(200, 100)]

    cropperTouch.scaleTouch({
      preventDefault: vi.fn(),
      touches: [touch(90, 80), touch(230, 120)],
    } as unknown as TouchEvent)

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      type: 'down-to-scale',
      previousCenter: { x: 150, y: 100 },
      center: { x: 160, y: 100 },
    }))
  })
})
