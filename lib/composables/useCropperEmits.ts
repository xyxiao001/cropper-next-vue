import type { InterfaceCropperState, InterfaceImgLoad, InterfaceRealTimePreview } from '../interface'

type CropperEmit = {
  (e: 'img-load', obj: InterfaceImgLoad): void
  (e: 'img-upload', url: string): void
  (e: 'real-time', payload: InterfaceRealTimePreview): void
  (e: 'realTime', payload: InterfaceRealTimePreview): void
  (e: 'change', payload: InterfaceCropperState): void
}

export const useCropperEmits = (emit: CropperEmit) => {
  const imgLoadEmit = (obj: InterfaceImgLoad) => {
    emit('img-load', obj)
  }

  const imgUploadEmit = (url: string) => {
    emit('img-upload', url)
  }

  // `useRealTime` expects an emitter that accepts either event name.
  const emitRealTime = (event: 'real-time' | 'realTime', payload: InterfaceRealTimePreview) => {
    if (event === 'real-time') {
      emit('real-time', payload)
      return
    }
    emit('realTime', payload)
  }

  const emitChange = (payload: InterfaceCropperState) => {
    emit('change', payload)
  }

  return {
    imgLoadEmit,
    imgUploadEmit,
    emitRealTime,
    emitChange,
  }
}
