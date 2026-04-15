import type { InterfaceLength } from '../interface'

export const parseLength = (value: InterfaceLength, base: number = 0): number => {
  if (typeof value === 'number') {
    return value
  }
  const normalized = value.trim()
  if (normalized.endsWith('%')) {
    const parsedPercent = Number.parseFloat(normalized)
    if (!Number.isFinite(parsedPercent) || base <= 0) {
      return 0
    }
    return (base * parsedPercent) / 100
  }
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export const normalizeLengthStyle = (value: InterfaceLength): string => {
  return typeof value === 'number' ? `${value}px` : value
}

export const normalizeRotate = (rotate: number): number => {
  if (!Number.isFinite(rotate)) {
    return 0
  }
  const normalized = ((rotate % 360) + 360) % 360
  return Object.is(normalized, -0) ? 0 : normalized
}

