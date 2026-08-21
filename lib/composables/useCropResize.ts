import { ref } from 'vue'
import type { Ref } from 'vue'
import type {
  InterfaceAxis,
  InterfaceCropGeometry,
  InterfaceCropResizeConstraints,
  InterfaceCropResizeDirection,
  InterfaceCropResizeSession,
  InterfaceLayoutInput,
  InterfaceLayoutStyle,
} from '../interface'

type CropResizeLayout = {
  wrapLayout: InterfaceLayoutStyle
  cropAxis: InterfaceAxis
}

type CropResizeInput = {
  direction: InterfaceCropResizeDirection
  startCrop: InterfaceCropGeometry
  startPointer: InterfaceAxis
  currentPointer: InterfaceAxis
  wrapper: InterfaceLayoutStyle
  constraints?: InterfaceCropResizeConstraints
}

type ConstrainedCropSizeInput = {
  requested: InterfaceLayoutStyle
  wrapper: InterfaceLayoutStyle
  constraints: InterfaceCropResizeConstraints
}

export const CROP_BOX_MIN_SIZE = 24

export const DEFAULT_CROP_RESIZE_CONSTRAINTS: InterfaceCropResizeConstraints = {
  minWidth: CROP_BOX_MIN_SIZE,
  minHeight: CROP_BOX_MIN_SIZE,
  maxWidth: Infinity,
  maxHeight: Infinity,
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

export const calculateConstrainedCropSize = ({
  requested,
  wrapper,
  constraints,
}: ConstrainedCropSizeInput): InterfaceLayoutStyle => {
  if (constraints.aspectRatio === undefined) {
    return {
      width: clamp(requested.width, constraints.minWidth, Math.min(constraints.maxWidth, wrapper.width)),
      height: clamp(requested.height, constraints.minHeight, Math.min(constraints.maxHeight, wrapper.height)),
    }
  }

  const aspectRatio = constraints.aspectRatio
  const requestedWidth = Math.min(requested.width, requested.height * aspectRatio)
  const minWidth = Math.max(constraints.minWidth, constraints.minHeight * aspectRatio)
  const maxWidth = Math.min(
    constraints.maxWidth,
    constraints.maxHeight * aspectRatio,
    wrapper.width,
    wrapper.height * aspectRatio,
  )
  const width = clamp(requestedWidth, minWidth, maxWidth)

  return {
    width,
    height: width / aspectRatio,
  }
}

const calculateFreeResize = ({
  direction,
  startCrop,
  startPointer,
  currentPointer,
  wrapper,
  constraints,
}: CropResizeInput & { constraints: InterfaceCropResizeConstraints }): InterfaceCropGeometry => {
  const deltaX = currentPointer.x - startPointer.x
  const deltaY = currentPointer.y - startPointer.y
  const startRight = startCrop.x + startCrop.width
  const startBottom = startCrop.y + startCrop.height
  let left = startCrop.x
  let right = startRight
  let top = startCrop.y
  let bottom = startBottom

  if (direction.includes('w')) {
    const width = clamp(
      startCrop.width - deltaX,
      constraints.minWidth,
      Math.min(constraints.maxWidth, startRight),
    )
    left = startRight - width
  }
  if (direction.includes('e')) {
    const width = clamp(
      startCrop.width + deltaX,
      constraints.minWidth,
      Math.min(constraints.maxWidth, wrapper.width - startCrop.x),
    )
    right = startCrop.x + width
  }
  if (direction.includes('n')) {
    const height = clamp(
      startCrop.height - deltaY,
      constraints.minHeight,
      Math.min(constraints.maxHeight, startBottom),
    )
    top = startBottom - height
  }
  if (direction.includes('s')) {
    const height = clamp(
      startCrop.height + deltaY,
      constraints.minHeight,
      Math.min(constraints.maxHeight, wrapper.height - startCrop.y),
    )
    bottom = startCrop.y + height
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

const calculateRatioResize = ({
  direction,
  startCrop,
  startPointer,
  currentPointer,
  wrapper,
  constraints,
}: CropResizeInput & { constraints: InterfaceCropResizeConstraints }): InterfaceCropGeometry => {
  const aspectRatio = constraints.aspectRatio as number
  const deltaX = currentPointer.x - startPointer.x
  const deltaY = currentPointer.y - startPointer.y
  const startRight = startCrop.x + startCrop.width
  const startBottom = startCrop.y + startCrop.height
  const centerX = startCrop.x + startCrop.width / 2
  const centerY = startCrop.y + startCrop.height / 2
  const horizontalDelta = direction.includes('w') ? -deltaX : deltaX
  const verticalDelta = direction.includes('n') ? -deltaY : deltaY
  let targetWidth: number

  if (direction.length === 2) {
    const widthFromHorizontal = startCrop.width + horizontalDelta
    const widthFromVertical = startCrop.width + verticalDelta * aspectRatio
    targetWidth = Math.abs(horizontalDelta) >= Math.abs(verticalDelta * aspectRatio)
      ? widthFromHorizontal
      : widthFromVertical
  } else if (direction === 'w' || direction === 'e') {
    targetWidth = startCrop.width + horizontalDelta
  } else {
    targetWidth = (startCrop.height + verticalDelta) * aspectRatio
  }

  let maxWidth = Math.min(constraints.maxWidth, constraints.maxHeight * aspectRatio)
  if (direction.includes('w')) {
    maxWidth = Math.min(maxWidth, startRight)
  } else if (direction.includes('e')) {
    maxWidth = Math.min(maxWidth, wrapper.width - startCrop.x)
  } else {
    maxWidth = Math.min(maxWidth, 2 * Math.min(centerX, wrapper.width - centerX))
  }

  if (direction.includes('n')) {
    maxWidth = Math.min(maxWidth, startBottom * aspectRatio)
  } else if (direction.includes('s')) {
    maxWidth = Math.min(maxWidth, (wrapper.height - startCrop.y) * aspectRatio)
  } else {
    maxWidth = Math.min(
      maxWidth,
      2 * Math.min(centerY, wrapper.height - centerY) * aspectRatio,
    )
  }

  const minWidth = Math.max(constraints.minWidth, constraints.minHeight * aspectRatio)
  const width = clamp(targetWidth, minWidth, maxWidth)
  const height = width / aspectRatio

  return {
    x: direction.includes('w')
      ? startRight - width
      : direction.includes('e')
        ? startCrop.x
        : centerX - width / 2,
    y: direction.includes('n')
      ? startBottom - height
      : direction.includes('s')
        ? startCrop.y
        : centerY - height / 2,
    width,
    height,
  }
}

export const calculateCropResize = ({
  direction,
  startCrop,
  startPointer,
  currentPointer,
  wrapper,
  constraints = DEFAULT_CROP_RESIZE_CONSTRAINTS,
}: CropResizeInput): InterfaceCropGeometry => {
  const input = {
    direction,
    startCrop,
    startPointer,
    currentPointer,
    wrapper,
    constraints,
  }
  return constraints.aspectRatio === undefined
    ? calculateFreeResize(input)
    : calculateRatioResize(input)
}

const getTouch = (event: TouchEvent, identifier: number | null) => {
  const touches = Array.from(event.touches)
  if (identifier === null) return touches[0]
  return touches.find(touch => touch.identifier === identifier)
}

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return 'touches' in event
}

export const useCropResize = (options: {
  layout: CropResizeLayout
  innerCropLayout: Ref<InterfaceLayoutInput>
  effectiveCropLayoutStyle: Ref<InterfaceLayoutStyle>
  constraints: Ref<InterfaceCropResizeConstraints>
  constraintsEnabled?: Ref<boolean>
  cropResizing?: Ref<boolean>
  onStart: () => void
  onResize: () => void
  onEnd: () => void
}) => {
  const cropResizing = options.cropResizing ?? ref(false)
  let session: InterfaceCropResizeSession | null = null
  let touchIdentifier: number | null = null
  let inputType: 'mouse' | 'touch' | null = null

  const getEventPoint = (event: MouseEvent | TouchEvent): InterfaceAxis | null => {
    if (isTouchEvent(event)) {
      const touch = getTouch(event, touchIdentifier)
      if (!touch) return null
      return { x: touch.clientX, y: touch.clientY }
    }
    return { x: event.clientX, y: event.clientY }
  }

  const removeWindowListeners = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('touchcancel', handleTouchEnd)
  }

  const moveCropResize = (event: MouseEvent | TouchEvent) => {
    if (!session?.active) return
    const currentPointer = getEventPoint(event)
    if (!currentPointer) return
    event.preventDefault()

    const crop = calculateCropResize({
      direction: session.direction,
      startCrop: session.startCrop,
      startPointer: session.startPointer,
      currentPointer,
      wrapper: options.layout.wrapLayout,
      constraints: session.constraints,
    })
    options.innerCropLayout.value = {
      width: crop.width,
      height: crop.height,
    }
    options.layout.cropAxis = { x: crop.x, y: crop.y }
    options.onResize()
  }

  const finishCropResize = (notify: boolean) => {
    if (!session?.active) return
    session.active = false
    cropResizing.value = false
    removeWindowListeners()
    session = null
    touchIdentifier = null
    inputType = null
    if (notify) options.onEnd()
  }

  const endCropResize = () => finishCropResize(true)
  const destroyCropResize = () => finishCropResize(false)

  function handleMouseMove(event: MouseEvent) {
    moveCropResize(event)
  }

  function handleMouseUp() {
    endCropResize()
  }

  function handleTouchMove(event: TouchEvent) {
    moveCropResize(event)
  }

  function handleTouchEnd(event: TouchEvent) {
    const activeTouchEnded = Array.from(event.changedTouches).some(
      touch => touch.identifier === touchIdentifier,
    )
    if (activeTouchEnded || event.touches.length === 0) {
      endCropResize()
    }
  }

  const startCropResize = (
    direction: InterfaceCropResizeDirection,
    event: MouseEvent | TouchEvent,
  ) => {
    if (!isTouchEvent(event) && event.button !== 0) return
    if (isTouchEvent(event)) {
      touchIdentifier = event.touches[0]?.identifier ?? null
      inputType = 'touch'
    } else {
      inputType = 'mouse'
    }
    const startPointer = getEventPoint(event)
    if (!startPointer) return

    event.preventDefault()
    event.stopPropagation()
    const startCrop = {
      ...options.layout.cropAxis,
      ...options.effectiveCropLayoutStyle.value,
    }
    session = {
      direction,
      startPointer,
      startCrop,
      constraints: { ...options.constraints.value },
      active: true,
    }
    if (options.constraintsEnabled?.value) {
      options.innerCropLayout.value = {
        width: startCrop.width,
        height: startCrop.height,
      }
    }
    cropResizing.value = true
    options.onStart()

    if (inputType === 'touch') {
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
      window.addEventListener('touchcancel', handleTouchEnd)
    } else {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
  }

  return {
    cropResizing,
    startCropResize,
    moveCropResize,
    endCropResize,
    destroyCropResize,
  }
}
