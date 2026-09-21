import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import ScenarioCover from '../src/pages/ScenarioCover.vue'

const CropperStub = defineComponent({
  name: 'VueCropper',
  emits: ['real-time'],
  template: '<div />',
})

afterEach(() => vi.unstubAllGlobals())

describe('responsive cover preview', () => {
  it('fits the complete selection to the card after its width changes', async () => {
    let resize: ResizeObserverCallback
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback }
      observe() {}
      disconnect = disconnect
    })
    const wrapper = mount(ScenarioCover, {
      global: { stubs: { VueCropper: CropperStub, ElButton: true, ScenarioCodeExample: true } },
    })
    wrapper.findComponent(CropperStub).vm.$emit('real-time', {
      w: 400, h: 225, url: 'blob:preview', img: {},
    })
    const notifyWidth = async (width: number) => {
      resize!([{ contentRect: { width } } as ResizeObserverEntry], {} as ResizeObserver)
      await nextTick()
    }
    await notifyWidth(320)
    expect(wrapper.get('.desktop-preview section').attributes('style')).toContain('zoom: 0.8')
    await notifyWidth(248)
    expect(wrapper.get('.desktop-preview section').attributes('style')).toContain('zoom: 0.62')
    expect(wrapper.get('.desktop-preview section').attributes('style')).toContain('height: 225px')
    expect(wrapper.get('.mobile-preview section').attributes('style')).toContain('zoom: 0.32')
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })
})
