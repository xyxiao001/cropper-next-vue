import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScenarioCodeExample from '../src/components/ScenarioCodeExample.vue'

describe('documentation code controls', () => {
  it('copies the complete source and shows the supplied feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mount(ScenarioCodeExample, { props: { title: 'Integration example', code: '<template>Hello</template>', copyLabel: 'Copy code', copiedLabel: 'Copied' } })
    await wrapper.get('button').trigger('click')
    expect(writeText).toHaveBeenCalledWith('<template>Hello</template>')
    expect(wrapper.get('button').text()).toBe('Copied')
    wrapper.unmount()
  })
})

import { defineComponent, h } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import DocLayout from '../src/components/DocLayout.vue'
import SideBar from '../src/components/SideBar.vue'
import LocaleSwitch from '../src/components/LocaleSwitch.vue'
import { useLocale } from '../src/composables/useLocale'

describe('documentation reading flow', () => {
  it('keeps the chapter URL when switching language and updates its outline', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:page(.*)', component: { template: '<div />' } }] })
    await router.push('/guide#installation')
    await router.isReady()
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })
    const { setLocale, isEn } = useLocale()
    setLocale('zh')
    const content = defineComponent({ setup: () => () => h('h2', { id: 'installation' }, isEn.value ? 'Installation' : '安装组件') })
    const wrapper = mount(DocLayout, { attachTo: document.body, global: { plugins: [router] }, slots: { default: content } })
    const language = mount(LocaleSwitch)
    await flushPromises()
    expect(wrapper.get('.page-outline a').text()).toBe('安装组件')
    expect(wrapper.get('.page-outline a').attributes('href')).toBe('/guide#installation')
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
    await language.findAll('button')[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('.page-outline a').text()).toBe('Installation')
    expect(router.currentRoute.value.fullPath).toBe('/guide#installation')
    expect(document.documentElement.lang).toBe('en')
    expect(wrapper.get('.doc-pagination').text()).toContain('How cropping works')
    wrapper.unmount()
    language.unmount()
    setLocale('zh')
  })

  it('exposes mobile navigation and closes it after selecting a document', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:page(.*)', component: { template: '<div />' } }] })
    await router.push('/guide')
    await router.isReady()
    const wrapper = mount(SideBar, { props: { open: true }, global: { plugins: [router] } })
    expect(wrapper.classes()).toContain('is-open')
    await wrapper.get('a[href="/concepts"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/concepts')
    wrapper.unmount()
  })
})

import PageOutline from '../src/components/PageOutline.vue'
it('exposes a keyboard-operable chapter disclosure state for narrow screens', async () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/guide', component: { template: '<div />' } }] })
  await router.push('/guide')
  const wrapper = mount(PageOutline, { props: { entries: [{ id: 'installation', text: '安装组件', level: 2 }] }, global: { plugins: [router] } })
  expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  await wrapper.get('button').trigger('click')
  expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
  expect(wrapper.get('.outline-links').classes()).toContain('is-expanded')
  expect(wrapper.get('a').attributes('href')).toBe('/guide#installation')
  wrapper.unmount()
})
