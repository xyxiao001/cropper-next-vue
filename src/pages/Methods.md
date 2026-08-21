<LangBlock lang="zh">

# 方法

当前版本通过组件 `ref` 暴露的方法较少，主要用于获取裁剪结果。

## 获取实例

```ts
const cropper = ref()
```

```html
<vue-cropper ref="cropper" :img="img" />
```

## 方法列表

方法 | 说明
--- | ---
`cropper.value.getCropData(type?)` | 获取裁剪结果，返回 `Promise<string>`
`cropper.value.getCropBlob()` | 获取裁剪结果，返回 `Promise<Blob>`
`cropper.value.rotateLeft()` | 向左旋转 `90deg`
`cropper.value.rotateRight()` | 向右旋转 `90deg`
`cropper.value.rotateClear()` | 清空旋转角度，恢复为 `0deg`
`cropper.value.flipHorizontal()` | 相对屏幕方向切换水平翻转
`cropper.value.flipVertical()` | 相对屏幕方向切换垂直翻转
`cropper.value.getCropCoordinates()` | 同步获取原图裁剪四角、外接矩形、源图尺寸和变换信息
`cropper.value.reload()` | 重新加载当前 `img`，并重新进入加载流程
`cropper.value.reset()` | 不重新加载图片，恢复当前 props 对应的初始图片与截图框状态
`cropper.value.setRotateAngle(angle)` | 直接设置图片旋转角度，自动归一化到 `0-360`
`cropper.value.setCropLayout({ width, height })` | 手动设置截图框大小，支持数字、`px`、`%`
`cropper.value.setCropAxis({ x, y })` | 手动设置截图框坐标，并按当前边界规则校验
`cropper.value.zoomIn(step?)` | 按当前缩放比例放大图片，默认步进为 `0.1`
`cropper.value.zoomOut(step?)` | 按当前缩放比例缩小图片，默认步进为 `0.1`
`cropper.value.changeScale(value?)` | 按传入值改变缩放比例，正数放大、负数缩小

## 参数说明

`getCropData(type?)`

- 默认返回 base64 数据
- 当前实现会根据组件的 `outputType` 输出对应格式
- `type` 参数当前主要用于兼容调用方式，推荐直接使用默认值

`getCropBlob()`

- 返回 `Blob`
- 更适合直接上传到服务端或和 `FormData` 搭配使用

`reset()`

- 恢复图片位置、缩放、旋转、截图框位置和截图框大小
- 清除水平和垂直翻转状态
- 使用调用时最新的 `mode`、`defaultRotate` 和 `cropLayout` props
- 不重新请求、读取或解码图片；没有已加载图片时不改变状态

`setRotateAngle(angle)`

- 支持传入任意数字角度
- 内部会归一化到 `0-360`

`setCropLayout({ width, height })`

- 支持 `number`、`'300px'`、`'60%'`
- 设置后会重新布局截图框

`setCropAxis({ x, y })`

- 用于直接指定截图框坐标
- 如果开启了 `centerBox` 或 `centerWrapper`，设置后会触发边界检测

`zoomIn(step?)` / `zoomOut(step?)`

- 默认每次基于当前缩放比例调整 `10%`
- 可以传入自定义相对步进，例如 `zoomIn(0.2)` 表示放大 `20%`，`zoomOut(0.05)` 表示缩小 `5%`
- 和鼠标滚轮缩放一致，缩放后会按当前边界规则触发回弹校验

`changeScale(value?)`

- 正数表示放大，负数表示缩小，例如 `changeScale(0.1)`、`changeScale(-0.1)`
- 适合需要自己计算按钮步进或滑杆差值的场景
- 三个公开缩放方法都遵守最新的 `minScale`、`maxScale` 和边界覆盖要求

`getCropCoordinates()`

- 没有已加载图片时返回 `null`，否则同步返回方向校正后源图坐标
- `points` 依次对应截图框左上、右上、右下、左下，点位不会被限制到源图边界
- 调用只读取当前状态，不触发 `change`、`real-time` 或图片导出

## 示例

```ts
cropper.value.getCropData().then((data) => {
  console.log(data)
})
```

```ts
cropper.value.getCropBlob().then((blob) => {
  const formData = new FormData()
  formData.append('file', blob, 'crop.png')
})
```

```ts
const zoomIn = () => {
  cropper.value?.zoomIn?.()
}

const zoomOut = () => {
  cropper.value?.zoomOut?.()
}
```

## 说明

当前版本仍然没有旧版的 `startCrop`、`stopCrop`、`clearCrop`、`getImgAxis`、`getCropAxis`、`goAutoCrop`。这些属于旧版“可变裁剪框”路线，和当前实现不一致。

</LangBlock>

<LangBlock lang="en">

# Methods

The current version exposes a small set of instance methods through component `ref`, mainly focused on export and rotation control.

## Get the instance

```ts
const cropper = ref()
```

```html
<vue-cropper ref="cropper" :img="img" />
```

## Method list

Method | Description
--- | ---
`cropper.value.getCropData(type?)` | Get crop result as `Promise<string>`
`cropper.value.getCropBlob()` | Get crop result as `Promise<Blob>`
`cropper.value.rotateLeft()` | Rotate left by `90deg`
`cropper.value.rotateRight()` | Rotate right by `90deg`
`cropper.value.rotateClear()` | Reset rotation back to `0deg`
`cropper.value.flipHorizontal()` | Toggle horizontal flip relative to the screen axis
`cropper.value.flipVertical()` | Toggle vertical flip relative to the screen axis
`cropper.value.getCropCoordinates()` | Synchronously read source crop corners, bounding box, source size, and transform
`cropper.value.reload()` | Reload the current `img` and run the loading flow again
`cropper.value.reset()` | Restore the initial image and crop-box state for the current props without reloading the image
`cropper.value.setRotateAngle(angle)` | Set the image rotation angle and normalize it to `0-360`
`cropper.value.setCropLayout({ width, height })` | Set the crop-box size manually, supports numbers, `px`, and `%`
`cropper.value.setCropAxis({ x, y })` | Set the crop-box position manually and re-check boundaries
`cropper.value.zoomIn(step?)` | Zoom in by the current scale ratio, default step is `0.1`
`cropper.value.zoomOut(step?)` | Zoom out by the current scale ratio, default step is `0.1`
`cropper.value.changeScale(value?)` | Change scale by the given delta. Positive zooms in, negative zooms out

## Details

`getCropData(type?)`

- returns base64 by default
- uses the component `outputType` as the export format
- the `type` parameter is kept mainly for compatibility, and the default is recommended

`getCropBlob()`

- returns a `Blob`
- better suited for uploads and `FormData`

`reset()`

- restores image position, scale, rotation, crop-box position, and crop-box size
- clears horizontal and vertical flip state
- uses the latest `mode`, `defaultRotate`, and `cropLayout` props at call time
- does not request, read, or decode the image again; it has no effect before an image is loaded

`setRotateAngle(angle)`

- accepts any numeric angle
- normalizes it to `0-360`

`setCropLayout({ width, height })`

- supports `number`, `'300px'`, and `'60%'`
- re-layouts the crop box after updating

`setCropAxis({ x, y })`

- sets the crop-box coordinates directly
- triggers boundary checks when `centerBox` or `centerWrapper` is enabled

`zoomIn(step?)` / `zoomOut(step?)`

- adjusts by `10%` of the current scale by default
- accepts a custom relative step, for example `zoomIn(0.2)` means zoom in by `20%`, and `zoomOut(0.05)` means zoom out by `5%`
- follows the same boundary rebound behavior as mouse-wheel zoom

`changeScale(value?)`

- positive values zoom in and negative values zoom out, for example `changeScale(0.1)` and `changeScale(-0.1)`
- useful when buttons or sliders calculate their own scale delta
- all three public zoom methods respect the latest `minScale`, `maxScale`, and boundary coverage requirement

`getCropCoordinates()`

- returns `null` before an image is loaded; otherwise returns coordinates in the orientation-normalized source image
- `points` follows crop-box top-left, top-right, bottom-right, and bottom-left order and is not clamped to source bounds
- this is a read-only call and does not emit `change` / `real-time` or export an image

## Example

```ts
cropper.value.getCropData().then((data) => {
  console.log(data)
})
```

```ts
cropper.value.getCropBlob().then((blob) => {
  const formData = new FormData()
  formData.append('file', blob, 'crop.png')
})
```

```ts
const zoomIn = () => {
  cropper.value?.zoomIn?.()
}

const zoomOut = () => {
  cropper.value?.zoomOut?.()
}
```

## Notes

The current version still does not include old APIs such as `startCrop`, `stopCrop`, `clearCrop`, `getImgAxis`, `getCropAxis`, or `goAutoCrop`. Those belonged to the old resizable crop-box direction.

</LangBlock>
