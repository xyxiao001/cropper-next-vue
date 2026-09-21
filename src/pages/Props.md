<LangBlock lang="zh">

# 参数

按任务查找 30 个公开参数。先阅读 [核心概念](#/concepts)，再按下表配置；所有默认值均为组件默认值，首页与场景演示会显式开启部分能力。


<h2 id="source-layout">图片与初始布局</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
img | 图片地址 | `''` | `string`
wrapper | 外层容器宽高 | `{ width: 300, height: 300 }` | `{ width: number \| string; height: number \| string }`
cropLayout | 截图框大小 | `{ width: 200, height: 200 }` | `{ width: number \| string; height: number \| string }`
mode | 图片初始布局方式 | `'cover'` | `contain`、`cover`、`original`、`100px`、`100%`、`auto 100px` 等
defaultRotate | 默认旋转角度 | `0` | `number`
previewMaxSide | 预览用最大边长像素（仅影响预览渲染，不影响导出结果） | `2048` | `number`

<h2 id="interaction">移动与缩放</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
movable | 是否允许用户拖拽图片和截图框 | `true` | `boolean`
zoomable | 是否允许用户通过鼠标滚轮或双指手势缩放 | `true` | `boolean`
zoomAnchor | 缩放锚点 | `'pointer'` | `center`、`pointer`
minScale | 图片允许的绝对最小缩放比例 | `0.01` | `number`
maxScale | 图片允许的绝对最大缩放比例 | `Infinity` | `number`

<h2 id="crop-constraints">裁剪框与比例限制</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
cropBoxResizable | 是否允许用户通过四边和四角控制点缩放裁剪框 | `false` | `boolean`
cropBoxConstraintsEnabled | 是否启用裁剪框比例和尺寸限制 | `false` | `boolean`
cropAspectRatio | 限制开启后保持的宽高比（宽度 ÷ 高度） | `undefined` | `number`
minCropWidth | 限制开启后允许的最小裁剪框宽度 | `24` | `number`，容器像素
minCropHeight | 限制开启后允许的最小裁剪框高度 | `24` | `number`，容器像素
maxCropWidth | 限制开启后允许的最大裁剪框宽度 | `Infinity` | `number`，容器像素
maxCropHeight | 限制开启后允许的最大裁剪框高度 | `Infinity` | `number`，容器像素

<h2 id="boundary">边界覆盖与回弹</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
centerBox | 图片是否持续覆盖裁剪框 | `false` | `boolean`
centerWrapper | 图片是否持续覆盖整个容器 | `false` | `boolean`
centerBoxDelay | 图片限制截图框内时的回弹时长 | `100` | `number`
centerWrapperDelay | 图片限制容器内时的回弹时长 | `100` | `number`

<h2 id="export">导出格式与像素</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
outputType | 输出图片格式 | `'png'` | `jpeg`、`png`、`webp`
outputSize | 输出图片质量 | `1` | `number`，建议 `0-1`
full | 是否按高分屏方式导出 | `true` | `boolean`
original | 按源图像素导出（裁剪区域尺寸除以当前缩放比例） | `false` | `boolean`
maxSideLength | 限制导出图片最长边像素（`0` 表示不限制） | `3000` | `number`

<h2 id="appearance">外观与滤镜</h2>

名称 | 功能 | 默认值 | 类型 / 可选值
--- | --- | --- | ---
color | 主题色预留字段 | `'#fff'` | `string`
cropColor | 截图框描边颜色 | `'#fff'` | `string`
filter | 图片滤镜函数 | `null` | `(canvas) => canvas`

<h2 id="section-1">说明</h2>

- `centerBox` 让图片覆盖裁剪框，`centerWrapper` 让图片覆盖整个容器，避免目标区域露白；拖动时可暂时越界，结束后回弹。两者同时开启时，`centerBox` 优先。它们都不是“把整张图片缩进框里”；初始适配由 `mode` 控制。
- `zoomAnchor` 默认为 `pointer`：鼠标滚轮以光标位置缩放，双指缩放以两指中心点缩放；设为 `center` 时改为保持图片中心缩放。实例方法 `zoomIn`、`zoomOut` 和 `changeScale` 仍以图片中心缩放。
- `movable` 只控制鼠标和单指拖拽；设为 `false` 后，`setCropAxis()`、`reset()` 等实例方法仍可改变状态。
- `zoomable` 只控制鼠标滚轮和双指缩放；设为 `false` 后，`zoomIn()`、`zoomOut()`、`changeScale()` 和 `reset()` 仍可使用。
- `cropBoxResizable` 默认关闭。开启后，可使用鼠标或单指触摸拖动裁剪框四边和四角；拖动时显示九宫格构图参考，松手后渐隐。裁剪框始终限制在容器内，缩放手势不会触发图片拖拽或裁剪框整体移动。全屏截图模式下不显示九宫格和控制点。首页体验区为了直接演示该能力，默认开启了这个参数。
- `cropBoxConstraintsEnabled` 默认关闭，并与 `cropBoxResizable` 相互独立。关闭时，即使传入比例或最小/最大尺寸，拖动和程序化尺寸入口仍保持现有行为；运行时从关闭切换为开启后，限制同时作用于拖动、初始及运行时 `cropLayout`、`setCropLayout()` 和 `reset()`，应用限制后的裁剪框会重新居中。限制已开启后的其他约束参数更新不会再次强制居中。
- `cropAspectRatio` 使用“宽度 ÷ 高度”表示，例如 `1`、`4 / 3`、`16 / 9`；不传时保持自由比例。固定比例时，角控制器保持对角位置，边控制器保持对应对边不动，另一维围绕中心对称变化。
- `minCropWidth`、`minCropHeight`、`maxCropWidth` 和 `maxCropHeight` 使用容器像素。一次拖动使用开始时的参数快照；运行时更新从下一次拖动生效。
- 程序化宽高不符合固定比例时，会在请求范围内取最大的目标比例框；若结果低于最小尺寸，再按比例扩大到最小可行尺寸。`setCropAxis()` 只改变坐标，不进入尺寸限制。调用方应传入正数，保证最小值不大于最大值，并保证比例、尺寸和当前容器存在可行范围；组件不会自动纠正无效组合。
- `minScale` 和 `maxScale` 同时作用于滚轮、双指和公开缩放方法。调用方应传入正数并保证 `minScale <= maxScale`；当边界覆盖所需比例高于 `maxScale` 时，边界覆盖优先。
- 当图片发生旋转后，边界限制会重新校验。
- `filter` 接收一个 `HTMLCanvasElement`，返回处理后的 `HTMLCanvasElement`。
- `outputSize` 会影响 `jpeg / webp` 等格式的压缩质量（取值范围 `0-1`，默认 `1`）。
  - `1`：最高画质，文件最大，适合高清裁剪图、打印或高分屏展示。
  - `0.9`：画质接近原图，但文件明显更小，适合网页预览或社交分享。
  - `0.8` 及以下：压缩更大，文件更小，适合批量导出或对画质要求不高的场景。
  - 一般网页/社交分享建议 `0.9`，追求最清晰视觉效果可保持 `1`。
- `full` 默认开启，导出时会按当前设备像素比生成更适合高分屏的结果。
- `original` 影响导出像素：开启后，以裁剪区域尺寸除以图片当前缩放比例，换算为源图像素。因此比例小于 1 时像素增多，大于 1 时像素减少；`full` 和 `maxSideLength` 仍影响最终尺寸。
- `maxSideLength` 用于保护导出性能，默认把最长边压到 `3000` 以内；传 `0` 可关闭该限制。
- `previewMaxSide` 用于保护预览渲染性能：当原图边长过大时，内部会对“预览用图片”做下采样；不影响导出结果清晰度。
- `wrapper` 和 `cropLayout` 现在都支持传 `number` 或 `string`，例如 `300`、`'300px'`、`'60%'`。
- `cropLayout` 使用百分比时，是基于当前 `wrapper` 宽高进行换算。
- 当 `cropLayout` 大于等于 `wrapper` 时，会进入“全屏截图模式”：裁剪区域等于容器大小，截图框不显示，并展示一个淡淡的边框/蒙层提示。
- 当前版本没有旧版 `autoCrop`、`fixed`、`canMoveBox`、`enlarge`、`maxImgSize` 等参数，这些属于旧实现，不再适用。

</LangBlock>

<LangBlock lang="en">

# Props

Find 30 public props by task. Start with [core concepts](#/concepts), then use these tables. Defaults belong to the component; the home page and scenarios explicitly enable additional options.


<h2 id="source-layout">Image and initial layout</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
img | Image source | `''` | `string`
wrapper | Outer container size | `{ width: 300, height: 300 }` | `{ width: number \| string; height: number \| string }`
cropLayout | Crop-box size | `{ width: 200, height: 200 }` | `{ width: number \| string; height: number \| string }`
mode | Initial image layout mode | `'cover'` | `contain`, `cover`, `original`, `100px`, `100%`, `auto 100px`, etc.
defaultRotate | Initial rotation angle | `0` | `number`
previewMaxSide | Max edge size used for preview rendering only (does not affect export) | `2048` | `number`

<h2 id="interaction">Movement and zoom</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
movable | Allow users to drag the image and crop box | `true` | `boolean`
zoomable | Allow mouse-wheel and pinch zoom | `true` | `boolean`
zoomAnchor | Zoom anchor | `'pointer'` | `center`, `pointer`
minScale | Absolute minimum image scale | `0.01` | `number`
maxScale | Absolute maximum image scale | `Infinity` | `number`

<h2 id="crop-constraints">Crop box and constraints</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
cropBoxResizable | Allow resizing the crop box from its four edges and four corners | `false` | `boolean`
cropBoxConstraintsEnabled | Enable crop-box ratio and size constraints | `false` | `boolean`
cropAspectRatio | Aspect ratio used while constraints are enabled (`width / height`) | `undefined` | `number`
minCropWidth | Minimum crop-box width while constraints are enabled | `24` | `number`, wrapper pixels
minCropHeight | Minimum crop-box height while constraints are enabled | `24` | `number`, wrapper pixels
maxCropWidth | Maximum crop-box width while constraints are enabled | `Infinity` | `number`, wrapper pixels
maxCropHeight | Maximum crop-box height while constraints are enabled | `Infinity` | `number`, wrapper pixels

<h2 id="boundary">Boundary coverage and rebound</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
centerBox | Keep image covering the crop box | `false` | `boolean`
centerWrapper | Keep image covering the entire wrapper | `false` | `boolean`
centerBoxDelay | Rebound duration for `centerBox` | `100` | `number`
centerWrapperDelay | Rebound duration for `centerWrapper` | `100` | `number`

<h2 id="export">Export format and pixels</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
outputType | Export image format | `'png'` | `jpeg`, `png`, `webp`
outputSize | Export quality | `1` | `number`, recommended `0-1`
full | Export for high-DPI output | `true` | `boolean`
original | Export at source pixel scale (divide crop size by current image scale) | `false` | `boolean`
maxSideLength | Clamp export max edge size (`0` disables clamping) | `3000` | `number`

<h2 id="appearance">Appearance and filters</h2>

Name | Purpose | Default | Type / Allowed values
--- | --- | --- | ---
color | Reserved theme color field | `'#fff'` | `string`
cropColor | Crop-box outline color | `'#fff'` | `string`
filter | Image filter callback | `null` | `(canvas) => canvas`

<h2 id="section-1">Notes</h2>

- `centerBox` keeps the crop box covered; `centerWrapper` keeps the entire wrapper covered. Dragging can temporarily overshoot before rebounding. If both are enabled, `centerBox` takes priority. These options do not fit the whole image inside a box; `mode` controls initial fitting.
- `zoomAnchor` defaults to `pointer`: mouse-wheel zoom uses the cursor position and pinch zoom uses the midpoint between both touches. Set it to `center` to keep the image center fixed. The `zoomIn`, `zoomOut`, and `changeScale` instance methods still zoom from the image center.
- `movable` controls mouse and single-touch dragging only. When it is `false`, instance methods such as `setCropAxis()` and `reset()` can still update state.
- `zoomable` controls mouse-wheel and pinch zoom only. When it is `false`, `zoomIn()`, `zoomOut()`, `changeScale()`, and `reset()` remain available.
- `cropBoxResizable` is disabled by default. When enabled, users can drag the crop box's four edges and four corners with a mouse or one finger. A rule-of-thirds grid appears while dragging and fades after release. The box stays inside the wrapper, and resize gestures do not drag the image or move the whole crop box. The grid and handles are hidden in full-frame crop mode. The home-page playground enables this prop by default so the feature is immediately visible.
- `cropBoxConstraintsEnabled` is disabled by default and is independent from `cropBoxResizable`. While disabled, ratio and min/max props do not change handle dragging or programmatic size entries. Switching it from disabled to enabled applies the constraints to handle dragging, initial and runtime `cropLayout`, `setCropLayout()`, and `reset()`, and recenters the constrained crop box. Later constraint-prop updates do not force another recenter.
- `cropAspectRatio` is expressed as `width / height`, for example `1`, `4 / 3`, or `16 / 9`; omit it for free resizing. With a fixed ratio, corner handles keep the opposite corner fixed. Edge handles keep the opposite edge fixed and resize the paired dimension symmetrically around its center.
- `minCropWidth`, `minCropHeight`, `maxCropWidth`, and `maxCropHeight` use wrapper pixels. A drag uses the values captured when it starts; runtime updates apply to the next drag.
- When a programmatic size does not match the fixed ratio, the largest target-ratio box inside the requested size is used. If it is below the minimum, it expands proportionally to the minimum feasible size. `setCropAxis()` changes coordinates only and does not enter size constraints. Callers should provide positive values, keep each minimum no greater than its maximum, and ensure the ratio, size limits, and wrapper have a feasible intersection. The component does not correct invalid combinations automatically.
- `minScale` and `maxScale` apply to wheel, pinch, and public zoom methods. Callers should provide positive values with `minScale <= maxScale`. Boundary coverage takes priority when its required scale exceeds `maxScale`.
- Boundary checks are recalculated after rotation.
- `filter` receives an `HTMLCanvasElement` and should return a processed `HTMLCanvasElement`.
- `outputSize` affects compressed formats such as `jpeg` and `webp` (range `0-1`, default `1`).
  - `1`: highest quality, largest file, good for crisp exports and retina display.
  - `0.9`: near-original quality with a noticeably smaller file, good for web preview/sharing.
  - `0.8` or lower: more compression and smaller files, good for batch export.
  - Recommended: `0.9` for most web/sharing, keep `1` for maximum clarity.
- `full` is enabled by default, so exports use the current device pixel ratio for sharper high-DPI output.
- `original` affects export pixel size: when enabled, crop dimensions are divided by the current image scale to obtain source pixels. Scales below 1 increase pixel dimensions; scales above 1 decrease them. `full` and `maxSideLength` still affect the result.
- `maxSideLength` protects export performance by clamping the longest edge to `3000` by default; pass `0` to disable.
- `previewMaxSide` protects preview performance by downscaling the internal preview image when the source is huge; it does not affect export quality.
- `wrapper` and `cropLayout` now both accept `number` or `string`, such as `300`, `'300px'`, or `'60%'`.
- Percentage-based `cropLayout` values are calculated based on the current `wrapper` size.
- When `cropLayout` is greater than or equal to `wrapper`, it enters a "full-frame crop mode": the crop area is clamped to the wrapper size, the crop box is hidden, and a subtle frame/mask hint is shown.
- The current version does not include old props such as `autoCrop`, `fixed`, `canMoveBox`, `enlarge`, or `maxImgSize`.

</LangBlock>
