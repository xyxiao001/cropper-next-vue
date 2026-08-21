# VueCropper 公开 API 合同

## 新增 Props

### `movable`

- 类型：`boolean`
- 默认值：`true`
- `false`：禁止鼠标和单指拖拽图片与裁剪框。
- 不影响：`setCropAxis()`、`reset()` 及其他实例方法。

### `zoomable`

- 类型：`boolean`
- 默认值：`true`
- `false`：禁止鼠标滚轮和双指缩放。
- 不影响：`zoomIn()`、`zoomOut()`、`changeScale()` 和 `reset()`。

## 新增事件

### `change`

触发时机：首次可用状态，以及图片或裁剪框状态完成变化后。

```ts
type CropperState = {
  image: {
    x: number
    y: number
    scale: number
    rotate: number
  }
  crop: {
    x: number
    y: number
    width: number
    height: number
  }
}
```

导出操作不触发该事件。现有 `real-time` 和 `realTime` 保持不变。

## 新增实例方法

### `reset()`

```ts
reset(): void
```

- 有已加载图片时，恢复调用时最新 props 对应的初始图片和裁剪框状态。
- 不重新请求、读取或解码图片。
- 无已加载图片时不改变状态。
- 完成后触发 `change`，并继续遵守现有边界规则。
