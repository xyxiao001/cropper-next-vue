import type { Ref } from 'vue'
import type {
  InterfaceAxis,
  InterfaceCropCoordinates,
  InterfaceImgAxis,
  InterfaceLayoutStyle,
} from '../interface'

type CropGeometryLayout = {
  imgLayout: InterfaceLayoutStyle
  imgAxis: InterfaceImgAxis
  cropAxis: InterfaceAxis
}

export const useCropCoordinates = (options: {
  imgs: Ref<string>
  layout: CropGeometryLayout
  cropLayout: Ref<InterfaceLayoutStyle>
}) => {
  const getCropCoordinates = (): InterfaceCropCoordinates | null => {
    if (!options.imgs.value) {
      return null
    }

    const { imgAxis, imgLayout, cropAxis } = options.layout
    const cropLayout = options.cropLayout.value
    const imageCenter = {
      x: imgAxis.x + (imgLayout.width * imgAxis.scale) / 2,
      y: imgAxis.y + (imgLayout.height * imgAxis.scale) / 2,
    }
    const sourceCenter = {
      x: imgLayout.width / 2,
      y: imgLayout.height / 2,
    }
    const angle = (imgAxis.rotate * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const cropPoints: [InterfaceAxis, InterfaceAxis, InterfaceAxis, InterfaceAxis] = [
      { x: cropAxis.x, y: cropAxis.y },
      { x: cropAxis.x + cropLayout.width, y: cropAxis.y },
      { x: cropAxis.x + cropLayout.width, y: cropAxis.y + cropLayout.height },
      { x: cropAxis.x, y: cropAxis.y + cropLayout.height },
    ]

    const points = cropPoints.map(point => {
      let x = (point.x - imageCenter.x) / imgAxis.scale
      let y = (point.y - imageCenter.y) / imgAxis.scale
      if (imgAxis.flipX) x = -x
      if (imgAxis.flipY) y = -y

      return {
        x: sourceCenter.x + x * cos + y * sin,
        y: sourceCenter.y - x * sin + y * cos,
      }
    }) as InterfaceCropCoordinates['points']

    const xs = points.map(point => point.x)
    const ys = points.map(point => point.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    return {
      points,
      boundingBox: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      },
      source: { ...imgLayout },
      transform: {
        rotate: imgAxis.rotate,
        flipX: imgAxis.flipX,
        flipY: imgAxis.flipY,
      },
    }
  }

  return { getCropCoordinates }
}
