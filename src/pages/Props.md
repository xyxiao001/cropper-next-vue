<LangBlock lang="zh">

# 参数

当前版本暴露的组件参数以 `lib/vue-cropper.vue` 为准。

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
img | 图片地址 | `''` | `string`
wrapper | 外层容器宽高 | `{ width: 300, height: 300 }` | `{ width: number \| string; height: number \| string }`
cropLayout | 截图框大小 | `{ width: 200, height: 200 }` | `{ width: number \| string; height: number \| string }`
color | 主题色预留字段 | `'#fff'` | `string`
filter | 图片滤镜函数 | `null` | `(canvas) => canvas`
outputType | 输出图片格式 | `'png'` | `jpeg`、`png`、`webp`
outputSize | 输出图片质量 | `1` | `number`，建议 `0-1`
full | 是否按高分屏方式导出 | `true` | `boolean`
original | 按原图比例导出（跟随当前缩放倍数放大导出像素） | `false` | `boolean`
maxSideLength | 限制导出图片最长边像素（`0` 表示不限制） | `3000` | `number`
previewMaxSide | 预览用最大边长像素（仅影响预览渲染，不影响导出结果） | `2048` | `number`
mode | 图片初始布局方式 | `'cover'` | `contain`、`cover`、`original`、`100px`、`100%`、`auto 100px` 等
zoomAnchor | 缩放锚点 | `'pointer'` | `center`、`pointer`
movable | 是否允许用户拖拽图片和截图框 | `true` | `boolean`
zoomable | 是否允许用户通过鼠标滚轮或双指手势缩放 | `true` | `boolean`
minScale | 图片允许的绝对最小缩放比例 | `0.01` | `number`
maxScale | 图片允许的绝对最大缩放比例 | `Infinity` | `number`
cropColor | 截图框描边颜色 | `'#fff'` | `string`
defaultRotate | 默认旋转角度 | `0` | `number`
centerBox | 图片是否限制在截图框内 | `false` | `boolean`
centerWrapper | 图片是否限制在容器内 | `false` | `boolean`
centerBoxDelay | 图片限制截图框内时的回弹时长 | `100` | `number`
centerWrapperDelay | 图片限制容器内时的回弹时长 | `100` | `number`

## 说明

- `centerBox` 和 `centerWrapper` 可以分别控制两种边界限制策略。
- `zoomAnchor` 默认为 `pointer`：鼠标滚轮以光标位置缩放，双指缩放以两指中心点缩放；设为 `center` 时改为保持图片中心缩放。实例方法 `zoomIn`、`zoomOut` 和 `changeScale` 仍以图片中心缩放。
- `movable` 只控制鼠标和单指拖拽；设为 `false` 后，`setCropAxis()`、`reset()` 等实例方法仍可改变状态。
- `zoomable` 只控制鼠标滚轮和双指缩放；设为 `false` 后，`zoomIn()`、`zoomOut()`、`changeScale()` 和 `reset()` 仍可使用。
- `minScale` 和 `maxScale` 同时作用于滚轮、双指和公开缩放方法。调用方应传入正数并保证 `minScale <= maxScale`；当边界覆盖所需比例高于 `maxScale` 时，边界覆盖优先。
- 当图片发生旋转后，边界限制会重新校验。
- `filter` 接收一个 `HTMLCanvasElement`，返回处理后的 `HTMLCanvasElement`。
- `outputSize` 会影响 `jpeg / webp` 等格式的压缩质量（取值范围 `0-1`，默认 `1`）。
  - `1`：最高画质，文件最大，适合高清裁剪图、打印或高分屏展示。
  - `0.9`：画质接近原图，但文件明显更小，适合网页预览或社交分享。
  - `0.8` 及以下：压缩更大，文件更小，适合批量导出或对画质要求不高的场景。
  - 一般网页/社交分享建议 `0.9`，追求最清晰视觉效果可保持 `1`。
- `full` 默认开启，导出时会按当前设备像素比生成更适合高分屏的结果。
- `original` 影响导出像素：开启后，会把导出分辨率按当前缩放倍数放大，以尽量贴近原图分辨率（仍会受 `maxSideLength` 限制）。
- `maxSideLength` 用于保护导出性能，默认把最长边压到 `3000` 以内；传 `0` 可关闭该限制。
- `previewMaxSide` 用于保护预览渲染性能：当原图边长过大时，内部会对“预览用图片”做下采样；不影响导出结果清晰度。
- `wrapper` 和 `cropLayout` 现在都支持传 `number` 或 `string`，例如 `300`、`'300px'`、`'60%'`。
- `cropLayout` 使用百分比时，是基于当前 `wrapper` 宽高进行换算。
- 当 `cropLayout` 大于等于 `wrapper` 时，会进入“全屏截图模式”：裁剪区域等于容器大小，截图框不显示，并展示一个淡淡的边框/蒙层提示。
- 当前版本没有旧版 `autoCrop`、`fixed`、`canMoveBox`、`enlarge`、`maxImgSize` 等参数，这些属于旧实现，不再适用。

</LangBlock>

<LangBlock lang="en">

# Props

The current public props are defined by `lib/vue-cropper.vue`

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
img | Image source | `''` | `string`
wrapper | Outer container size | `{ width: 300, height: 300 }` | `{ width: number \| string; height: number \| string }`
cropLayout | Crop-box size | `{ width: 200, height: 200 }` | `{ width: number \| string; height: number \| string }`
color | Reserved theme color field | `'#fff'` | `string`
filter | Image filter callback | `null` | `(canvas) => canvas`
outputType | Export image format | `'png'` | `jpeg`, `png`, `webp`
outputSize | Export quality | `1` | `number`, recommended `0-1`
full | Export for high-DPI output | `true` | `boolean`
original | Export using the original pixel ratio (scale export pixels up by the current zoom) | `false` | `boolean`
maxSideLength | Clamp export max edge size (`0` disables clamping) | `3000` | `number`
previewMaxSide | Max edge size used for preview rendering only (does not affect export) | `2048` | `number`
mode | Initial image layout mode | `'cover'` | `contain`, `cover`, `original`, `100px`, `100%`, `auto 100px`, etc.
zoomAnchor | Zoom anchor | `'pointer'` | `center`, `pointer`
movable | Allow users to drag the image and crop box | `true` | `boolean`
zoomable | Allow mouse-wheel and pinch zoom | `true` | `boolean`
minScale | Absolute minimum image scale | `0.01` | `number`
maxScale | Absolute maximum image scale | `Infinity` | `number`
cropColor | Crop-box outline color | `'#fff'` | `string`
defaultRotate | Initial rotation angle | `0` | `number`
centerBox | Keep image covering the crop box | `false` | `boolean`
centerWrapper | Keep image inside the wrapper | `false` | `boolean`
centerBoxDelay | Rebound duration for `centerBox` | `100` | `number`
centerWrapperDelay | Rebound duration for `centerWrapper` | `100` | `number`

## Notes

- `centerBox` and `centerWrapper` control two different boundary strategies.
- `zoomAnchor` defaults to `pointer`: mouse-wheel zoom uses the cursor position and pinch zoom uses the midpoint between both touches. Set it to `center` to keep the image center fixed. The `zoomIn`, `zoomOut`, and `changeScale` instance methods still zoom from the image center.
- `movable` controls mouse and single-touch dragging only. When it is `false`, instance methods such as `setCropAxis()` and `reset()` can still update state.
- `zoomable` controls mouse-wheel and pinch zoom only. When it is `false`, `zoomIn()`, `zoomOut()`, `changeScale()`, and `reset()` remain available.
- `minScale` and `maxScale` apply to wheel, pinch, and public zoom methods. Callers should provide positive values with `minScale <= maxScale`. Boundary coverage takes priority when its required scale exceeds `maxScale`.
- Boundary checks are recalculated after rotation.
- `filter` receives an `HTMLCanvasElement` and should return a processed `HTMLCanvasElement`.
- `outputSize` affects compressed formats such as `jpeg` and `webp` (range `0-1`, default `1`).
  - `1`: highest quality, largest file, good for crisp exports and retina display.
  - `0.9`: near-original quality with a noticeably smaller file, good for web preview/sharing.
  - `0.8` or lower: more compression and smaller files, good for batch export.
  - Recommended: `0.9` for most web/sharing, keep `1` for maximum clarity.
- `full` is enabled by default, so exports use the current device pixel ratio for sharper high-DPI output.
- `original` affects export pixel size: when enabled, export resolution scales up by the current zoom level (still clamped by `maxSideLength`).
- `maxSideLength` protects export performance by clamping the longest edge to `3000` by default; pass `0` to disable.
- `previewMaxSide` protects preview performance by downscaling the internal preview image when the source is huge; it does not affect export quality.
- `wrapper` and `cropLayout` now both accept `number` or `string`, such as `300`, `'300px'`, or `'60%'`.
- Percentage-based `cropLayout` values are calculated based on the current `wrapper` size.
- When `cropLayout` is greater than or equal to `wrapper`, it enters a "full-frame crop mode": the crop area is clamped to the wrapper size, the crop box is hidden, and a subtle frame/mask hint is shown.
- The current version does not include old props such as `autoCrop`, `fixed`, `canMoveBox`, `enlarge`, or `maxImgSize`.

</LangBlock>
