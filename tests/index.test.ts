import { describe, expect, it, vi } from 'vitest'

vi.mock('../package.json', () => ({
  default: { version: '0.1.0' },
}))

import CropperNextVue, { VueCropper, globalCropper } from '../lib/index'

describe('library entry', () => {
  it('exports installable plugin metadata', () => {
    expect(CropperNextVue).toBe(globalCropper)
    expect(globalCropper.version).toBe('0.1.0')
    expect(VueCropper).toBeTruthy()
  })

  it('registers the component through install', () => {
    const component = vi.fn()

    globalCropper.install({ component } as never)

    expect(component).toHaveBeenCalledWith('VueCropper', VueCropper)
  })
})
