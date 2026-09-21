import { describe, expect, it, vi } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import BasicCrop from '../src/examples/BasicCrop.vue'

const { getCropBlob } = vi.hoisted(() => ({ getCropBlob: vi.fn() }))
vi.mock('cropper-next-vue', () => ({
  VueCropper: defineComponent({
    props: ['img'],
    setup(props, { expose }) {
      expose({ getCropBlob })
      return () => h('div', { 'data-image': props.img })
    },
  }),
}))

describe('standalone documentation examples', () => {
  const directory = resolve('src/examples')
  for (const file of readdirSync(directory).filter(file => file.endsWith('.vue'))) {
    it(`compiles ${file} without private project dependencies`, () => {
      const source = readFileSync(resolve(directory, file), 'utf8')
      const { descriptor, errors } = parse(source, { filename: file })
      expect(errors).toEqual([])
      const script = compileScript(descriptor, { id: file })
      const template = compileTemplate({ source: descriptor.template!.content, filename: file, id: file, compilerOptions: { bindingMetadata: script.bindings } })
      expect(template.errors).toEqual([])
      const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1])
      expect(imports).toEqual(['vue', 'cropper-next-vue'])
    })
  }

  it('exports the public method result and releases the previous preview', async () => {
    const blob = new Blob(['crop'], { type: 'image/png' })
    getCropBlob.mockResolvedValue(blob)
    const createObjectURL = vi.fn().mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }))
    const wrapper = mount(BasicCrop)
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(getCropBlob).toHaveBeenCalledTimes(1)
    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(wrapper.get('img').attributes('src')).toBe('blob:first')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:first')
    expect(wrapper.get('img').attributes('src')).toBe('blob:second')
    wrapper.unmount()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:second')
    vi.unstubAllGlobals()
  })
})
