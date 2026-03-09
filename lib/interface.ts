import type { CSSProperties } from 'vue'

declare global {
  interface Window {
    requestAnimationFrame: any,
    ActiveXObject?: unknown,
  }
}

export type InterfaceLength = number | string

export interface InterfaceLayout extends CSSProperties {
  width: InterfaceLength
  height: InterfaceLength
  background?: string
  backgroundImage?: string
}

export interface InterfaceLayoutInput {
  width: InterfaceLength
  height: InterfaceLength
}

export interface InterfaceImgLoad {
  type: string
  message: string
}

export interface InterfaceRealTimePreview {
  w: number
  h: number
  url: string
  img: {
    width: string
    height: string
    transform: string
  }
  html: string
}

export interface InterfaceLayoutStyle {
  width: number
  height: number
}

export interface InterfaceModeHandle {
  contain: () => {}
  cover: () => {}
  default: () => {}
}

export interface InterfaceRenderImgLayout {
  scale: number
  rotate: number
  imgStyle: InterfaceLayoutStyle
  layoutStyle: InterfaceLayoutStyle
}

export interface InterfaceMessageEvent {
  type: string
  event?: Event
  change?: InterfaceAxis,
  scale?: number,
}

export interface InterfaceAxis {
  x: number
  y: number
}

export interface InterfaceImgAxis extends InterfaceAxis {
  scale: number
  rotate: number
}

export interface InterfaceTransformStyle extends CSSProperties {
  width: string
  height: string
  transform: string
}

export interface InterfaceBoundary {
  left: number
  right: number
  top: number
  bottom: number
  scale: number
}
