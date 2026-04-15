import type { InterfaceAxis } from '../interface'

export type LayoutContainerState = {
  imgLayout: { width: number; height: number }
  wrapLayout: { width: number; height: number }
  imgAxis: { x: number; y: number; scale: number; rotate: number }
  imgExhibitionStyle: { width: string; height: string; transform: string }
  cropAxis: InterfaceAxis
  cropExhibitionStyle: { div: any; img: any }
}

export const createLayoutContainer = (): LayoutContainerState => {
  return {
    imgLayout: { width: 0, height: 0 },
    wrapLayout: { width: 0, height: 0 },
    imgAxis: { x: 0, y: 0, scale: 0, rotate: 0 },
    imgExhibitionStyle: { width: '', height: '', transform: '' },
    cropAxis: { x: 0, y: 0 },
    cropExhibitionStyle: { div: {}, img: {} },
  }
}

