export const revokeBlobUrl = (url: string) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// Ensure the blob URL is decoded before we swap it into the DOM <img>.
// This avoids "blank then suddenly appears" on first render or slow devices.
export const decodeImgUrl = async (url: string): Promise<void> => {
  try {
    const img = new Image()
    img.src = url
    // `decode()` is supported by modern browsers; fallback to onload.
    if (typeof (img as any).decode === 'function') {
      await (img as any).decode()
      return
    }
    await new Promise<void>(resolve => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    })
  } catch {
    // Best-effort: if decode fails, we still proceed to avoid blocking UI forever.
  }
}

export const nextFrame = () =>
  new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve())
  })

const getPreviewDpr = (getDevicePixelRatio?: () => number) => {
  if (typeof window === 'undefined') return 1
  const dpr = (getDevicePixelRatio ? getDevicePixelRatio() : window.devicePixelRatio) || 1
  // Clamp to keep preview stable on very high DPR screens.
  return Math.min(Math.max(1, dpr), 2)
}

export type PreviewWrapLayout = { width: number; height: number }

export type PreviewOptions = {
  previewMaxSide?: number
  getWrapLayout: () => PreviewWrapLayout
  getDevicePixelRatio?: () => number
}

export const createPreviewUrlFromCanvas = async (
  srcCanvas: HTMLCanvasElement,
  options: PreviewOptions,
): Promise<string> => {
  const { previewMaxSide, getWrapLayout, getDevicePixelRatio } = options

  // `previewMaxSide <= 0` is treated as "no cap".
  const cap = Number(previewMaxSide)
  const maxSide = Number.isFinite(cap) && cap > 0 ? cap : Number.POSITIVE_INFINITY

  const wrap = getWrapLayout()
  const targetEdge = Math.max(1, Math.max(wrap.width || 0, wrap.height || 0) * getPreviewDpr(getDevicePixelRatio))

  const srcMax = Math.max(srcCanvas.width, srcCanvas.height)
  const desiredEdge = Math.min(maxSide, targetEdge)
  const scale = Math.min(1, desiredEdge / Math.max(1, srcMax))

  let outCanvas = srcCanvas
  if (scale < 1) {
    const w = Math.max(1, Math.round(srcCanvas.width * scale))
    const h = Math.max(1, Math.round(srcCanvas.height * scale))
    const scaled = document.createElement('canvas')
    scaled.width = w
    scaled.height = h
    const ctx = scaled.getContext('2d') as CanvasRenderingContext2D
    ctx.imageSmoothingEnabled = true
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high'
    }
    ctx.drawImage(srcCanvas, 0, 0, w, h)
    outCanvas = scaled
  }

  return new Promise((resolve, reject) => {
    outCanvas.toBlob(
      async blob => {
        if (!blob) {
          reject(new Error('Failed to create preview blob'))
          return
        }
        const url = URL.createObjectURL(blob)
        await decodeImgUrl(url)
        resolve(url)
      },
      'image/png',
      1,
    )
  })
}

