import type { Ref } from 'vue'
import { BOUNDARY_DURATION } from '../config'

export const useBoundaryDuration = (options: {
  centerBox: Ref<boolean>
  centerWrapper: Ref<boolean>
  centerBoxDelay: Ref<number>
  centerWrapperDelay: Ref<number>
}) => {
  const { centerBox, centerWrapper, centerBoxDelay, centerWrapperDelay } = options

  const getBoundaryDuration = () => {
    if (centerBox.value) {
      return Math.max(0, centerBoxDelay.value)
    }
    if (centerWrapper.value) {
      return Math.max(0, centerWrapperDelay.value)
    }
    return BOUNDARY_DURATION
  }

  return { getBoundaryDuration }
}

