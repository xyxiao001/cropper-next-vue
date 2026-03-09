import { describe, expect, it } from 'vitest'
import layout from '../lib/layoutBox'

describe('layoutBox', () => {
  it('computes contain scale', () => {
    expect(
      layout({ width: 200, height: 100 }, { width: 100, height: 100 }, 'contain'),
    ).toBe(0.5)
  })

  it('computes cover scale', () => {
    expect(
      layout({ width: 100, height: 50 }, { width: 100, height: 100 }, 'cover'),
    ).toBe(2)
  })

  it('supports original mode', () => {
    expect(
      layout({ width: 100, height: 50 }, { width: 300, height: 300 }, 'original' as never),
    ).toBe(1)
  })

  it('supports explicit width mode', () => {
    expect(
      layout({ width: 200, height: 100 }, { width: 400, height: 400 }, '100px' as never),
    ).toBe(0.5)
  })

  it('supports percentage mode', () => {
    expect(
      layout({ width: 200, height: 100 }, { width: 500, height: 400 }, '50%' as never),
    ).toBe(1.25)
  })

  it('supports auto height mode', () => {
    expect(
      layout({ width: 200, height: 100 }, { width: 500, height: 400 }, 'auto 50%' as never),
    ).toBe(2)
  })
})
