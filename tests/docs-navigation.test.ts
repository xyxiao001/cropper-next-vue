import { describe, expect, it } from 'vitest'
import { docPages } from '../src/docs/navigation'

describe('documentation navigation', () => {
  it('preserves every existing public document URL', () => {
    const paths = ['/', '/guide', '/props', '/methods', '/event', '/changelog', '/scenario-avatar', '/scenario-cover', '/scenario-product', '/demo-basic', '/demo-loading', '/demo-drag', '/demo-crop', '/demo-img', '/demo-filter', '/demo-rotate', '/demo-realtime', '/demo-export', '/demo-all', '/demo-geometry']
    expect(docPages.map(page => page.path)).toEqual(expect.arrayContaining(paths))
    expect(new Set(docPages.map(page => page.path)).size).toBe(docPages.length)
  })
  it('provides both languages and valid related destinations', () => {
    for (const page of docPages) {
      expect(page.title.zh).toBeTruthy()
      expect(page.title.en).toBeTruthy()
      for (const path of page.related) expect(docPages.some(entry => entry.path === path)).toBe(true)
    }
  })
})
