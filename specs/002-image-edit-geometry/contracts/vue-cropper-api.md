# VueCropper P1 公开 API 合同

## 新增 Props

### `minScale`

- 类型：`number`
- 默认值：`0.01`
- 含义：所有用户和公开缩放入口允许的绝对最小比例。

### `maxScale`

- 类型：`number`
- 默认值：`Infinity`
- 含义：所有用户和公开缩放入口允许的绝对最大比例。

调用方应传入正数并保证 `minScale <= maxScale`。本版本不新增无效配置校验。当边界覆盖比例高于 `maxScale` 时，边界规则优先，有效最大比例提升到边界所需比例。

## 新增实例方法

### `flipHorizontal()`

```ts
flipHorizontal(): void
```

切换相对屏幕方向的左右镜像。无已加载图片时不改变状态。

### `flipVertical()`

```ts
flipVertical(): void
```

切换相对屏幕方向的上下镜像。无已加载图片时不改变状态。

### `getCropCoordinates()`

```ts
type Axis = { x: number; y: number }

type OriginalCropCoordinates = {
  points: [Axis, Axis, Axis, Axis]
  boundingBox: Axis & { width: number; height: number }
  source: { width: number; height: number }
  transform: {
    rotate: number
    flipX: boolean
    flipY: boolean
  }
}

getCropCoordinates(): OriginalCropCoordinates | null
```

- 同步返回方向校正后源图坐标。
- `points` 依次对应裁剪框左上、右上、右下、左下。
- 点位不限制到源图边界。
- 没有已加载图片时返回 `null`。
- 调用本方法不触发状态事件或导出。

## `change` 事件扩展

```ts
type CropperState = {
  image: {
    x: number
    y: number
    scale: number
    rotate: number
    flipX: boolean
    flipY: boolean
  }
  crop: {
    x: number
    y: number
    width: number
    height: number
  }
}
```

调用任一翻转方法后触发 `change`。现有字段和事件名保持不变。

## 现有方法行为补充

- `zoomIn()`、`zoomOut()`、`changeScale()` 遵守最新缩放上下限。
- `reset()` 清除两个翻转状态，并把比例恢复到最新配置和边界规则允许的初始值。
- `getCropData()`、`getCropBlob()`、`real-time` 和 `realTime` 均反映当前翻转状态。
