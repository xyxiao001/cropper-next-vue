import { describe, expect, it, vi } from 'vitest'
import WatchEvent from '../lib/watchEvents'

describe('WatchEvent', () => {
  it('fires registered handlers', () => {
    const bus = new WatchEvent()
    const handler = vi.fn()

    bus.addHandler('down', handler)
    bus.fire({ type: 'down' })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ type: 'down' })
  })

  it('removes handlers cleanly', () => {
    const bus = new WatchEvent()
    const handler = vi.fn()

    bus.addHandler('up', handler)
    bus.removeHandler('up', handler)
    bus.fire({ type: 'up' })

    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores missing handlers and empty event buckets', () => {
    const bus = new WatchEvent()
    const handler = vi.fn()

    bus.removeHandler('move', handler)
    bus.fire({ type: 'move' })

    expect(handler).not.toHaveBeenCalled()
  })
})
