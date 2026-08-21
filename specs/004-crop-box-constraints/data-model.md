# 数据模型：裁剪框比例与尺寸限制

## 1. 裁剪框约束

表示一次用户拖动允许产生的裁剪框尺寸范围。

| 字段 | 类型 | 默认值 | 含义 |
|---|---|---|---|
| `enabled` | `boolean` | `false` | 是否启用自定义比例和尺寸限制 |
| `aspectRatio` | `number \| undefined` | `undefined` | 宽度除以高度；未设置时自由比例 |
| `minWidth` | `number` | `24` | 最小裁剪框宽度 |
| `minHeight` | `number` | `24` | 最小裁剪框高度 |
| `maxWidth` | `number` | `Infinity` | 最大裁剪框宽度 |
| `maxHeight` | `number` | `Infinity` | 最大裁剪框高度 |

约束使用裁剪容器坐标系中的像素值。调用方负责保证数值为正、最小值不大于最大值，并保证约束与当前容器存在可行交集。

## 2. 约束缩放会话

在现有缩放会话中增加约束快照：

| 字段 | 类型 | 含义 |
|---|---|---|
| `direction` | 缩放方向 | 当前控制器方向 |
| `startPointer` | `{ x, y }` | 会话开始时的指针位置 |
| `startCrop` | 裁剪框几何 | 会话开始时的 `x/y/width/height` |
| `constraints` | 裁剪框约束 | 会话开始时读取的比例及尺寸限制 |
| `active` | `boolean` | 会话是否正在接收移动 |

### 状态转换

```text
空闲
  └─ 按下控制器
       ├─ 记录裁剪框、指针和约束快照
       └─ 缩放中
            ├─ 指针移动 → 计算满足快照约束的裁剪框
            └─ 松开 → 提交最终状态并结束会话
```

## 3. 自由比例结果

当 `aspectRatio` 未设置时：

- 水平尺寸独立满足 `minWidth <= width <= maxWidth`。
- 垂直尺寸独立满足 `minHeight <= height <= maxHeight`。
- 实际最大值还受到对应固定锚点到容器边界距离的限制。
- 现有八方向固定对边规则保持不变。

## 4. 固定比例结果

当 `aspectRatio` 已设置时：

```text
width / height = aspectRatio
```

允许宽度区间由以下条件求交集：

```text
width >= minWidth
width >= minHeight * aspectRatio
width <= maxWidth
width <= maxHeight * aspectRatio
width <= 当前方向与锚点允许的横向容器空间
width / aspectRatio <= 当前方向与锚点允许的纵向容器空间
```

最终高度始终由 `height = width / aspectRatio` 得到，不再独立夹取。

## 5. 锚点规则

| 控制器 | 固定位置 | 比例联动 |
|---|---|---|
| `nw` / `ne` / `sw` / `se` | 对角点 | 横纵候选中变化更明显的一轴驱动 |
| `w` / `e` | 对边 | 高度围绕起始纵向中心对称变化 |
| `n` / `s` | 对边 | 宽度围绕起始横向中心对称变化 |

## 6. 程序化布局结果

- 限制关闭时，初始 `cropLayout`、运行时 prop 更新、`setCropLayout()` 和 `reset()` 保持现有行为。
- 限制开启时，上述四类入口均通过同一有效尺寸计算。
- 自由比例下，宽高分别进入最小/最大尺寸与容器边界的交集。
- 固定比例下，先在请求宽高内取最大比例框，再进入统一比例可行区间。
- 请求结果低于最小限制时，按比例扩大到最小可行尺寸。
- `setCropAxis()` 不进入约束计算。

### 示例

```text
请求：300 × 200
比例：1:1
请求范围内最大比例框：200 × 200
```

## 7. 运行时开启限制的位置转换

```text
限制关闭
  └─ cropBoxConstraintsEnabled: false → true
       ├─ 计算最新有效裁剪尺寸
       └─ cropAxis = 容器中心对应的左上角坐标
```

限制已经开启后的比例、最小/最大尺寸更新不进入该位置转换，继续沿用当前坐标与现有边界处理。
