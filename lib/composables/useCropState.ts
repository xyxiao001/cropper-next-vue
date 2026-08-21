import { onScopeDispose } from 'vue'
import type { Ref } from 'vue'
import type { InterfaceCropperState, InterfaceImgAxis } from '../interface'

type LayoutContainerLike = {
  imgAxis: InterfaceImgAxis
  cropAxis: { x: number; y: number }
}

export const useCropState = (options: {
  imgs: Ref<string>
  effectiveCropLayoutStyle: Ref<{ width: number; height: number }>
  layout: LayoutContainerLike
  emit: (payload: InterfaceCropperState) => void
}) => {
  const { imgs, effectiveCropLayoutStyle, layout, emit } = options

  let changeFrame = 0

  const getCropperState = (): InterfaceCropperState | null => {
    if (!imgs.value) {
      return null
    }

    return {
      image: { ...layout.imgAxis },
      crop: {
        ...layout.cropAxis,
        ...effectiveCropLayoutStyle.value,
      },
    }
  }

  const emitChange = () => {
    const payload = getCropperState()
    if (payload) {
      emit(payload)
    }
  }

  const queueChangeEmit = () => {
    if (changeFrame) {
      cancelAnimationFrame(changeFrame)
    }
    changeFrame = requestAnimationFrame(() => {
      changeFrame = 0
      emitChange()
    })
  }

  onScopeDispose(() => {
    if (changeFrame) {
      cancelAnimationFrame(changeFrame)
      changeFrame = 0
    }
  })

  return {
    getCropperState,
    queueChangeEmit,
  }
}
