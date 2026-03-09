import VueCropper from '../vue-cropper.vue'
import { globalCropper } from '../index'
export interface VueCropperGlobal {
  version: string,
  install: (app: any, ...options: any[]) => any,
  VueCropper: typeof VueCropper
}

export {
  VueCropper
}

export default globalCropper
