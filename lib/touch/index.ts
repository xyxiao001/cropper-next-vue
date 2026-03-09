import WatchEvent from '../watchEvents'
import type { InterfaceAxis, InterfaceMessageEvent } from '../interface'

const SUPPORT_TOUCH = typeof window !== 'undefined' && 'ontouchstart' in window
const SUPPORT_MOUSE = typeof window !== 'undefined' && 'onmouseup' in window

type TouchPointPair = [globalThis.Touch, globalThis.Touch]

class CropperTouchEvent {
  element: HTMLElement
  pre: InterfaceAxis
  watcher: WatchEvent
  touches: TouchPointPair | null

  constructor(element: HTMLElement) {
    this.element = element
    this.touches = null
    this.pre = { x: 0, y: 0 }
    this.watcher = new WatchEvent()
  }

  private fire(message: InterfaceMessageEvent) {
    this.watcher.fire(message)
  }

  private getAxis(event: MouseEvent): InterfaceAxis {
    return {
      x: event.clientX,
      y: event.clientY,
    }
  }

  private getTouchPair(touches: globalThis.TouchList): TouchPointPair | null {
    if (touches.length < 2) {
      return null
    }
    return [touches[0], touches[1]]
  }

  start(event: MouseEvent) {
    event.preventDefault()
    if (event.which !== 1) {
      return
    }

    this.pre = this.getAxis(event)
    this.fire({
      type: 'down',
      event,
    })

    window.addEventListener('mousemove', this.move)
    window.addEventListener('mouseup', this.stop)
  }

  startTouch(event: globalThis.TouchEvent) {
    const touch = event.touches[0]
    if (!touch) {
      return
    }

    this.pre = {
      x: touch.clientX,
      y: touch.clientY,
    }
    this.fire({
      type: 'down',
      event,
    })

    const touchPair = this.getTouchPair(event.touches)
    if (touchPair) {
      this.touches = touchPair
      window.addEventListener('touchmove', this.scaleTouch, { passive: false })
      window.removeEventListener('touchmove', this.moveTouch)
    } else {
      window.addEventListener('touchmove', this.moveTouch, { passive: false })
      window.removeEventListener('touchmove', this.scaleTouch)
    }

    window.addEventListener('touchend', this.stopTouch)
  }

  move(event: MouseEvent) {
    event.preventDefault()
    const nowAxis = this.getAxis(event)
    this.fire({
      type: 'down-to-move',
      event,
      change: {
        x: nowAxis.x - this.pre.x,
        y: nowAxis.y - this.pre.y,
      },
    })
    this.pre = nowAxis
  }

  moveTouch(event: globalThis.TouchEvent) {
    event.preventDefault()
    const touch = event.touches[0]
    if (!touch) {
      return
    }

    this.fire({
      type: 'down-to-move',
      event,
      change: {
        x: touch.clientX - this.pre.x,
        y: touch.clientY - this.pre.y,
      },
    })

    this.pre = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  private getLen(touches: InterfaceAxis): number {
    return Math.sqrt(touches.x * touches.x + touches.y * touches.y)
  }

  private getScale(cur: TouchPointPair, pre: TouchPointPair): number {
    const curCenter = {
      x: cur[1].clientX - cur[0].clientX,
      y: cur[1].clientY - cur[0].clientY,
    }
    const preCenter = {
      x: pre[1].clientX - pre[0].clientX,
      y: pre[1].clientY - pre[0].clientY,
    }

    return this.getLen(curCenter) / this.getLen(preCenter)
  }

  scaleTouch(event: globalThis.TouchEvent) {
    event.preventDefault()
    const nextTouches = this.getTouchPair(event.touches)
    if (!nextTouches || !this.touches) {
      return
    }

    this.fire({
      type: 'down-to-scale',
      event,
      scale: this.getScale(nextTouches, this.touches),
    })
    this.touches = nextTouches
  }

  stop(event: MouseEvent) {
    this.fire({
      type: 'up',
      event,
    })
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('mouseup', this.stop)
  }

  stopTouch(event: globalThis.TouchEvent) {
    this.fire({
      type: 'up',
      event,
    })
    this.touches = null
    window.removeEventListener('touchmove', this.moveTouch)
    window.removeEventListener('touchmove', this.scaleTouch)
    window.removeEventListener('touchend', this.stopTouch)
  }

  on(type: string, handler: (message: InterfaceMessageEvent) => void) {
    this.watcher.addHandler(type, handler)
    if (type !== 'down-to-move' && type !== 'down-to-scale' && type !== 'up') {
      return
    }

    if (SUPPORT_MOUSE) {
      this.start = this.start.bind(this)
      this.move = this.move.bind(this)
      this.stop = this.stop.bind(this)
      this.element.addEventListener('mousedown', this.start)
    }

    if (SUPPORT_TOUCH) {
      this.startTouch = this.startTouch.bind(this)
      this.moveTouch = this.moveTouch.bind(this)
      this.scaleTouch = this.scaleTouch.bind(this)
      this.stopTouch = this.stopTouch.bind(this)
      this.element.addEventListener('touchstart', this.startTouch, { passive: false })
    }
  }

  off(type: string, handler: (message: InterfaceMessageEvent) => void) {
    this.watcher.removeHandler(type, handler)
    if (type !== 'down-to-move' && type !== 'down-to-scale' && type !== 'up') {
      return
    }

    if (SUPPORT_MOUSE) {
      this.element.removeEventListener('mousedown', this.start)
      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('mouseup', this.stop)
    }

    if (SUPPORT_TOUCH) {
      this.element.removeEventListener('touchstart', this.startTouch)
      window.removeEventListener('touchmove', this.moveTouch)
      window.removeEventListener('touchmove', this.scaleTouch)
      window.removeEventListener('touchend', this.stopTouch)
    }
  }
}

export default CropperTouchEvent
