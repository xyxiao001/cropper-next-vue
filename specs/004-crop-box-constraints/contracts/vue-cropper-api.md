# 公开契约：VueCropper 裁剪框限制

## 新增 Prop

| 名称 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `cropBoxConstraintsEnabled` | `boolean` | `false` | 是否启用整组裁剪框比例和尺寸限制 |
| `cropAspectRatio` | `number` | `undefined` | 限制开启后保持的宽高比，使用 `width / height` 表示 |
| `minCropWidth` | `number` | `24` | 用户拖动后允许的最小裁剪框宽度，单位为容器像素 |
| `minCropHeight` | `number` | `24` | 用户拖动后允许的最小裁剪框高度，单位为容器像素 |
| `maxCropWidth` | `number` | `Infinity` | 用户拖动后允许的最大裁剪框宽度，单位为容器像素 |
| `maxCropHeight` | `number` | `Infinity` | 用户拖动后允许的最大裁剪框高度，单位为容器像素 |

## 适用范围

- `cropBoxConstraintsEnabled = false` 时，其他五个约束 prop 不生效，组件保持现有行为。
- `cropBoxConstraintsEnabled = true` 时，约束作用于控制器拖动、首次及运行时 `cropLayout`、`setCropLayout()` 和 `reset()`。
- 运行时从 `false` 切换为 `true` 时，应用限制后的裁剪框重新位于容器中心；限制已开启后的其他约束参数更新不自动重新居中。
- 限制开关与 `cropBoxResizable` 独立；禁止用户拖动时，程序化尺寸入口仍可受约束。
- `cropAspectRatio` 未传入时保持现有自由宽高缩放。
- 默认最小宽高与当前内部 `24px` 最小操作尺寸一致；默认最大宽高不增加额外上限，仍由容器边界决定。
- 程序化请求不符合固定比例时，在请求宽高范围内取最大的目标比例框；低于最小限制时再按比例扩大。
- `setCropAxis()` 不受尺寸限制影响。
- 一次拖动开始后使用当时的 prop 快照；运行期间更新参数，从下一次拖动开始生效。

## 交互规则

- 固定比例下，角控制器保持对应对角点不动。
- 固定比例下，左右边控制器保持对应对边不动，高度围绕纵向中心对称变化。
- 固定比例下，上下边控制器保持对应对边不动，宽度围绕横向中心对称变化。
- 最终结果同时满足宽高比、最小/最大宽高和容器边界。

## 调用方责任

调用方必须传入正数，并保证：

```text
minCropWidth <= maxCropWidth
minCropHeight <= maxCropHeight
```

同时应保证比例、尺寸限制和当前容器存在可行尺寸。组件不自动纠正、交换或忽略无效配置，也不新增错误提示。

## 示例

```vue
<vue-cropper
  :crop-box-resizable="true"
  :crop-box-constraints-enabled="true"
  :crop-aspect-ratio="4 / 3"
  :min-crop-width="160"
  :min-crop-height="120"
  :max-crop-width="640"
  :max-crop-height="480"
/>
```

## 现有契约保持不变

- 不新增事件；拖动过程继续通过 `change` 和 `real-time` 输出实际裁剪框。
- 不新增实例方法。
- 导出、实时预览和 `getCropCoordinates()` 继续读取当前实际裁剪框。
- `cropBoxResizable` 默认值仍为 `false`。
- `cropBoxConstraintsEnabled` 默认值为 `false`。
