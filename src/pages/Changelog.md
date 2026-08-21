<LangBlock lang="zh">

# Changelog

这个页面用来记录每个版本的改动，方便回溯功能与 API 变化。

## 0.4.0

- 新增 `reset()`，无需重新加载图片即可恢复图片与裁剪框初始状态
- 新增结构化 `change` 事件，以及 `movable`、`zoomable` 交互开关
- 新增 `minScale`、`maxScale`、水平/垂直翻转和 `getCropCoordinates()` 原图裁剪坐标
- 鼠标滚轮和双指手势默认以指针或双指中心缩放，可通过 `zoomAnchor` 切换中心缩放
- 新增可选的八方向裁剪框缩放、调整时九宫格，以及固定比例和最小/最大尺寸限制
- 限制开关开启后统一约束交互与程序化尺寸入口，并在运行时开启限制时重新居中裁剪框
- 更新首页、聚焦示例、全功能工作台和中英文 API 文档

## 0.3.1

- 修复图片缩小到截图框以下再回弹时出现的位置偏移
- 修复横图回弹后向右移动、竖图回弹后向下移动的问题
- 补充横图与竖图缩放回弹的边界回归测试

## 0.3.0

- 新增实例缩放方法：`zoomIn`、`zoomOut`、`changeScale`
- 首页补充缩放按钮示例，文档补齐缩放方法说明
- 修复连续滚轮缩放后加速状态未复位导致缩放幅度异常的问题
- 优化大图按钮缩放体验，`zoomIn` / `zoomOut` 改为按当前缩放比例相对调整

## 0.2.0

- 重构核心实现，拆分 composables，便于维护与扩展（对外 API 基本保持不变）
- 预览链路优化：基于 `wrapper + dpr` 生成预览并支持 `previewMaxSide` 限制，提升大图性能与稳定性
- 更新文档与示例页（Props / Event / Demo 等）
- 补充并修复测试用例（新增 preview 单测，组件用例适配 jsdom）

## 0.1.3

- 新增实例方法：`reload`、`setRotateAngle`、`setCropLayout`、`setCropAxis`
- `cropLayout` 支持基于 `wrapper` 的百分比换算（如 `'60%'`）
- 当 `cropLayout >= wrapper` 进入“全屏截图模式”时，新增淡边框/蒙层视觉提示

## 0.1.2

- 新增导出参数：`original`（按当前缩放倍数放大导出像素）
- 新增导出参数：`maxSideLength`（限制导出最长边像素，默认 `3000`，传 `0` 关闭）

</LangBlock>

<LangBlock lang="en">

# Changelog

This page tracks version changes and API updates.

## 0.4.0

- Added `reset()` to restore initial image and crop-box state without reloading the image
- Added the structured `change` event and the `movable` / `zoomable` interaction switches
- Added `minScale`, `maxScale`, horizontal/vertical flips, and source crop coordinates through `getCropCoordinates()`
- Mouse-wheel and pinch gestures now zoom from the pointer or touch midpoint by default, with center zoom available through `zoomAnchor`
- Added optional eight-direction crop-box resizing, a transient rule-of-thirds grid, and fixed-ratio/min-max size constraints
- Enabled constraints now apply to interactive and programmatic size entries, and runtime activation recenters the constrained crop box
- Updated the home page, focused demos, full-featured workspace, and bilingual API documentation

## 0.3.1

- Fixed image position drift when zooming below the crop-box size and rebounding
- Fixed landscape images shifting right and portrait images shifting down after rebound
- Added boundary regression tests for landscape and portrait zoom rebound

## 0.3.0

- Added public zoom instance methods: `zoomIn`, `zoomOut`, and `changeScale`
- Added zoom button examples on the home page and updated method docs
- Fixed abnormal zoom jumps after continuous mouse-wheel zooming by resetting wheel acceleration state
- Improved large-image button zooming by making `zoomIn` / `zoomOut` relative to the current scale

## 0.2.0

- Refactored the core implementation by splitting logic into composables (public API stays mostly the same)
- Improved preview pipeline: generates preview with `wrapper + dpr` and adds a `previewMaxSide` cap for large images
- Updated docs and demo pages (Props / Event / Demos)
- Improved tests (added preview unit tests and stabilized component tests in jsdom)

## 0.1.3

- Added instance methods: `reload`, `setRotateAngle`, `setCropLayout`, `setCropAxis`
- Percentage-based `cropLayout` values now respect the current `wrapper` size (e.g. `'60%'`)
- Added a subtle frame/mask hint when entering the "full-frame crop mode" (`cropLayout >= wrapper`)

## 0.1.2

- Added export prop: `original` (scale up export pixels by the current zoom)
- Added export prop: `maxSideLength` (clamp export max edge size, default `3000`, `0` disables)

</LangBlock>
