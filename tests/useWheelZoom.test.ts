import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useWheelZoom } from '../lib/composables/useWheelZoom'

describe('useWheelZoom', () => {
  it('uses the mouse position relative to the cropper as the pointer anchor', () => {
    const cropper = document.createElement('div')
    vi.spyOn(cropper, 'getBoundingClientRect').mockReturnValue({
      x: 30,
      y: 40,
      left: 30,
      top: 40,
      right: 330,
      bottom: 240,
      width: 300,
      height: 200,
      toJSON: () => ({}),
    })
    const setScale = vi.fn()
    let mouseInCropper!: () => void

    const wrapper = mount(defineComponent({
      setup() {
        ;({ mouseInCropper } = useWheelZoom({
          isIE: false,
          supportWheel: 'wheel',
          changeImgSize: vi.fn(() => 2),
          imgAxis: ref({ scale: 1 }),
          imgLayout: ref({ width: 100, height: 80 }),
          cropperRef: ref(cropper),
          zoomAnchor: ref('pointer'),
          setScale,
        }))
        return () => h('div')
      },
    }))

    mouseInCropper()
    window.dispatchEvent(new WheelEvent('wheel', {
      clientX: 130,
      clientY: 90,
      deltaY: -50,
      cancelable: true,
    }))

    expect(setScale).toHaveBeenCalledWith(2, false, {
      previous: { x: 100, y: 50 },
      current: { x: 100, y: 50 },
    })

    wrapper.unmount()
  })
})
