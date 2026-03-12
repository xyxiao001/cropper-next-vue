<LangBlock lang="zh">

# 参数

当前版本暴露的组件参数以 [lib/vue-cropper.vue](/Users/bytedance/projects/cropper-next/lib/vue-cropper.vue) 为准。

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
mode | 图片初始布局方式 | `'cover'` | `contain`、`cover`、`original`、`100px`、`100%`、`auto 100px` 等
cropColor | 截图框描边颜色 | `'#fff'` | `string`
defaultRotate | 默认旋转角度 | `0` | `number`
centerBox | 图片是否限制在截图框内 | `false` | `boolean`
centerWrapper | 图片是否限制在容器内 | `false` | `boolean`
centerBoxDelay | 图片限制截图框内时的回弹时长 | `100` | `number`
centerWrapperDelay | 图片限制容器内时的回弹时长 | `100` | `number`

## 说明

- `centerBox` 和 `centerWrapper` 可以分别控制两种边界限制策略。
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
- `wrapper` 和 `cropLayout` 现在都支持传 `number` 或 `string`，例如 `300`、`'300px'`、`'60%'`。
- 当前版本没有旧版 `autoCrop`、`fixed`、`canMoveBox`、`enlarge`、`maxImgSize` 等参数，这些属于旧实现，不再适用。

</LangBlock>

<LangBlock lang="en">

# Props

The current public props are defined by [lib/vue-cropper.vue](/Users/bytedance/projects/cropper-next/lib/vue-cropper.vue).

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
mode | Initial image layout mode | `'cover'` | `contain`, `cover`, `original`, `100px`, `100%`, `auto 100px`, etc.
cropColor | Crop-box outline color | `'#fff'` | `string`
defaultRotate | Initial rotation angle | `0` | `number`
centerBox | Keep image covering the crop box | `false` | `boolean`
centerWrapper | Keep image inside the wrapper | `false` | `boolean`
centerBoxDelay | Rebound duration for `centerBox` | `100` | `number`
centerWrapperDelay | Rebound duration for `centerWrapper` | `100` | `number`

## Notes

- `centerBox` and `centerWrapper` control two different boundary strategies.
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
- `wrapper` and `cropLayout` now both accept `number` or `string`, such as `300`, `'300px'`, or `'60%'`.
- The current version does not include old props such as `autoCrop`, `fixed`, `canMoveBox`, `enlarge`, or `maxImgSize`.

</LangBlock>
