# 公开契约：VueCropper 可缩放裁剪框

## 新增 Prop

| 名称 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `cropBoxResizable` | `boolean` | `false` | 是否允许用户通过四边和四角控制点缩放裁剪框 |

## 兼容性约定

- `cropBoxResizable` 未传入或为 `false` 时，不显示控制点，现有行为不变。
- 该参数只控制用户缩放裁剪框，不改变 `movable`、`zoomable` 或公开实例方法的能力。
- 全屏裁剪模式下裁剪框不可见，因此不显示控制点。
- 开启后，可见裁剪框在拖动控制区期间显示三等分九宫格，松手后渐隐；九宫格与控制点共用该参数，不提供独立开关。
- 九宫格、边框和控制点使用现有裁剪框颜色体系；九宫格仅为辅助视觉，不进入导出结果。

## 现有事件

不新增事件。缩放过程继续通过现有 `change` 事件输出：

```ts
interface CropperState {
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

缩放裁剪框时仅更新 `crop` 中实际发生变化的几何含义；不改变事件名称和整体结构。

## 现有实例方法

- `reset()`：恢复传入的初始裁剪框尺寸和居中位置，同时保持现有图片重置行为。
- `getCropData()` / `getCropBlob()`：使用当前缩放后的裁剪框。
- `getCropCoordinates()`：使用当前缩放后的裁剪框返回原图坐标。
- `setCropLayout()` / `setCropAxis()`：公开语义不变，可继续通过代码设置裁剪框。

## 明确不包含

- 不新增比例锁定参数。
- 不新增裁剪框最小宽高参数。
- 不新增 resize 生命周期事件。
- 不新增裁剪框移动专用开关。
