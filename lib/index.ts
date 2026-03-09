import VueCropper from './vue-cropper.vue'
import type { VueCropperGlobal } from './typings'
import packageJson from '../package.json'

const install = function(app: any) {
  app.component('VueCropper', VueCropper)
}

if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (fn: FrameRequestCallback) => {
      return window.setTimeout(fn, 17)
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = id => {
      window.clearTimeout(id)
    }
  }
}

export const globalCropper: VueCropperGlobal = {
  version: packageJson.version,
  install,
  VueCropper,
}

export { VueCropper }

export default globalCropper
