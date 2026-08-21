# 数据模型：图片编辑与原图几何

## 缩放范围

| 字段 | 类型 | 规则 |
|---|---|---|
| `minScale` | number | 正数，默认 `0.01` |
| `maxScale` | number | 正数，默认无限上限，且调用方保证不小于 `minScale` |
| `boundaryMin` | number | 当前边界覆盖所需比例；未启用边界时为 `0` |
| `effectiveMin` | number | `max(minScale, boundaryMin)` |
| `effectiveMax` | number | `max(maxScale, effectiveMin)` |

状态转换：每次用户或公开缩放请求都读取最新配置和边界要求，把目标比例限制在有效范围内。越界目标被限制为当前比例时，位置保持不变。

## 图片变换状态

| 字段 | 类型 | 说明 |
|---|---|---|
| `x` | number | 缩放后、未旋转矩形左上角的容器横坐标 |
| `y` | number | 缩放后、未旋转矩形左上角的容器纵坐标 |
| `scale` | number | 当前绝对缩放比例 |
| `rotate` | number | 当前旋转角度 |
| `flipX` | boolean | 是否相对屏幕水平轴执行左右镜像 |
| `flipY` | boolean | 是否相对屏幕垂直轴执行上下镜像 |

状态转换：

- `flipHorizontal()`：仅切换 `flipX`。
- `flipVertical()`：仅切换 `flipY`。
- 同一方法调用两次恢复原值。
- `reset()`：`flipX=false`、`flipY=false`，并继续执行现有复位流程。

## 原图裁剪几何

```ts
type OriginalCropCoordinates = {
  points: [Axis, Axis, Axis, Axis]
  boundingBox: Axis & { width: number; height: number }
  source: { width: number; height: number }
  transform: { rotate: number; flipX: boolean; flipY: boolean }
}
```

### `points`

四个点依次对应裁剪框在屏幕中的左上、右上、右下、左下。每个点使用方向校正后的源图像素坐标，允许出现负数或大于源图尺寸的值。

### `boundingBox`

由四角点的 `minX`、`minY`、`maxX`、`maxY` 计算：

- `x = minX`
- `y = minY`
- `width = maxX - minX`
- `height = maxY - minY`

### `source`

等于当前方向校正后源 canvas 的宽高，也是点坐标的参考尺寸。

### `transform`

记录计算时的旋转和翻转状态，便于服务端解释四角点及业务保存编辑参数。
