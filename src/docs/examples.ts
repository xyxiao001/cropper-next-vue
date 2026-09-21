import BasicCrop from '../examples/BasicCrop.vue?raw'
import AvatarCrop from '../examples/AvatarCrop.vue?raw'
import CoverCrop from '../examples/CoverCrop.vue?raw'
import ProductCrop from '../examples/ProductCrop.vue?raw'
import RatioCrop from '../examples/RatioCrop.vue?raw'
import BoundaryCrop from '../examples/BoundaryCrop.vue?raw'
import RotationCrop from '../examples/RotationCrop.vue?raw'
import ExportCrop from '../examples/ExportCrop.vue?raw'
import UploadCrop from '../examples/UploadCrop.vue?raw'
import LoadingCrop from '../examples/LoadingCrop.vue?raw'
import FilterCrop from '../examples/FilterCrop.vue?raw'
import GeometryCrop from '../examples/GeometryCrop.vue?raw'
import RealtimeCrop from '../examples/RealtimeCrop.vue?raw'

export const exampleSources: Record<string, string> = {
  '/guide': BasicCrop,
  '/demo-basic': BasicCrop,
  '/scenario-avatar': AvatarCrop,
  '/scenario-cover': CoverCrop,
  '/scenario-product': ProductCrop,
  '/demo-crop': RatioCrop,
  '/demo-img': BoundaryCrop,
  '/demo-rotate': RotationCrop,
  '/demo-export': ExportCrop,
  '/demo-drag': UploadCrop,
  '/demo-loading': LoadingCrop,
  '/demo-filter': FilterCrop,
  '/demo-geometry': GeometryCrop,
  '/demo-realtime': RealtimeCrop,
}
